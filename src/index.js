import * as domo from 'ryuu.js';

import './styles/main.scss';
import { SELECTORS, TEAM_ALIAS, HOME_ID, AWAY_ID } from './utils/constants';
import { TeamService, Analytics, Configuration } from './services';
import { AppCtrl, TeamCtrl } from './controllers';

const bindEventListeners = (selector) => {
  const elements = document.querySelectorAll(selector);

  return (event, listener) => (
    elements.forEach(el => el.addEventListener(event, listener))
  );
};

function updateTeamMenus(cache) {
  return TeamService.getTeamList(cache)
    .then((teams) => {
      const menus = document.querySelectorAll(SELECTORS.teamList);
      menus.forEach(menu => TeamCtrl.updateTeamMenu(menu)(teams));
    })
    .catch(AppCtrl.toggleLoading);
}

function init() {
  // bind search fields
  bindEventListeners(SELECTORS.search)('input', TeamCtrl.handleTeamSearch());

  // bind dropdown menus
  bindEventListeners(SELECTORS.dropdown)('click', TeamCtrl.toggleDropdown());

  // bind view details button
  bindEventListeners(SELECTORS.teamButton)('click', TeamCtrl.viewDetails());

  // bind settings modal
  bindEventListeners(SELECTORS.settings)('click', AppCtrl.openModal());
  bindEventListeners(SELECTORS.modal)('click', AppCtrl.closeModal());

  // bind fullscreen function
  bindEventListeners(SELECTORS.fullscreen)('click', AppCtrl.toggleFullScreen);

  // get initial team list
  updateTeamMenus(true);

  // update analytic weights from Domo
  Configuration
    .getWeightings()
    .then((weights) => {
      Analytics.updateStatWeightings(weights);

      // rerun teams pulled from local storage
      if (Analytics.isReady()) {
        TeamCtrl.updateTeam(HOME_ID)(Analytics.home);
        TeamCtrl.updateTeam(AWAY_ID)(Analytics.away);
        TeamCtrl.runHeadToHead();
      }
    });
}

// global data listener
domo.onDataUpdate((alias) => {
  console.info(`dataset "${alias}" updated`, new Date().getTime());

  if (alias === TEAM_ALIAS) {
    updateTeamMenus(false).then(() => TeamCtrl.updateActiveTeams());
  }
});

init();
