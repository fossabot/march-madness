import domo from 'ryuu.js';
import Query from '@domoinc/query';
import { TeamService, Analytics } from '../services';
import { SELECTORS, TEAM_NAME, HOME_ID, AWAY_ID, TEAM_ALIAS } from '../utils/constants';

// Navigation destination
const PAGE_URL = '/page/1698810256';

// Create page filters to pass into the URL
const createPageFilters = (teamName, column, dataSourceId) => {
  const filters = [
    {
      column: encodeURIComponent(column),
      dataSourceId,
      dataType: 'string',
      operand: 'IN',
      values: [encodeURIComponent(teamName)],
    },
  ];
  return JSON.stringify(filters);
};

// this is called when the user clicks the "View Details" button. It grabs the team name,
// creates a url with page filters and then calls domo.navigate. More documentation on
// domo.navigate can be found here: https://developer.domo.com/docs/dev-studio-references/domo-js#domo.navigate
const viewDetails = () => (evt) => {
  // we first fire off a query so that we can retrieve the unaliased column name
  // along with the data source id, both of which we need to perform page filtering on navigation
  new Query()
    .select(TEAM_NAME)
    .groupBy(TEAM_NAME)
    .limit(1)
    .fetch(TEAM_ALIAS, { acceptType: 'application/json' })
    .then((data) => {
      const { datasource, columns } = data;
      const unaliasedColumn = columns[0];
      const team = evt.target.parentNode.querySelector(SELECTORS.teamTitle).innerText;

      const pageFilters = createPageFilters(team, unaliasedColumn, datasource);
      const target = `${PAGE_URL}?pfilters=${pageFilters}`;
      domo.navigate(target);
    });
};

/**
 * Team Controller
 *
 * Functions for interacting with the DOM to manage elements
 * related to the "Home" and "Away" team
 */

// Show / Hide team selector menus
const toggleDropdown = (evt) => {
  const dm = (typeof evt.target !== 'undefined')
    ? evt.target.parentNode.parentNode.querySelector(SELECTORS.dropdownContent)
    : evt.parentNode;

  dm.classList.toggle('open');
};

// render team stat details
const updateTeam = (id) => {
  const el = document.getElementById(id);

  return (team) => {
    const title = el.querySelector(SELECTORS.teamTitle);
    title.innerText = team.team;

    const btn = el.querySelector(SELECTORS.teamButton);
    btn.disabled = false;

    const stats = el.querySelector(SELECTORS.teamStats);
    stats.innerHTML = Object.keys(team)
      .filter(key => key !== TEAM_NAME)
      .map(key => (
        `<div class="stat" data-stat=${key}>${key}
          <span class="value">${team[key]}</span>
        </div>`
      ))
      .join('');

    return stats;
  };
};

// determine which team stat won
const updateTeamStat = (stat) => {
  const stats = document.querySelectorAll(SELECTORS.teamStat(stat.stat));
  stat.results.forEach((win, index) => {
    if (win) {
      stats[index].classList.add(SELECTORS.winningTeam);
    } else {
      stats[index].classList.remove(SELECTORS.winningTeam);
    }
  });

  return stat;
};

// update all team stats for win/loss
const updateTeamStats = results => results.map(updateTeamStat);

// update the winning team container class
const findWinningTeam = (results) => {
  if (Analytics.homeWinner(results)) {
    document.getElementById(HOME_ID).classList.add(SELECTORS.winningTeam);
    document.getElementById(AWAY_ID).classList.remove(SELECTORS.winningTeam);
  } else {
    document.getElementById(HOME_ID).classList.remove(SELECTORS.winningTeam);
    document.getElementById(AWAY_ID).classList.add(SELECTORS.winningTeam);
  }

  return results;
};

// helper function to chain all the necessary functions together to
// determine which team has won
const runHeadToHead = () => (
  Analytics.run()
    .then(updateTeamStats)
    .then(findWinningTeam)
);

// What to do when a team is selected from the dropdown menu
const handleTeamSelect = (evt) => {
  const name = evt.target.innerText;
  const id = evt.target.parentElement.getAttribute('for');

  return TeamService.getTeamStats(name, id === HOME_ID)
    .then(team => updateTeam(id)(team))
    .then(() => {
      toggleDropdown(evt.target.parentNode);
      if (Analytics.isReady()) runHeadToHead();
    });
};

// Update the dropdown menu content
const updateTeamMenu = (menu) => {
  menu.innerHTML = null;

  return (teams) => {
    teams.forEach((team) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = team;
      item.addEventListener('click', handleTeamSelect);
      menu.appendChild(item);
    });
  };
};

// What to do when a user searches in the dropdown menu
const handleTeamSearch = (e) => {
  const qs = e.target.value;
  const dd = e.target.parentElement.parentElement.querySelector('.items');

  TeamService
    .filterTeamList(qs)
    .then(teams => updateTeamMenu(dd)(teams));
};

// Force a "teamSelect" event when Domo data refreshes
const updateActiveTeams = () => {
  // What are the active team names?
  const home = document.querySelector(`#${HOME_ID} .name`).innerText;
  const away = document.querySelector(`#${AWAY_ID} .name`).innerText;

  // Only update if they're not the default placeholders
  if (home !== 'Home') handleTeamSelect(home, HOME_ID);
  if (away !== 'Away') handleTeamSelect(away, AWAY_ID);
};

export default {
  runHeadToHead,
  handleTeamSearch,
  toggleDropdown,
  updateTeamMenu,
  updateTeam,
  updateActiveTeams,
  viewDetails,
};
