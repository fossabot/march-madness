import './app.scss';
import TeamService from './services/team.service';
import AppCtrl from './controllers/app.controller';
import TeamCtrl from './controllers/team.controller';

console.log(TeamCtrl);

function init() {
  // bind search fields
  const search = document.querySelectorAll('.dropdown-content input');
  search.forEach(input =>
    input.addEventListener('input', TeamCtrl.handleTeamSearch())
  );

  // bind dropdown menus
  const ddControls = document.querySelectorAll('.dropdown .menu');
  ddControls.forEach(a => a.addEventListener('click', TeamCtrl.toggleDropdown()));

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
