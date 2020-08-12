const logger = require('app/lib/logger');
const Currency = require("app/model/wallet").currencies;
const CurrencyMapper = require("app/feature/response-schema/currency.response-schema")
module.exports = {
  get: async (req, res, next) => {
    try {
      let result = await Currency.findAll({
      })

      return res.ok(
        CurrencyMapper(result)
      );
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  }
};