const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const memberMapper = require("app/feature/response-schema/member.response-schema");
const Sequelize = require('sequelize');
const { affiliateApi, membershipApi } = require('app/lib/affiliate-api');
const database = require('app/lib/database').db().wallet;
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
      if (query.referralCode) where.referral_code = { [Op.iLike]: `%${query.referralCode}%` };
      if (query.referrerCode) where.referrer_code = { [Op.iLike]: `%${query.referrerCode}%` };
      if (query.name) where.name = { [Op.iLike]: `%${query.name}%` };
      if (query.email) where.email = { [Op.iLike]: `%${query.email}%` };

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
      const member = await Member.findOne({
        where: {
          id: params.memberId,
          deleted_flg: false
        },
        include: [{
          as: 'MembershipType',
          model: MembershipType,
        }]
      });
      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      if (member.MembershipType) {
        member.membership_type = member.MembershipType.name;
      }

      return res.ok(memberMapper(member));
    }
    catch (error) {
      logger.error('get member detail fail:', error);
      next(error);
    }
  },
  updateMember: async (req, res, next) => {
    let transaction;
    try {
      const { body, params } = req;
      const { memberId } = params;
      const membershipTypeId = body.membershipTypeId;
      const membershipType = await MembershipType.findOne({
        where: {
          id: membershipTypeId
        }
      });

      if (!membershipType) {
        return res.notFound(res.__("MEMBERSHIP_TYPE_NOT_FOUND"), "MEMBERSHIP_TYPE_NOT_FOUND", { fields: ["memberTypeId"] });
      }

      const member = await Member.findOne({
        where: {
          id: memberId,
          deleted_flg: false
        }
      });

      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      if (member.member_sts == MemberStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }

      if (member.member_sts == MemberStatus.UNACTIVATED) {
        return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
      }

      if (member.referrer_code && body.referrerCode) {
        return res.badRequest(res.__("REFERRER_CODE_SET_ALREADY"), "REFERRER_CODE_SET_ALREADY");
      }

      const hasChangedMembershipType = member.membership_type_id != membershipTypeId;
      const hasUpdatedReferrerCode = !member.referrer_code && body.referrerCode;

      const data = {
        membership_type_id: membershipTypeId
      };

      if (hasUpdatedReferrerCode) {
        data.referrer_code = body.referrerCode;
      }

      transaction = await database.transaction();
      try {
        await Member.update(
          data,
          {
            where: {
              id: member.id
            },
            returning: true,
            plain: true,
            transaction: transaction
          });

        let result;
        if (hasChangedMembershipType) {
          result = await membershipApi.updateMembershipType(member.email, membershipType);

          if (result.httpCode !== 200) {
            await transaction.rollback();

            return res.status(result.httpCode).send(result.data);
          }
        }

        if (hasUpdatedReferrerCode) {
          result = await affiliateApi.updateReferrer({ email: member.email, referrerCode: body.referrerCode });

          if (result.httpCode !== 200) {
            await transaction.rollback();

            return res.status(result.httpCode).send(result.data);
          }
        }

        await transaction.commit();
        return res.ok(true);
      }
      catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error('update member fail:', error);
      next(error);
    }
  },
  getMembershipTypeList: async (req, res, next) => {
    try {
      const membershipType = await MembershipType.findAll();
      return res.ok(membershipType);

    } catch (error) {

      logger.error('get membership type list fail:', error);
      next(error);
    }
  },
  getTreeChart: async (req, res, next) => {
    try {
      console.log(req.params.memberId);
      const member = await Member.findOne({
        where: {
          id: req.params.memberId,
          deleted_flg: false
        }
      });

      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      const result = await membershipApi.getTreeChart(member.email);

      if (result.httpCode !== 200) {
        return res.status(result.httpCode).send(result.data);
      }
      return res.ok(result.data);

    } catch (error) {

      logger.error('get member tree chart fail:', error);
      next(error);
    }
  }

};