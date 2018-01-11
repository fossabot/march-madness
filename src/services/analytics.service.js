class AnalyticsService {
  // static headToHead(home, away) {
  //   Object.keys(home).forEach((key) => {
  //     home[key]
  //   });
  // }

  static getStatWeightings() {
    return Promise.resolve({
      gp: 0.2,
      win: 0.2,
      loss: 0.2,
      sos: 0.2,
      rpi: 0.2,
    });
  }

  static calculateWeightings(teams) {
    return this.getStatWeightings()
      .then(weights => (
        teams.map((team) => {
          Object.keys(weights).forEach((stat) => {
            const update = {};
            update[stat] = [team[stat], team[stat] * weights[stat]];
            Object.assign(team, update);
          });

          return team;
        })
      ));
  }
}

module.exports = AnalyticsService;
