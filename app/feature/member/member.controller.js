const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const memberMapper = require("app/feature/response-schema/member.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const where = {
        deleted_flg: false
      };
      if (query.membershipTypeId) where.membership_type_id = query.membershipTypeId;
      if (query.referralCode) where.referral_code = query.referralCode;
      if (query.referrerCode) where.referrer_code = query.referrerCode;
      if (query.name) where.name = { [Op.iLike]: `%${req.query.name}%` };
      if (query.email) where.email = { [Op.iLike]: `%${req.query.email}%` };

      const { count: total, rows: items } = await Member.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });
      const membershipTypeIds = items.map(item => item.membership_type_id);
      const membershipTypes = await MembershipType.findAll(
        {
          where: {
            id: membershipTypeIds,
            deleted_flg: false
          }
        }
      );

      items.forEach(item => {
        const membershipType = membershipTypes.find(membershipType => membershipType.id === item.membership_type_id);
        if (membershipType) {
          item.membership_type = membershipType.name;
        }
      });


      return res.ok({
        items: memberMapper(items) && items.length > 0 ? memberMapper(items) : [],
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('search member fail:', err);
      next(err);
    }
  },
  getMemberDetail: async (req, res, next) => {
    try {
      const { params } = req;
      console.log(params.memberId);
      const member = await Member.findOne(
        {
          where: {
            id: params.memberId,
            deleted_flg: false
          }
        });
      if (!member) {
        return res.badRequest(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }
      const membershipType = await MembershipType.findOne({
        where: {
          id: member.membership_type_id,
          deleted_flg: false
        }
      });

      if (membershipType) {
        member.membership_type = membershipType.name;
      }
      
      return res.ok(memberMapper(member));
    }
    catch (error) {
      logger.error('get member detail fail:', error);
      next(error);
    }
  },
}