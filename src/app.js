import './app.scss';
import TeamService from './services/team.service';
import { AppCtrl, TeamCtrl } from './controllers';

const bindEventListeners = (selector) => {
  const elements = document.querySelectorAll(selector);

  return (event, listener) => (
    elements.forEach(el => el.addEventListener(event, listener))
  );
};

function init() {
  // bind search fields
  bindEventListeners('.dropdown-content input')('input', TeamCtrl.handleTeamSearch());

  // bind dropdown menus
  bindEventListeners('.dropdown .menu')('click', TeamCtrl.toggleDropdown());

  // bind settings modal
  bindEventListeners('.controls .control[for="settings"]')('click', AppCtrl.openModal());
  bindEventListeners('.modal')('click', AppCtrl.closeModal());

  // get initial team list
  TeamService.getTeamList()
    .then((teams) => {
      const menus = document.querySelectorAll('.dropdown-content > .items');
      menus.forEach(menu => TeamCtrl.updateTeamMenu(menu)(teams));
      AppCtrl.toggleLoading();
    })
    .catch(AppCtrl.toggleLoading);
}

init();
