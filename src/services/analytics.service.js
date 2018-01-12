class AnalyticsService {
  constructor() {
    this.home = undefined;
    this.away = undefined;
    this.weights = {
      win: [0.2, 1],
      loss: [0.2, -1],
      sos: [0.2, -1],
      rpi: [0.2, 1],
      spg: [0.2, 1],
    };
  }

  setTeam(team, isHome) {
    this[isHome ? 'home' : 'away'] = team;

    return team;
  }

  isReady() {
    return (this.home !== undefined && this.away !== undefined);
  }

  run() {
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

        return results;
      });
  }

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

  getStatWeightings() {
    return Promise.resolve(this.weights);
  }
}

module.exports = new AnalyticsService();
