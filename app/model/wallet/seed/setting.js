const Model = require("app/model/wallet").settings;

const SETTINGS = [
  {
    "key": "MS_POINT_CLAIM_POINTS",
    "value": "1",
    "type": "number",
    "property": "ms_point_claim_points"
  },
  {
    "key": "MS_POINT_DELAY_TIME_IN_SECONDS",
    "value": "86400",
    "type": "number",
    "property": "ms_point_delay_time_in_seconds"
  },
];

module.exports = async () => {
  const models = [];

  for (let item of SETTINGS) {
    let setting = await Model.findOne({
      where: {
        key: item.key,
      }
    });

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

  await Model.bulkCreate(
    models,
    {
      returning: true
    });

};
