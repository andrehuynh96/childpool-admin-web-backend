const _ = require('lodash');
const moment = require('moment');
const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Logging = require('app/model/wallet').loggings;
const mapper = require("app/feature/response-schema/logging.response-schema");

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const keyword = _.trim(query.keyword);
      const cond = {};
      const orCond = [];
      let fromDate, toDate;

      if (query.from_date || query.to_date) {
        cond.created_at = {};
      }

      if (query.from_date) {
        fromDate = moment(query.from_date).toDate();
        cond.created_at[Op.gte] = fromDate;
      }
      if (query.to_date) {
        toDate = moment(query.to_date).toDate();
        cond.created_at[Op.lt] = toDate;
      }
      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }

      if (keyword) {
        orCond.push({
          type: { [Op.iLike]: `%${keyword}%` }
        });

        orCond.push({
          message: { [Op.iLike]: `%${keyword}%` }
        });
      }

      if (orCond.length) {
        cond[Op.or] = orCond;
      }

      if (query.type) {
        cond.type = query.type;
      }

      const walletAddress = _.trim(query.wallet_address);
      if (walletAddress) {
        cond.wallet_address = { [Op.iLike]: `%${walletAddress}%` };
      }

      const { count: total, rows: items } = await Logging.findAndCountAll({
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
      logger.error('Search loggings fail', error);
      next(error);
    }
  },
  getDetails: async (req, res, next) => {
    try {
      const { params } = req;
      const logging = await Logging.findOne({
        where: {
          id: params.loggingId,
        }
      });

      if (!logging) {
        return res.notFound(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND", { fields: ['id'] });
      }

      return res.ok(mapper(logging));
    }
    catch (error) {
      logger.error('get exchange currency details fail', error);
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { params, user } = req;
      let logging = await Logging.destroy({
        where: {
          id: params.loggingId,
        }
      });

      if (!logging) {
        return res.notFound(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND", { fields: ['id'] });
      }

      return res.ok(true);
    }
    catch (error) {
      logger.error('Delete logging fail', error);

      next(error);
    }
  },
};
