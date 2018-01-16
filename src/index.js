import * as domo from 'ryuu.js';

import './styles/main.scss';
import { SELECTORS, TEAM_ALIAS } from './utils/constants';
import { TeamService } from './services';
import { AppCtrl, TeamCtrl } from './controllers';

const bindEventListeners = (selector) => {
  const elements = document.querySelectorAll(selector);

  return (event, listener) => (
    elements.forEach(el => el.addEventListener(event, listener))
  );
};

function updateTeamMenus(cache) {
  AppCtrl.toggleLoading();

  return TeamService.getTeamList(cache)
    .then((teams) => {
      const menus = document.querySelectorAll(SELECTORS.teamList);
      menus.forEach(menu => TeamCtrl.updateTeamMenu(menu)(teams));
      AppCtrl.toggleLoading();
    })
    .catch(AppCtrl.toggleLoading);
}

function init() {
  // bind search fields
  bindEventListeners(SELECTORS.search)('input', TeamCtrl.handleTeamSearch());

  // bind dropdown menus
  bindEventListeners(SELECTORS.dropdown)('click', TeamCtrl.toggleDropdown());

  // bind settings modal
  bindEventListeners(SELECTORS.settings)('click', AppCtrl.openModal());
  bindEventListeners(SELECTORS.modal)('click', AppCtrl.closeModal());

  // get initial team list
  updateTeamMenus(true);
}

// global data listener
domo.onDataUpdate((alias) => {
  console.info(`dataset "${alias}" updated`, new Date().getTime());

  if (alias === TEAM_ALIAS) {
    updateTeamMenus(false).then(() => TeamCtrl.updateActiveTeams());
  }
});

init();