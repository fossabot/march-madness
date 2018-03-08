const TEAM_ALIAS = 'teams';
const TEAM_NAME = 'team';
const TEAM_STAT_FIELDS = ['win', 'loss', 'sos', 'rpi'];

const CONFIG_ALIAS = 'config';
const CONFIG_FIELDS = ['name', 'value'];
const CONFIG_WEIGHT_TYPE = 'weight';

const HOME_ID = 'home-team';
const AWAY_ID = 'away-team';

const SELECTORS = {
  spinner: '.spinner',
  hideSpinner: 'hide',

  search: '.dropdown-content input',
  dropdown: '.dropdown .menu',
  dropdownContent: '.dropdown-content',

  settings: '.controls .control[for="settings"]',
  fullscreen: '.controls .control[for="fullscreen"]',
  fullscreenIcon: '[data-fa-i2svg]',
  enterFullscreen: 'fa fa-expand',
  exitFullscreen: 'fa fa-compress',
  modal: '.modal',
  modalOpen: 'open',

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

export {
  TEAM_ALIAS,
  TEAM_NAME,
  TEAM_STAT_FIELDS,
  CONFIG_ALIAS,
  CONFIG_FIELDS,
  CONFIG_WEIGHT_TYPE,
  HOME_ID, AWAY_ID,
  SELECTORS,
};
