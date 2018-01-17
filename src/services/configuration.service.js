import Query from '@domoinc/query';
import { TeamService } from '../services';
import { CONFIG_ALIAS, CONFIG_FIELDS, CONFIG_WEIGHT_TYPE } from '../utils/constants';

/**
 * transforms array of key/value pairs
 * into an object
 *
 * Example:
 *
 * {
 *    win: { value: 0.25, invert: false },
 *    loss: { value: 0.25, invert: true },
 *    sos: { value: 0.25, invert: true },
 *    rpi: { value: 0.25, invert: false },
 * };
 * */
const prepareWeightings = rows => (
  rows.reduce((weights, row) => {
    weights[row.name] = {
      value: Math.abs(row.value) / 100,
      invert: row.value < 0,
    };

    return weights;
  }, {})
);

/**
 * Simple service for interacting with
 * the configuration dataset in Domo
 */
class ConfigurationService {
  // get configured weightings from Domo
  static getWeightings() {
    return (new Query())
      .select(CONFIG_FIELDS)
      .where('type').equals(CONFIG_WEIGHT_TYPE)
      .fetch(CONFIG_ALIAS)
      .then((res) => {
        const configuredStats = res.map(row => row.name);
        TeamService.updateStatFields(configuredStats);

        return prepareWeightings(res);
      });
  }

  // example of getting page id from webform
  static getDetailPageId() {
    return (new Query())
      .select(CONFIG_FIELDS)
      .where('type').equals('other')
      .where('name').equals('details')
      .fetch(CONFIG_ALIAS);
  }

  // example of getting key/value params for filter options
  static getColumnFilters() {
    return (new Query())
      .select(CONFIG_FIELDS)
      .where('type').equals('filter')
      .fetch(CONFIG_ALIAS);
  }
}

module.exports = ConfigurationService;
