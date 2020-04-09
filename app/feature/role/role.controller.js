const logger = require('app/lib/logger');
const Role = require("app/model/wallet").roles;
const config = require('app/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let result = await Role.findAll({
        where: {
          deleted_flg: false
        }
      });
      return res.ok(result);
    }
    catch (err) {
      logger.error('getAll role fail:', err);
      next(err);
    }
  },
  roleHavePermission: async (req, res, next) => {
    try {
      let levels = req.roles.map(ele => ele.level)
      let roleControl = []
      for (let e of levels) {
        let role = await Role.findOne({

          where: {
            level: { [Op.gt]: e },
            deleted_flg: false
          },
          order: [['level', 'ASC']]
        });

        if (role) {
          roleControl.push(role)
        }
      }
      return res.ok(roleControl);
    }
    catch (err) {
      logger.error('getAll role fail:', err);
      next(err);
    }
  }
}