const logger = require('app/lib/logger');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Member = require('app/model/wallet').members;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const exchangeTransactionsMapper = require('app/feature/response-schema/exchange-transaction.response-schema');
const ExchangeTransactionsStatus = require('app/model/wallet/value-object/exchange-transaction-status');
module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const where = {};
      const memberCond = {};
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
      }
      if (query.from_date && query.to_date) {
        const fromDate = moment(query.from_date).toDate();
        const toDate = moment(query.to_date).add(1, 'minute').toDate();
        if (fromDate >= toDate) {
          return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
        }
        where.created_at = {
          [Op.gte]: fromDate,
          [Op.lt]: toDate
        };
      }

      if (query.status) {
        where.status = query.status;
      }
      if (query.from_currency) {
        where.from_currency = { [Op.iLike]: query.from_currency };
      }
      if (query.to_currency) {
        where.to_currency = { [Op.iLike]: query.to_currency };
      }

      const { count: total, rows: items } = await ExchangeTransaction.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            attributes: ['email'],
            as: "Member",
            model: Member,
            where: memberCond,
            required: true
          }
        ],
        where: where,
        order: [['created_at', 'DESC']]
      });
      return res.ok({
        items: exchangeTransactionsMapper(items),
        limit: limit,
        offset: offset,
        total: total
      });
    }
    catch (error) {
      logger.error('Search exchange transaction fail', error);
      next(error);
    }
  },
  getStatuses: async (req, res, next) => {
    try {
      const exchangeTransactionsStatus = Object.values(ExchangeTransactionsStatus).map(item => {
        return {
          label: item,
          value: item
        };
      });
      return res.ok(exchangeTransactionsStatus);
    }
    catch (error) {
      logger.error('get status dropdown list fail', error);
      next(error);
    }
  },
  getDetail: async (req,res,next) => {
    try {
      const id = req.params.id;
      const exchangeTransaction = await ExchangeTransaction.findOne({
        where: {
          id: id
        }
      });

      if (!exchangeTransaction) {
        return res.notFound(res.__("EXCHANGE_TRANSACTION_NOT_FOUND"),"EXCHANGE_TRANSACTION_NOT_FOUND",{ field: [id] });
      }

      return res.ok(exchangeTransaction);
    }
    catch (error) {
      logger.error('get exchange transaction detail fail',error);
      next(error);
    }
  }
};
