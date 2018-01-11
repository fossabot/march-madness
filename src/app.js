import './app.scss';
import TeamService from './services/team.service';

function toggleLoading() {
  document.querySelector('.spinner').classList.toggle('hide');
}

function toggleDropdown(e) {
  const dm = (typeof e.target !== 'undefined')
    ? (
      e.target.parentNode.parentNode
        .querySelector('.dropdown-content')
    )
    : e.parentNode;

  dm.classList.toggle('open');
}

function handleTeamSelect(e) {
  toggleLoading();

  const name = e.target.innerText;
  const id = e.target.parentElement.getAttribute('for');

  TeamService.getTeamStats(name)
    .then((team) => {
      const el = document.getElementById(id);
      const title = el.querySelector('.name');
      const stats = el.querySelector('.stats');
      const btn = el.querySelector('button');
      btn.disabled = false;

      title.innerText = team.team;
      stats.innerHTML = Object.keys(team)
        .filter(key => key !== 'team')
        .map(key => (
          `<div class="stat">${key}
            <span class="value">${team[key]}</span>
          </div>`
        ))
        .join('');

      toggleDropdown(e.target.parentNode);
      toggleLoading();
    })
    .catch(toggleLoading);
}

function buildTeamList(menu, teams) {
  menu.innerHTML = null;

  teams.forEach((team) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = team;
    item.addEventListener('click', handleTeamSelect);
    menu.appendChild(item);
  });
}

function handleSearch(e) {
  const qs = e.target.value;
  const dd = e.target.parentElement.parentElement.querySelector('.items');

  TeamService
    .getFilterTeamList(qs)
    .then(teams => buildTeamList(dd, teams));
}


function init() {
  // bind search fields
  const search = document.querySelectorAll('.dropdown-content input');
  search.forEach(input => input.addEventListener('input', handleSearch));

  // bind dropdown menus
  const ddControls = document.querySelectorAll('.dropdown .menu');
  ddControls.forEach(a => a.addEventListener('click', toggleDropdown));

  // get initial team list
  TeamService.getTeamList()
    .then((teams) => {
      const menus = document.querySelectorAll('.dropdown-content > .items');
      menus.forEach(menu => buildTeamList(menu, teams));
      toggleLoading();
    })
    .catch(toggleLoading);
}

init();
