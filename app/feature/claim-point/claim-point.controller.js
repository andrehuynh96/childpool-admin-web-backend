const Sequelize = require('sequelize');
const moment = require('moment');
const logger = require('app/lib/logger');
const ClaimPoint = require("app/model/wallet").claim_points;
const Member = require("app/model/wallet").members;
const SystemType = require("app/model/wallet/value-object/system-type");
const ClaimPointStatus = require("app/model/wallet/value-object/claim-point-status");
const mapper = require("app/feature/response-schema/claim-point.response-schema");

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = parseInt(query.limit);
      const offset = parseInt(query.offset);
      const where = {
        status: ClaimPointStatus.Claim,
        system_type: SystemType.MEMBERSHIP,
      };
      let fromDate, toDate;

      if (query.from_date || query.to_date) {
        where.created_at = {};
      }

      if (query.from_date) {
        fromDate = moment(query.from_date).toDate();
        where.created_at[Op.gte] = fromDate;
      }
      if (query.to_date) {
        toDate = moment(query.to_date).toDate();
        where.created_at[Op.lt] = toDate;
      }
      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }

      const memberCond = {
        deleted_flg: false
      };

      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
      }

      const { count: total, rows: items } = await ClaimPoint.findAndCountAll({
        limit,
        offset,
        include: [
          {
            attributes: ['id', 'email'],
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
        items: mapper(items) && items.length > 0 ? mapper(items) : [],
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.info('get claim point list fail', error);
      next(error);
    }
  },
};

