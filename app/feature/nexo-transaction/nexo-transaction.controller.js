const _ = require("lodash");
const logger = require('app/lib/logger');
const NexoTx = require("app/model/wallet").nexo_transactions;
const NexoMember = require('app/model/wallet').nexo_members;
// const nexoMapper = require("app/feature/response-schema/nexo-transaction.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const NexoTxStatus = require("app/model/wallet/value-object/nexo-transaction-status");
const NexoTxType = require("app/model/wallet/value-object/nexo-transaction-type");
const moment = require('moment');

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const where = {};
      const memberCond = {};
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;

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

      if (query.address) {
        where.address = query.address;
      }
      if (query.tx_id) {
        where.tx_id = query.tx_id;
      }

      if (query.type) {
        where.type = query.type;
      }

      if (query.status) {
        where.status = query.status;
      }
      let { count: total, rows: items } = await NexoTx.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            attributes: ['email'],
            as: "NexoMember",
            model: NexoMember,
            where: memberCond,
            required: true
          }
        ],
        where: where,
        order: [['created_at', 'DESC']],
        raw: true
      });

      const timezone_offset = query.timezone_offset || 0;
      items.forEach(item => {
        item.email = item['NexoMember.email'];
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
  getDetail: async (req, res, next) => {
    try {
      const id = req.params.id;
      const nexoTransaction = await NexoTx.findOne({
        include: [
          {
            attributes: ['email'],
            as: "NexoMember",
            model: NexoMember,
            required: true
          }
        ],
        where: {
          id: id
        },
        raw: true
      });

      if (!nexoTransaction) {
        return res.notFound(res.__("NEXO_TRANSACTION_NOT_FOUND"), "NEXO_TRANSACTION_NOT_FOUND", { field: [id] });
      }
      nexoTransaction.email = nexoTransaction['NexoMember.email'];

      return res.ok(nexoTransaction);
    }
    catch (error) {
      logger.error('get exchange transaction detail fail', error);
      next(error);
    }
  },
  getNexoTxStatuses: async (req, res, next) => {
    try {
      const result = Object.keys(NexoTxStatus)
        .map(key => {
          return {
            value: NexoTxStatus[key],
            label: key,
          };
        });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get nexo status fail', error);
      next(error);
    }
  },
  getNexoTxType: async (req, res, next) => {
    try {
      const result = Object.keys(NexoTxType)
        .map(key => {
          return {
            value: NexoTxType[key],
            label: key,
          };
        });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get nexo type fail', error);
      next(error);
    }
  }
};
