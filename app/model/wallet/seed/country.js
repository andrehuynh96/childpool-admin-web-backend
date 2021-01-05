const _ = require('lodash');
const Sequelize = require('sequelize');
const Country = require("app/model/wallet").countries;

const Op = Sequelize.Op;
const COUNTRIES = [
  {
    "code": "JP",
    "name": "Japan",
    "display_name": "日本語",
    "order_index": 1,
    "actived_flg": true,
  },
  {
    "code": "KR",
    "name": "Korean",
    "display_name": "한국어",
    "order_index": 2,
    "actived_flg": true,
  },
];

module.exports = async () => {
  const models = [];
  const codes = COUNTRIES.map(item => item.code);

  const countries = await Country.findAll({
    where: {
      code: {
        [Op.in]: codes,
      },
    }
  });
  const cache = _.keyBy(countries, item => item.key);

  for (let item of COUNTRIES) {
    let country = cache[item.key];
    if (!country) {
      country = {
        code: item.code,
        name: item.name,
        display_name: item.display_name,
        order_index: item.order_index,
        actived_flg: item.actived_flg,
        created_by: 0,
        updated_by: 0,
      };

      models.push(country);
    }
  }

  if (models.length) {
    await Country.bulkCreate(
      models,
      {
        returning: true
      });
  }

};
