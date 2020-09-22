const logger = require('app/lib/logger');
const Currency = require("app/model/wallet").currencies;
const CurrencyMapper = require("app/feature/response-schema/currency.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CurrencyStatus = require("app/model/wallet/value-object/currency-status");

const CURRENCY_STATUS_TEXT_CACHE = Object.entries(CurrencyStatus).reduce((result, items) => {
  result[items[1]] = items[0];

  return result;
}, {});

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const where = {};
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;

      if (query.name) {
        where.name = { [Op.iLike]: `%${query.name}%` };
      }

      if (query.symbol) {
        where.symbol = { [Op.iLike]: `%${query.symbol}%` };
      }

      if (query.platform) {
        where.platform = query.platform;
      }

      if (query.status) {
        where.status = query.status;
      }
      let { count: total, rows: items } = await Currency.findAndCountAll({
        limit: limit,
        offset: offset,
        where: where,
        order: [['created_at','DESC']],
        raw: true
      });

      items.forEach(item => {
          item.status = CURRENCY_STATUS_TEXT_CACHE[item.status];
      });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  getCurrencyStatuses: async (req,res,next) => {
    try {
      const result = Object.entries(CurrencyStatus).map(items => {
        return {
          value: items[1],
          label: items[0],
        };
      });
      return res.ok(result);
    }
    catch (error) {
      logger.error('get currency status fail',error);
      next(error);
    }
  },
  getPlatforms: async (req,res,next) => {
    try {
      const result = await Currency.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('platform')), 'platform']],
        order: [['platform', 'ASC']],
        raw: true
      });
      return res.ok(result);
    }
    catch (error) {
      logger.error('get currency status fail',error);
      next(error);
    }
  },
  getDetails: async (req,res,next) => {
    try {
      const currencyId = req.params.currencyId;
      const currency = await Currency.findOne({
        where: {
          id: currencyId
        }
      });

      if (!currency) {
        return res.notFound(res.__("CURRENCY_NOT_FOUND"),"CURRENCY_NOT_FOUND",{ field: [currencyId] });
      }

      currency.status = CURRENCY_STATUS_TEXT_CACHE[currency.status];
      return res.ok(currency);
    }
    catch (error) {
      logger.error('get currency detail fail',error);
      next(error);
    }
  },
  update: async(req,res,next) => {
    try {
      const { body, params, user } = req;
      const [numOfItems, items] = await Currency.update({
        ...body,
        updated_by: user.id,
      }, {
        where: {
          id: params.currencyId,
        },
        returning: true,
      });
      if (!numOfItems) {
        return res.notFound(res.__("CURRENCY_NOT_FOUND"), "CURRENCY_NOT_FOUND");
      }
      items[0].status = CURRENCY_STATUS_TEXT_CACHE[items[0].status];
      return res.ok(items[0]);
    }
    catch (error) {
      logger.error('update currency fail',error);
      next(error);
    }
  }
};
