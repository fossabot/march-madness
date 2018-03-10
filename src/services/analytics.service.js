import { AppCtrl } from '../controllers';

// hard coding these for now
const defaultWeights = {
  win: { value: 0.25, invert: false },
  loss: { value: 0.25, invert: true },
  sos: { value: 0.25, invert: true },
  rpi: { value: 0.25, invert: false },
};
const TEAM_KEY = 'ncaa-persisted-teams';
const WEIGHTS_KEY = 'ncaa-persisted-weights';

/**
 * Service for performing simple analysis
 */
class AnalyticsService {
  constructor() {
    this.app = AppCtrl;
    this.hydrateTeams();
    this.hydrateWeights();
  }

  // Updates singleton reference for either home or away team
  setTeam(team, isHome) {
    this[isHome ? 'home' : 'away'] = team;
    const persisted = JSON.stringify({ home: this.home, away: this.away });
    window.localStorage.setItem(TEAM_KEY, persisted);

    return team;
  }

  // have both teams been set and model ready to run?
  isReady() {
    return (this.home !== undefined && this.away !== undefined);
  }

  // calculate weighted team stats
  run() {
    this.app.toggleLoading();

    return this
      .getStatWeightings()
      .then((weights) => {
        const results = [];

        Object.keys(weights).forEach((stat) => {
          const { value, invert } = this.weights[stat];
          const homeStat = this.home[stat];
          const awayStat = this.away[stat];

          const homeWin = (
            (invert && homeStat <= awayStat)
            || (!invert && homeStat >= awayStat)
          );

          results.push({
            stat,
            results: [homeWin, !homeWin],
            weights: [homeWin ? value : 0, (!homeWin) ? value : 0],
          });
        });

        this.app.toggleLoading();
        return results;
      })
      .catch(() => this.app.toggleLoading());
  }

  // does home have more points than away?
  homeWinner(results) {
    const [homeTotal, awayTotal] = results
      .map(s => s.weights)
      .reduce((memo, stat) => {
        memo[0] += stat[0];
        memo[1] += stat[1];

        return memo;
      }, [0, 0]);

    return homeTotal >= awayTotal;
  }

  // get internal weighting reference
  getStatWeightings() {
    return Promise.resolve(this.weights);
  }

  // update internal reference for weightings
  updateStatWeightings(weights) {
    this.weights = weights;
    window.localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
  }

  // private method to load persisted teams
  hydrateTeams() {
    try {
      const persistedTeams = JSON.parse(window.localStorage.getItem(TEAM_KEY));
      this.home = persistedTeams && persistedTeams.home ? persistedTeams.home : undefined;
      this.away = persistedTeams && persistedTeams.away ? persistedTeams.away : undefined;
    } catch (error) {
      this.home = undefined;
      this.away = undefined;
    }
  }

  // private method to load persisted weights
  hydrateWeights() {
    try {
      const persistedWeights = JSON.parse(window.localStorage.getItem(WEIGHTS_KEY));
      this.weights = persistedWeights || defaultWeights;
    } catch (error) {
      this.weights = defaultWeights;
    }
  }
}

// export a singleton
export default new AnalyticsService();
