const logger = require('app/lib/logger');
const Role = require("app/model/wallet").roles;
 const config = require('app/config');

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
  }
}