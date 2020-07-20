const logger = require("app/lib/logger");
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Setting = require("app/model/wallet").settings;
const FiatRateHistory = require("app/model/wallet").fiat_rate_histories;
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
  getFiatRateHistories: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const  { count: total, rows: _his } = await FiatRateHistory.findAndCountAll({ offset: offset, limit: limit, order: [['created_at','DESC']] });
      return res.ok({
        items: _his,
        offset: offset,
        limit: limit,
        total: total });
    }
    catch (err) {
      logger.error("get  fiat rate histories", err);
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

      const rateHistory = await FiatRateHistory.findOne({ 
        order: [['created_at','DESC']] 
      });

      if (rateHistory){
        await FiatRateHistory.update({
          end_date: Sequelize.fn('NOW')
        }, {
          where: {
            id: rateHistory.id
          },
          returning: true,
          plain: true,
          transaction: transaction
        });
      }
      const fiatRateHistories = {
        currency_exchange: "USD/JPY",
        rate: req.body.usd_rate_by_jpy
      };
      await FiatRateHistory.create(fiatRateHistories, { transaction });

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