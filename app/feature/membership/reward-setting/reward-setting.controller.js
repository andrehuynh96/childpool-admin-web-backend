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
        membership_comission_usdt_minimum_claim_amount: null,
      };

      for (let e of results) {
        if (e.key === 'USD_RATE_BY_JPY') {
          data.usd_rate_by_jpy = Number(e.value);
        } else if (e.key === 'MEMBERSHIP_COMISSION_USDT_MINIMUM_CLAIM_AMOUNT') {
          data.membership_comission_usdt_minimum_claim_amount = Number(e.value);
        }
      }

      return res.ok(data);
    }
    catch (err) {
      logger.error("get reward settings fail", err);
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
      logger.error("update membership type config fail", err);
      next(err);
    }
  }
};