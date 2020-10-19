const logger = require('app/lib/logger');
const Setting = require('app/model/wallet').settings;
module.exports = {
  get: async (req, res, next) => {
    try {
      const settings = await Setting.findAll();
      return res.ok(settings);
    } catch (error) {
      logger.info('get ms point settings fail',error);
      next();
    }
  },
  update: async (req, res, next) => {
    try {
      return res.ok(true);
    } catch (error) {
      logger.info('update ms point settings fail',error);
      next();
    }
  }
};
