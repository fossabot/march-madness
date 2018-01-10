import './app.scss';
import DataService from './services/data.service';

function init() {
  DataService.getTeamList().then(console.log);
}

init();
