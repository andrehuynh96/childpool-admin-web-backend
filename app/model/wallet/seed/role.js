const _ = require('lodash');
const Model = require("app/model/wallet").roles;
const Sequelize = require('sequelize');
const RoleName = require('../value-object/role-name');

const Op = Sequelize.Op;

const ALL_ROLES = [
  {
    name: RoleName.Master,
    root_flg: true,
    level: 0
  },
  {
    name: RoleName.Admin,
    level: 10
  },
  {
    name: RoleName.Operator1,
    level: 20
  },
  {
    name: RoleName.Operator2,
    level: 30
  },
  {
    name: RoleName.KoreanOperator,
    level: 30
  },
];

module.exports = async () => {
  const models = [];
  const names = ALL_ROLES.map(item => item.name);
  const roles = await Model.findAll({
    where: {
      name: {
        [Op.in]: names,
      },
    }
  });
  const settingCache = _.keyBy(roles, item => item.name.toUpperCase());

  for (let item of ALL_ROLES) {
    let role = settingCache[item.name.toUpperCase()];
    if (!role) {
      role = {
        name: item.name,
        root_flg: !!item.root_flg,
        level: item.level,
        description: null,
        deleted_flg: false,
      };

      models.push(role);
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
