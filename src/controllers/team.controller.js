import { AppCtrl } from '../controllers';
import { TeamService, Analytics } from '../services';

const toggleDropdown = () => (evt) => {
  const dm = (typeof evt.target !== 'undefined')
    ? evt.target.parentNode.parentNode.querySelector('.dropdown-content')
    : evt.parentNode;

  dm.classList.toggle('open');
}

const handleTeamSelect = () => {
  return (evt) => {
    AppCtrl.toggleLoading();

    const name = evt.target.innerText;
    const id = evt.target.parentElement.getAttribute('for');

    return TeamService.getTeamStats(name, id === 'home-team')
      .then((team) => updateTeam(id)(team))
      .then(() => {
        AppCtrl.toggleLoading();
        toggleDropdown()(evt.target.parentNode);

        if (Analytics.isReady()) runHeadToHead();
      })
      .catch(AppCtrl.toggleLoading);
  }
}

const handleTeamSearch = () => (e) => {
  const qs = e.target.value;
  const dd = e.target.parentElement.parentElement.querySelector('.items');

  TeamService
    .filterTeamList(qs)
    .then(teams => updateTeamMenu(dd)(teams));
}

const updateTeam = (id) => {
  const el = document.getElementById(id);

  return (team) => {
    const title = el.querySelector('.name');
    const stats = el.querySelector('.stats');
    const btn = el.querySelector('button');
    btn.disabled = false;

    title.innerText = team.team;
    stats.innerHTML = Object.keys(team)
      .filter(key => key !== 'team')
      .map(key => (
        `<div class="stat" data-stat=${key}>${key}
          <span class="value">${team[key]}</span>
        </div>`
      ))
      .join('');

    return;
  }
}

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
  }
}

const runHeadToHead = () => {
  AppCtrl.toggleLoading();

  return (
    Analytics.run()
      .then(updateTeamStats)
      .then(findWinningTeam)
      .then(() => AppCtrl.toggleLoading())
      .catch(() => AppCtrl.toggleLoading())
  );
}

const updateTeamStats = (results) => results.map(updateTeamStat);

const updateTeamStat = (stat) => {
  const stats = document.querySelectorAll(`div.stat[data-stat="${stat.stat}"`);

  stat.results.forEach((win, index) => {
    if (win) {
      stats[index].classList.add('-winner');
    } else {
      stats[index].classList.remove('-winner');
    }
  });

  return stat;
}

const findWinningTeam = (results) => {
  if (Analytics.homeWinner(results)) {
    document.getElementById('home-team').classList.add('-winner');
    document.getElementById('away-team').classList.remove('-winner');
  } else {
    document.getElementById('home-team').classList.remove('-winner');
    document.getElementById('away-team').classList.add('-winner');
  }

  return;
}

module.exports = {
  runHeadToHead,
  handleTeamSearch,
  toggleDropdown,
  updateTeamMenu,
};
