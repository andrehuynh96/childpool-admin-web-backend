const _ = require('lodash');
const Model = require("app/model/wallet").settings;
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const SETTINGS = [
  {
    "key": "MS_POINT_DELAY_TIME_IN_SECONDS",
    "value": "86400",
    "type": "number",
    "property": "ms_point_delay_time_in_seconds"
  },
  {
    "key": "MS_POINT_MODE",
    "value": "phase_1",
    "type": "string",
    "property": "ms_point_mode"
  },
  {
    "key": "MS_POINT_STAKING_IS_ENABLED",
    "value": "true",
    "type": "boolean",
    "property": "ms_point_staking_is_enabled"
  },
  {
    "key": "MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED",
    "value": "true",
    "type": "boolean",
    "property": "ms_point_upgrading_membership_is_enabled"
  },
  {
    "key": "MS_POINT_EXCHANGE_IS_ENABLED",
    "value": "true",
    "type": "boolean",
    "property": "ms_point_exchange_is_enabled"
  },
  {
    "key": "MS_POINT_EXCHANGE_MININUM_VALUE_IN_USDT",
    "value": "100",
    "type": "number",
    "property": "ms_point_exchange_mininum_value_in_usdt"
  },

];

module.exports = async () => {
  const models = [];
  const keys = SETTINGS.map(item => item.key);
  const settings = await Model.findAll({
    where: {
      key: {
        [Op.in]: keys,
      },
    }
  });
  const settingCache = _.keyBy(settings, item => item.key);

  for (let item of SETTINGS) {
    let setting = settingCache[item.key];
    if (!setting) {
      setting = {
        key: item.key,
        value: item.value,
        type: item.type,
        property: item.property,
        created_by: 0,
        updated_by: 0,
      };

      models.push(setting);
    }
  }

  if (models.length) {
    await Model.bulkCreate(
      models,
      {
        returning: true
      });
  }

};
