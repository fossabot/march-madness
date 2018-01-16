import { AppCtrl } from '../controllers';

/**
 * Service for performing simple analysis
 */
class AnalyticsService {
  constructor() {
    this.app = AppCtrl;
    this.home = undefined;
    this.away = undefined;

    // hardcoding these for now
    this.weights = {
      win: { value: 0.25, invert: false },
      loss: { value: 0.25, invert: true },
      sos: { value: 0.25, invert: true },
      rpi: { value: 0.25, invert: false },
    };
  }

  // Updates singletone reference for either home or away team
  setTeam(team, isHome) {
    this[isHome ? 'home' : 'away'] = team;

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
          const [weight, operator] = this.weights[stat];
          const homeStat = this.home[stat];
          const awayStat = this.away[stat];
          const homeWin = (
            (operator < 0 && homeStat <= awayStat)
            || (operator > 0 && homeStat >= awayStat)
          );

          results.push({
            stat,
            results: [homeWin, !homeWin],
            weights: [homeWin ? weight : 0, (!homeWin) ? weight : 0],
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
  }
}

// export a singleton
module.exports = new AnalyticsService();
