import Query from '@domoinc/query';
import { TEAM_STAT_FIELDS, TEAM_ALIAS, TEAM_NAME } from '../utils/constants';
import { Analytics } from '../services';
import { AppCtrl } from '../controllers';

/**
 * Service for interacting with the "team" resource in Domo
 */
class TeamService {
  constructor() {
    this.app = AppCtrl;
    this.alias = TEAM_ALIAS;
    this.teams = [];
  }

  /**
   * Get an array of team names from Domo. Will cache the results
   * locally for faster filtering
   */
  getTeamList() {
    this.app.toggleLoading();

    if (this.teams.length > 0) return Promise.resolve(this.teams);

    return (new Query())
      .select(TEAM_NAME)
      .groupBy(TEAM_NAME)
      .fetch(this.alias)
      .then(res => res.map(row => row.team))
      .then(teams => teams.sort())
      .then((teams) => {
        this.app.toggleLoading();
        this.teams = teams;

        return this.teams;
      })
      .catch(() => this.app.toggleLoading());
  }

  /**
   * Filter the team list where name includes
   * the provided partial
   *
   * @param {string} partial
   */
  filterTeamList(partial) {
    this.app.toggleLoading();

    return this.getTeamList()
      .then(teams => (
        (typeof partial !== 'string' || partial.length < 2)
          ? (teams)
          : (teams.filter(team => team.toLowerCase().includes(partial.toLowerCase())))
      ))
      .then((teams) => {
        this.app.toggleLoading();

        return teams;
      })
      .catch(() => this.app.toggleLoading());
  }

  /**
   * Request stats for provided list of team names
   *
   * @param {string} name
   */
  getTeamStats(name, home = true) {
    this.app.toggleLoading();

    return (new Query())
      .select([...TEAM_STAT_FIELDS, 'team'])
      .where(TEAM_NAME).equals(name)
      .fetch(this.alias)
      .then(this.prepareTeam)
      .then((team) => {
        this.app.toggleLoading();

        return Analytics.setTeam(team, home);
      })
      .catch(() => this.app.toggleLoading());
  }

  // helper function to prepare team resource for use in app
  prepareTeam(res) {
    const team = res[0];

    // replace invalid data types with 0
    Object.keys(team).forEach((key) => {
      const stat = team[key];
      if (typeof stat !== 'number' && typeof stat !== 'string') team[key] = 0;
    });

    return team;
  }
}

module.exports = new TeamService();
