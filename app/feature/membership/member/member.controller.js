const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MembershipOrder = require("app/model/wallet").membership_orders;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const MemberOrderStatusFillter = require("app/model/wallet/value-object/member-order-status-fillter");
const Kyc = require("app/model/wallet").kycs;
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
      const where = {};
      const membershipOrderCond = {};

      if (query.membershipTypeId) where.membership_type_id = query.membershipTypeId;
      if (query.kycLevel) where.kyc_level = query.kycLevel;
      if (query.status) {
        if (query.status === MemberOrderStatusFillter.FeeAccepted) {
          membershipOrderCond.status = MemberOrderStatusFillter.FeeAccepted;
        }
        if (query.status === MemberOrderStatusFillter.VerifyPayment) {
          membershipOrderCond.status = MemberOrderStatusFillter.VerifyPayment;
        }
        if (query.status === MemberOrderStatusFillter.Active) {
          membershipOrderCond.status = MemberOrderStatusFillter.Active;
        }
        if (query.status === MemberOrderStatusFillter.Deactivated) {
          where.deleted_flg = true;
        }
      }
      if (query.referralCode) where.referral_code = { [Op.iLike]: `%${query.referralCode}%` };
      if (query.referrerCode) where.referrer_code = { [Op.iLike]: `%${query.referrerCode}%` };

      if (query.firstName) {
        where.first_name = { [Op.iLike]: `%${query.firstName}%` };
      }
      if (query.lastName) {
        where.last_name = { [Op.iLike]: `%${query.lastName}%` };
      }

      if (query.email) {
        where.email = { [Op.iLike]: `%${query.email}%` };
      }

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
        else {
          item.membership_type = 'Basic';
        }
      });

      const memberIds = items.map(item => item.id);
      membershipOrderCond.member_id = memberIds;

      const membershipOrders = await MembershipOrder.findAll({
        where: membershipOrderCond,
        order: [['created_at', 'DESC']]
      });

      const lastMembershipOrder = [];
      memberIds.forEach(item => {
        lastMembershipOrder.push({
          member_id: item,
          createdAt: new Date(1, 1, 1)
        });
      });

      membershipOrders.forEach(item => {
        lastMembershipOrder.forEach(x => {
          if (item.createdAt > x.createdAt && item.member_id === x.member_id) {
            x.createdAt = item.createdAt;
            x.status = item.status;
          }
        });
      });

      items.forEach(item => {
        item.kyc_level = (item.kyc_level || '').replace('LEVEL_', '');

        if (item.deleted_flg) {
          item.status = MemberOrderStatusFillter.Deactivated;
        }
        const membershipOrder = lastMembershipOrder.find(x => item.id === x.member_id && x.status);
        if (membershipOrder) {
          if (membershipOrder.status === MemberOrderStatusFillter.Fee_accepted) item.status = 'Fee cccepted';
          else if (membershipOrder.status === MemberOrderStatusFillter.Verify_payment) item.status = 'Verify payment';
          else {
            item.status = 'Active';
          }
        }
        else {
          item.status = 'Active';
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
        },
      });
      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      if (!member.membership_type_id) {
        member.membership_type = 'Basic';
        return res.ok(memberMapper(member));
      }

      const membershipType = await MembershipType.findOne({
        where: {
          id: member.membership_type_id
        }
      });

      if (!membershipType) {
        return res.notFound(res.__("MEMBERSHIP_TYPE_NOT_FOUND"), "MEMBERSHIP_TYPE_NOT_FOUND");
      }
      member.membership_type = membershipType.name;
      member.kyc_level = member.kyc_level.replace('LEVEL_', '');

      return res.ok(memberMapper(member));
    }
    catch (error) {
      logger.error('get member detail fail:', error);
      next(error);
    }
  },
  updateMembershipType: async (req, res, next) => {
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

      const data = {
        membership_type_id: membershipTypeId
      };

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
        else {
          return res.badRequest(res.__("MEMBERSHIP_TYPE_EXIST_ALREADY"), "MEMBERSHIP_TYPE_EXIST_ALREADY", { fields: ["membershipTypeId"] });
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

  updaterReferrerCode: async (req, res, next) => {
    let transaction;
    try {
      const { body, params } = req;
      const { memberId } = params;
      const referralCode = body.referrerCode;

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

      const hasUpdatedReferrerCode = !member.referrer_code && body.referrerCode;
      const data = {};
      if (hasUpdatedReferrerCode) {
        data.referrer_code = referralCode;
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

        if (hasUpdatedReferrerCode) {
          result = await affiliateApi.updateReferrer({ email: member.email, referrerCode: referralCode });

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
  getMemberOrderStatusFillter: async (req, res, next) => {
    try {
      const memberOrderStatusFillter = Object.keys(MemberOrderStatusFillter);
      const memberOrderStatusDropdown = [];
      memberOrderStatusFillter.forEach(item => {
        if (item === 'FeeAccepted') {
          memberOrderStatusDropdown.push({
            label: 'Fee accepted',
            value: item
          });
        }
        else if (item === 'VerifyPayment') {
          memberOrderStatusDropdown.push({
            label: 'Verify payment',
            value: item
          });
        }
        else {
          memberOrderStatusDropdown.push({
            label: item,
            value: item
          });
        }
      });
      return res.ok(memberOrderStatusDropdown);

    } catch (error) {

      logger.error('get member order status fillter list fail:', error);
      next(error);
    }
  },
  getAllKyc: async (req, res, next) => {
    try {
      const kycs = await Kyc.findAll({ order: [['name', 'ASC']] });
      const kycLevels = kycs.map(item => {
        return {
          label: item.name.replace('Level', 'KYC'),
          value: item.key
        };
      });
      return res.ok(kycLevels);

    } catch (error) {

      logger.error('get kyc status listt fail:', error);
      next(error);
    }
  },
  getTreeChart: async (req, res, next) => {
    try {
      const member = await Member.findOne({
        where: {
          id: req.params.memberId,
          deleted_flg: false
        }
      });

      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      const getMembershipTreeTask = await membershipApi.getTreeChart(member.email);
      const getAffiliateTreeChartTask = await affiliateApi.getTreeChart(member.email);
      const [getMembershipTreeResult, getAffiliateTreeChartResult] = await Promise.all([getMembershipTreeTask, getAffiliateTreeChartTask]);

      if (getMembershipTreeResult.httpCode !== 200) {
        return res.status(getMembershipTreeResult.httpCode).send(getMembershipTreeResult.data);
      }
      if (getAffiliateTreeChartResult.httpCode !== 200) {
        return res.status(getAffiliateTreeChartResult.httpCode).send(getAffiliateTreeChartResult.data);
      }

      const result = [getMembershipTreeResult.data, getAffiliateTreeChartResult.data];

      return res.ok(result);
    } catch (error) {
      logger.error('get member tree chart fail:', error);
      next(error);
    }
  },
  getMemberReferralStructure: async (req, res, next) => {
    try {
      const member = await Member.findOne({
        where: {
          id: req.params.memberId,
          deleted_flg: false
        }
      });

      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      const memberRefStructure = await affiliateApi.getMemberReferralStructure(member.email);

      if (memberRefStructure.httpCode !== 200) {
        return res.status(memberRefStructure.httpCode).send(memberRefStructure.data);
      }

      let result = { email: member.email, affiliate: memberRefStructure.data };
      if (member.referrer_code) {
        let referrer = await Member.findOne({
          where: {
            referral_code: member.referrer_code,
            deleted_flg: false
          }
        });

        if (referrer) {
          result.referrer_email = referrer.email;
        }
      }

      return res.ok(result);
    } catch (error) {
      logger.error('get member referal structure fail:', error);
      next(error);
    }
  },
};