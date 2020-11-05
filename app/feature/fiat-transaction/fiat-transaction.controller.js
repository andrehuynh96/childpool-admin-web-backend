const logger = require('app/lib/logger');
const Status = require('app/model/wallet/value-object/fiat-transaction-status');
const PaymentMethod = require('app/model/wallet/value-object/payment-method');
const Member = require('app/model/wallet').members;
const FiatTransaction = require('app/model/wallet').fiat_transactions;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const fiatTransactionsMapper = require('app/feature/response-schema/fiat-transaction.response-schema');
const stringify = require('csv-stringify');
module.exports = {
  search: async(req, res, next) => {
    try {
      const { query } = req;
      const where = {};
      const memberCond = {};
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const include = {
        attributes: ['email'],
        as: "Member",
        model: Member,
      };

      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
        include.where = memberCond;
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

      if (query.payment_method) {
        where.payment_method = query.payment_method;
      }

      const { count: total, rows: items } = await FiatTransaction.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [ include ],
        where: where,
        order: [['created_at', 'DESC']]
      });
      items.forEach(item => {
        item.member_email = item.Member.email ? item.Member.email : '';
      });
      return res.ok({
        items: fiatTransactionsMapper(items),
        limit: limit,
        offset: offset,
        total: total
      });
    }
    catch (error) {
      logger.error('search fiat transaction fail',error);
      next(error);
    }
  },
  getDetails: async(req, res, next) => {
    try {
      const { id } = req.params;
      const fiatTransaction = await FiatTransaction.findOne({
        include: {
          attributes: ['email'],
          as: "Member",
          model: Member,
        },
        where: {
          id: id
        }
      });

      if (!fiatTransaction) {
        return res.notFound(res.__("FIAT_TRANSACTION_NOT_FOUND"),"FIAT_TRANSACTION_NOT_FOUND", { field: ['id'] });
      }

      return res.ok(fiatTransaction);
    }
    catch (error) {
      logger.error('search fiat transaction fail',error);
      next(error);
    }
  },
  downloadCSV: async(req, res, next) => {
    try {
      const { query } = req;
      const where = {};
      const memberCond = {};
      const include = {
        attributes: ['email'],
        as: "Member",
        model: Member,
      };

      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
        include.where = memberCond;
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

      if (query.payment_method) {
        where.payment_method = query.payment_method;
      }

      const { rows: items } = await FiatTransaction.findAndCountAll({
        include: [ include ],
        where: where,
        order: [['created_at', 'DESC']]
      });

      const timezone_offset = query.timezone_offset || 0;
      items.forEach(item => {
        item.member_email = item.Member.email ? item.Member.email : '';
        item.created_at = moment(item.created_at).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
      });

      const data = await stringifyAsync(items, [
        { key: 'created_at', header: 'Date' },
        { key: 'member_email', header: 'Email' },
        { key: 'from_currency', header: 'From Currency' },
        { key: 'to_cryptocurrency', header: 'To Crypto Currency' },
        { key: 'payment_method', header: 'Payment Method' },
        { key: 'from_amount', header: 'from_amount' },
        { key: 'to_amount', header: 'to_amount' },
        { key: 'transaction_id', header: 'Transaction Id' },
        { key: 'status', header: 'Status' },
        { key: 'provider', header: 'Provider' }
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=wyre-transaction.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (error) {
      logger.error('export fiat transaction csv fail',error);
      next(error);
    }
  },
  getStatuses: async(req, res, next) => {
    try {
      const statuses = Object.entries(Status);
      const dropdownList = statuses.map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });
      return res.ok(dropdownList);
    }
    catch (error) {
      logger.error('get fiat transaction status fail',error);
      next(error);
    }
  },

  getPaymentMethods: async(req, res, next) => {
    try {
      const paymentMethods = Object.entries(PaymentMethod);
      const dropdownList = paymentMethods.map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });
      return res.ok(dropdownList);
    }
    catch (error) {
      logger.error('get payment method fail',error);
      next(error);
    }
  }
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
