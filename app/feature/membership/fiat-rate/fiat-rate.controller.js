const logger = require("app/lib/logger");
const database = require('app/lib/database').db().wallet;
const Setting = require("app/model/wallet").settings;

module.exports = {
  get: async (req, res, next) => {
    try {
      const results = await Setting.findAll();
      if (!results || results.length == 0) {
        return res.ok({});
      }

      const data = {
        usd_rate_by_jpy: null,
        usd_rate_by_jpy_updated_at: null,
      };

      for (let e of results) {
        if (e.key === 'USD_RATE_BY_JPY') {
          data.usd_rate_by_jpy = Number(e.value);
        } else if (e.key === 'USD_RATE_BY_JPY_UPDATED_AT') {
          data.usd_rate_by_jpy_updated_at = e.value;
        }
      }

      return res.ok(data);
    }
    catch (err) {
      logger.error("get  fiat rate", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    let transaction = await database.transaction();
    try {
      for (let key of Object.keys(req.body)) {
        await Setting.update({
          value: req.body[key],
          updated_by: req.user.id
        }, {
          where: {
            property: key
          },
          returning: true,
          transaction: transaction
        });
      }

      await transaction.commit();
      return res.ok(true);
    }
    catch (err) {
      await transaction.rollback();
      logger.error("update fiat rate", err);
      next(err);
    }
  }
};