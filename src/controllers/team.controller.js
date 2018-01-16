import { TeamService, Analytics } from '../services';
import { SELECTORS, TEAM_NAME, HOME_ID, AWAY_ID } from '../utils/constants';

/**
 * Team Controller
 *
 * Functions for interacting with the DOM to manage elements
 * related to the "Home" and "Away" team
 */

// Show / Hide team selector menus
const toggleDropdown = () => (evt) => {
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
const handleTeamSelect = () => (evt) => {
  const name = evt.target.innerText;
  const id = evt.target.parentElement.getAttribute('for');

  return TeamService.getTeamStats(name, id === HOME_ID)
    .then(team => updateTeam(id)(team))
    .then(() => {
      toggleDropdown()(evt.target.parentNode);
      if (Analytics.isReady()) runHeadToHead();
    });
};

const updateTeamMenu = (menu) => {
  menu.innerHTML = null;

  return (teams) => {
    teams.forEach((team) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = team;
      item.addEventListener('click', handleTeamSelect());
      menu.appendChild(item);
    });
  };
};

// What to do when a user searches in the dropdown menu
const handleTeamSearch = () => (e) => {
  const qs = e.target.value;
  const dd = e.target.parentElement.parentElement.querySelector('.items');

  TeamService
    .filterTeamList(qs)
    .then(teams => updateTeamMenu(dd)(teams));
};

module.exports = {
  runHeadToHead,
  handleTeamSearch,
  toggleDropdown,
  updateTeamMenu,
  updateTeam,
};
