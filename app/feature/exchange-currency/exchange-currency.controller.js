const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const ExchangeCurrency = require('app/model/wallet').exchange_currencies;
const ExchangeCurrencyStatus = require("app/model/wallet/value-object/exchange-currency-status");
const mapper = require("app/feature/response-schema/exchange-currency.response-schema");

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const cond = {};

      if (query.name) {
        cond.name = { [Op.iLike]: `%${query.name}%` };
      }

      if (query.symbol) {
        cond.symbol = { [Op.iLike]: `%${query.symbol}%` };
      }

      if (query.platform) {
        cond.platform = query.platform;
      }

      const { count: total, rows: items } = await ExchangeCurrency.findAndCountAll({
        limit,
        offset,
        where: cond,
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: mapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.error('get exchange currency list fail', error);
      next(error);
    }
  },
  getDetails: async (req, res, next) => {
    try {
      const { params } = req;
      const exchangeCurrency = await ExchangeCurrency.findOne({
        where: {
          id: params.exchangeCurrencyId,
        }
      });

      if (!exchangeCurrency) {
        return res.badRequest(res.__("EXCHANGE_CURRENCY_NOT_FOUND"), "EXCHANGE_CURRENCY_NOT_FOUND", { fields: ['id'] });
      }

      return res.ok(mapper(exchangeCurrency));
    }
    catch (error) {
      logger.error('get exchange currency details fail', error);
      next(error);
    }
  },
  getPlatforms: async (req, res, next) => {
    try {
      const result = await ExchangeCurrency.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('platform')), 'platform']],
        order: [['platform', 'ASC']],
        raw: true
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get exchange currency details fail', error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { params, body, user } = req;
      const [numOfItems, items] = await ExchangeCurrency.update({
        symbol: body.symbol,
        platform: body.platform,
        name: body.name,
        icon: body.icon,
        order_index: body.order_index,
        status: body.status,
        from_flg: body.from_flg,
        to_flg: body.to_flg,
        fix_rate_flg: body.fix_rate_flg,
        updated_by: user.id,
      }, {
        where: {
          id: params.exchangeCurrencyId,
        },
        returning: true,
      });

      if (!numOfItems) {
        return res.badRequest(res.__("EXCHANGE_CURRENCY_NOT_FOUND"), "EXCHANGE_CURRENCY_NOT_FOUND");
      }

      return res.ok(mapper(items[0]));
    }
    catch (error) {
      logger.error('update exchange currency fail', error);
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { body, user } = req;
      const data = {
        ...body,
        created_by: user.id,
      };
      const exchangeCurrency = await ExchangeCurrency.create(data);

      return res.ok(mapper(exchangeCurrency));
    }
    catch (error) {
      logger.error('create exchangeCurrency fail', error);
      next(error);
    }
  },
  getExchangeCurrencyStatuses: async (req, res, next) => {
    try {
      const result = Object.entries(ExchangeCurrencyStatus).map(items => {
        return {
          value: items[1],
          label: items[0],
        };
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('create getExchangeCurrencyStatuses fail', error);
      next(error);
    }
  },

};
