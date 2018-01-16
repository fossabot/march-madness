module.exports.TEAM_ALIAS = 'teams';
module.exports.TEAM_NAME = 'team';
module.exports.TEAM_STAT_FIELDS = ['win', 'loss', 'sos', 'rpi'];

module.exports.HOME_ID = 'home-team';
module.exports.AWAY_ID = 'away-team';

module.exports.SELECTORS = {
  spinner: '.spinner',
  hideSpinner: 'hide',

  search: '.dropdown-content input',
  dropdown: '.dropdown .menu',
  dropdownContent: '.dropdown-content',

  settings: '.controls .control[for="settings"]',
  modal: '.modal',
  modalOpen: 'open',
  fullscreen: '.fullscreen-button',

  weight: '.weight',
  numberInput: 'input[type="number"]',
  checkbox: 'input[type="checkbox"]',

  teamList: '.dropdown-content > .items',
  winningTeam: '-winner',
  teamTitle: '.name',
  teamStats: '.stats',
  teamButton: 'button',
  teamStat: key => `div.stat[data-stat="${key}"`,
};
