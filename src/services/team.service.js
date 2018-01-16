import Query from '@domoinc/query';
import { TEAM_STAT_FIELDS, TEAM_ALIAS, TEAM_NAME } from '../utils/constants';
import { Analytics } from '../services';

/**
 * Service for interacting with the "team" resource in Domo
 */
class TeamService {
  constructor() {
    this.alias = TEAM_ALIAS;
    this.teams = [];
  }

  /**
   * Get an array of team names from Domo. Will cache the results
   * locally for faster filtering
   */
  getTeamList() {
    if (this.teams.length > 0) return Promise.resolve(this.teams);

    return (new Query())
      .select(TEAM_NAME)
      .groupBy(TEAM_NAME)
      .fetch(this.alias)
      .then(res => res.map(row => row.team))
      .then(teams => teams.sort())
      .then((teams) => {
        this.teams = teams;

        return this.teams;
      });
  }

  /**
   * Filter the team list where name includes
   * the provided partial
   *
   * @param {string} partial
   */
  filterTeamList(partial) {
    return this.getTeamList()
      .then(teams => (
        (typeof partial !== 'string' || partial.length < 2)
          ? (teams)
          : (teams.filter(team => team.toLowerCase().includes(partial.toLowerCase())))
      ));
  }

  /**
   * Request stats for provided list of team names
   *
   * @param {string} name
   */
  getTeamStats(name, home = true) {
    return (new Query())
      .select([...TEAM_STAT_FIELDS, 'team'])
      .where(TEAM_NAME).equals(name)
      .fetch(this.alias)
      .then(this.prepareTeam)
      .then(team => Analytics.setTeam(team, home));
  }

  prepareTeam(res) {
    const team = res[0];

    Object.keys(team).forEach((key) => {
      const stat = team[key];
      if (typeof stat !== 'number' && typeof stat !== 'string') {
        team[key] = 0;
      }
    });

    return team;
  }
}

module.exports = new TeamService();
