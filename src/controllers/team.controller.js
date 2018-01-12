import AppCtrl from './app.controller';
import TeamService from '../services/team.service';
import Analytics from '../services/analytics.service';

const ctrl = {
  buildTeamList: (menu, teams) => {
    menu.innerHTML = null;

    teams.forEach((team) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = team;
      item.addEventListener('click', ctrl.handleTeamSelect);
      menu.appendChild(item);
    });
  },

  handleSearch: (e) => {
    const qs = e.target.value;
    const dd = e.target.parentElement.parentElement.querySelector('.items');

    TeamService
      .getFilterTeamList(qs)
      .then(teams => ctrl.buildTeamList(dd, teams));
  },

  runHeadToHead() {
    if (Analytics.isReady()) {
      AppCtrl.toggleLoading();

      Analytics.run().then((results) => {
        results.forEach((s) => {
          const stats = document.querySelectorAll(`div.stat[data-stat="${s.stat}"`);
          s.results.forEach((win, index) => {
            if (win) {
              stats[index].classList.add('-winner');
            } else {
              stats[index].classList.remove('-winner');
            }
          });
        });

        if (Analytics.homeWinner(results)) {
          document.getElementById('home-team').classList.add('-winner');
          document.getElementById('away-team').classList.remove('-winner');
        } else {
          document.getElementById('home-team').classList.remove('-winner');
          document.getElementById('away-team').classList.add('-winner');
        }

        AppCtrl.toggleLoading();
      });
    }
  },

  handleTeamSelect: (e) => {
    AppCtrl.toggleLoading();

    const name = e.target.innerText;
    const id = e.target.parentElement.getAttribute('for');

    TeamService.getTeamStats(name, id === 'home-team')
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
            `<div class="stat" data-stat=${key}>${key}
              <span class="value">${team[key]}</span>
            </div>`
          ))
          .join('');

        ctrl.toggleDropdown(e.target.parentNode);
        AppCtrl.toggleLoading();
        ctrl.runHeadToHead();
      })
      .catch(AppCtrl.toggleLoading);
  },

  toggleDropdown: (e) => {
    const dm = (typeof e.target !== 'undefined')
      ? (
        e.target.parentNode.parentNode
          .querySelector('.dropdown-content')
      )
      : e.parentNode;

    dm.classList.toggle('open');
  },
};

module.exports = ctrl;
