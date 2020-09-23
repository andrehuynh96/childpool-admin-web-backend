const logger = require('app/lib/logger');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Member = require('app/model/wallet').members;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const exchangeTransactionsMapper = require('app/feature/response-schema/exchange-transaction.response-schema');
const ExchangeTransactionsStatus = require('app/model/wallet/value-object/exchange-transaction-status');
const stringify = require('csv-stringify');
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
        const toDate = moment(query.to_date).toDate();
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
      if (query.transaction_id) {
        where.transaction_id = { [Op.iLike]: `%${query.transaction_id}%` };
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
  getDetail: async (req, res, next) => {
    try {
      const id = req.params.id;
      const exchangeTransaction = await ExchangeTransaction.findOne({
        include: [
          {
            attributes: ['email'],
            as: "Member",
            model: Member,
            required: true
          }
        ],
        where: {
          id: id
        },
        raw: true
      });

      if (!exchangeTransaction) {
        return res.notFound(res.__("EXCHANGE_TRANSACTION_NOT_FOUND"), "EXCHANGE_TRANSACTION_NOT_FOUND", { field: [id] });
      }
      exchangeTransaction.email = exchangeTransaction['Member.email'];

      return res.ok(exchangeTransaction);
    }
    catch (error) {
      logger.error('get exchange transaction detail fail', error);
      next(error);
    }
  },
  downloadCSV: async (req, res, next) => {
    try {
      const { query } = req;
      const where = {};
      const memberCond = {};
      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
      }
      if (query.from_date && query.to_date) {
        const fromDate = moment(query.from_date).toDate();
        const toDate = moment(query.to_date).toDate();
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
      if (query.transaction_id) {
        where.transaction_id = { [Op.iLike]: query.transaction_id };
      }

      const { rows: items } = await ExchangeTransaction.findAndCountAll({
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

      const timezone_offset = query.timezone_offset || 0;
      items.forEach(item => {
        item.member_email = item.Member.email;
        item.txDate = moment(item.transaction_date).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
      });

      const data = await stringifyAsync(items, [
        { key: 'txDate', header: 'Transaction Date' },
        { key: 'member_email', header: 'Email' },
        { key: 'from_currency', header: 'From Currency' },
        { key: 'to_currency', header: 'To Currency' },
        { key: 'amount_to', header: 'Amount' },
        { key: 'status', header: 'Status' },
        { key: 'transaction_id', header: 'Transaction Id' }
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=exchange-transaction.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (error) {
      logger.info('download csv fail', error);
      next(error);
    }
  },
};
function stringifyAsync(data, columns) {
  return new Promise(function (resolve, reject) {
    stringify(data, {
      header: true,
      columns: columns
    }, function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }
    );
  });
}
