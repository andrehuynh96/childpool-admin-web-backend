const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MembershipOrder = require("app/model/wallet").membership_orders;
const EmailTemplate = require('app/model/wallet').email_templates;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const MemberOrderStatusFillter = require("app/model/wallet/value-object/member-order-status-fillter");
const MemberFillterStatusText = require("app/model/wallet/value-object/member-fillter-status-text");
const MembershipOrderStatus = require("app/model/wallet/value-object/membership-order-status");
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type');
const KycStatus = require("app/model/wallet/value-object/kyc-status");
const Kyc = require("app/model/wallet").kycs;
const memberMapper = require("app/feature/response-schema/member.response-schema");
const Sequelize = require('sequelize');
const { affiliateApi, membershipApi } = require('app/lib/affiliate-api');
const database = require('app/lib/database').db().wallet;
const stringify = require('csv-stringify');
const moment = require('moment');
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const mailer = require('app/lib/mailer');
const config = require('app/config');
const uuidV4 = require('uuid/v4');

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const memberCond = await _createMemberCond(query);
      const membershipOrderCond = {};

      let filterStatus = query.status;
      let requiredMembershipOrder = false;
      let memberIdList = null;
      let includeLatestMembershipOrder = true;

      if (filterStatus) {
        if (filterStatus === MemberOrderStatusFillter.Unactivated) {
          memberCond.member_sts = MemberStatus.UNACTIVATED;
        }
        else if (filterStatus === MemberOrderStatusFillter.Deactivated) {
          memberCond.deleted_flg = true;
        } else if (filterStatus === MemberOrderStatusFillter.FeeAccepted) {
          requiredMembershipOrder = true;
          membershipOrderCond.status = MembershipOrderStatus.Approved;
        } else if (filterStatus === MemberOrderStatusFillter.VerifyPayment) {
          requiredMembershipOrder = true;
          membershipOrderCond.status = MembershipOrderStatus.Pending;
        } else if (filterStatus === MemberOrderStatusFillter.Active) {
          includeLatestMembershipOrder = false;

          const membersWhichHasRejectedOrder = await Member.findAll({
            where: memberCond,
            include: [
              {
                attributes: ['id', 'status'],
                as: "LatestMembershipOrder",
                model: MembershipOrder,
                where: {
                  status: MembershipOrderStatus.Rejected,
                },
                required: true,
              },
            ],
          });

          memberIdList = membersWhichHasRejectedOrder.map(x => x.id);
          memberCond.deleted_flg = false;
          const orCond = [
            {
              latest_membership_order_id: { [Op.eq]: null }
            },
            {
              id: { [Op.in]: memberIdList }
            }
          ];

          memberCond[Op.or] = orCond;
        }
      }

      const include = includeLatestMembershipOrder ? [
        {
          attributes: ['id', 'status'],
          as: "LatestMembershipOrder",
          model: MembershipOrder,
          where: membershipOrderCond,
          required: requiredMembershipOrder,
          right: false,
        },
      ] : [];

      let order = [];
      const order_by = query.order_by;
      if (order_by) {
        for (let sort of order_by.split(',')) {
          if (sort.includes('-')) {
            order.push([sort.trim().substring(1), 'DESC']);
          } else {
            order.push([sort.trim(), 'ASC']);
          }
        }
      } else {
        order.push(['created_at', 'DESC']);
      }

      const { count: total, rows: items } = await Member.findAndCountAll({
        limit,
        offset,
        where: memberCond,
        include,
        order: order
      });

      const membershipTypeIds = items.map(item => item.membership_type_id);
      const membershipTypes = await MembershipType.findAll({
        where: {
          id: membershipTypeIds,
          deleted_flg: false
        }
      });

      items.forEach(item => {
        const membershipType = membershipTypes.find(membershipType => membershipType.id === item.membership_type_id);
        item.membership_type = membershipType ? membershipType.name : 'Basic';
        item.kyc_level = (item.kyc_level || '').replace('LEVEL_', '') || '0';
      });

      if (filterStatus) {
        items.forEach(item => {
          item.status = MemberFillterStatusText[filterStatus];
        });

        return res.ok({
          items: items.length > 0 ? memberMapper(items) : [],
          offset: offset,
          limit: limit,
          total: total
        });
      }

      items.forEach(item => {
        const latestMembershipOrder = item.LatestMembershipOrder;
        if (item.deleted_flg) {
          item.status = MemberOrderStatusFillter.Deactivated;
        }
        else if (item.member_sts === MemberStatus.UNACTIVATED) {
          item.status = MemberOrderStatusFillter.Unactivated;
        }
        else if (latestMembershipOrder) {
          switch (latestMembershipOrder.status) {
            case MembershipOrderStatus.Pending:
              item.status = MemberOrderStatusFillter.VerifyPayment;
              break;

            case MembershipOrderStatus.Approved:
              item.status = MemberOrderStatusFillter.FeeAccepted;
              break;

            case MembershipOrderStatus.Rejected:
              item.status = MemberOrderStatusFillter.Active;
              break;
          }
        } else {
          item.status = MemberOrderStatusFillter.Active;
        }

        item.status = MemberFillterStatusText[item.status];
      });

      return res.ok({
        items: items.length > 0 ? memberMapper(items) : [],
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

      const membershipOrder = await MembershipOrder.findOne({
        where: {
          member_id: member.id
        },
        order: [['created_at', 'DESC']]
      });

      if (member.deleted_flg) {
        member.status = MemberOrderStatusFillter.Deactivated;
      }
      else if (member.member_sts === MemberStatus.UNACTIVATED) {
        member.status = MemberOrderStatusFillter.Unactivated;
      }
      else if (membershipOrder && membershipOrder.status == 'Approved') {
        member.status = MemberFillterStatusText.FeeAccepted;
      } else if (membershipOrder && membershipOrder.status == 'Pending') {
        member.status = MemberFillterStatusText.VerifyPayment;
        member.latest_membership_order_id = membershipOrder.id;
      } else {
        member.status = MemberFillterStatusText.Active;
      }

      member.kyc_level = (member.kyc_level || '').replace('LEVEL_', '');
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

      return res.ok(memberMapper(member));
    }
    catch (error) {
      logger.error('get member detail fail:', error);
      next(error);
    }
  },
  getMaxReferences: async (req, res, next) => {
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

      let max_references = null;

      if (member.referral_code) {
        const affiliateCodeDetailsResult = await affiliateApi.getAffiliateCodeDetails(member.referral_code);
        if (affiliateCodeDetailsResult.httpCode !== 200) {
          return res.status(affiliateCodeDetailsResult.httpCode).send(affiliateCodeDetailsResult.data);
        }

        max_references = affiliateCodeDetailsResult.data.max_references;
      }

      return res.ok({ max_references, deleted_flg: member.deleted_flg });
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
          // deleted_flg: false
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
      if (!hasChangedMembershipType) {
        return res.badRequest(res.__("MEMBERSHIP_TYPE_EXIST_ALREADY"), "MEMBERSHIP_TYPE_EXIST_ALREADY", { fields: ["membershipTypeId"] });
      }

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
          result = await membershipApi.updateMembershipType(member, membershipType);

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
  updaterReferrerCode: async (req, res, next) => {
    let transaction;
    try {
      const { body, params } = req;
      const { memberId } = params;
      const referrerCode = body.referrerCode;

      const member = await Member.findOne({
        where: {
          id: memberId,
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

      const hasUpdatedReferrerCode = member.referrer_code !== referrerCode;
      const data = {
        referrer_code: referrerCode,
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

        if (hasUpdatedReferrerCode) {
          result = await affiliateApi.updateReferrer({ email: member.email, referrerCode: referrerCode });

          if (result.httpCode !== 200) {
            await transaction.rollback();

            return res.status(result.httpCode).send(result.data);
          }
          const goldMembership = await MembershipType.findOne({
            where: {
              name: 'Gold'
            }
          });
          const silverMembership = await MembershipType.findOne({
            where: {
              name: 'Silver'
            }
          });
          await Member.update({
            membership_type_id: goldMembership.id
          },
            {
              where: {
                id: memberId,
                membership_type_id: silverMembership.id
              },
              transaction: transaction
            });
          member.referral_code = referrerCode;
          if (member.membership_type_id === silverMembership.id && member.kyc_id == '2' ) {
            result = await membershipApi.updateMembershipType(member, goldMembership);

            if (result.httpCode !== 200) {
              await transaction.rollback();

              return res.status(result.httpCode).send(result.data);
            }
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
  setMaxReferences: async (req, res, next) => {
    try {
      const { body, params } = req;
      const { memberId } = params;
      const max_references = body.max_references;

      const member = await Member.findOne({
        where: {
          id: memberId,
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

      const result = await affiliateApi.updateAffiliateCode(member.referral_code, { max_references });
      if (result.httpCode !== 200) {
        return res.status(result.httpCode).send(result.data);
      }

      return res.ok(result.data);

    }
    catch (error) {
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
      const memberOrderStatusDropdown = Object.keys(MemberFillterStatusText).map(key => {
        return {
          value: key,
          label: MemberFillterStatusText[key]
        };
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
            // deleted_flg: false
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
  downloadCSV: async (req, res, next) => {
    try {
      const { query } = req;
      const memberCond = await _createMemberCond(query);
      const membershipOrderCond = {};

      let filterStatus = query.status;
      let requiredMembershipOrder = false;
      let memberIdList = null;
      let includeLatestMembershipOrder = true;

      if (filterStatus) {
        if (filterStatus === MemberOrderStatusFillter.Unactivated) {
          memberCond.member_sts = MemberStatus.UNACTIVATED;
        } else if (filterStatus === MemberOrderStatusFillter.Deactivated) {
          memberCond.deleted_flg = true;
        } else if (filterStatus === MemberOrderStatusFillter.FeeAccepted) {
          requiredMembershipOrder = true;
          membershipOrderCond.status = MembershipOrderStatus.Approved;
        } else if (filterStatus === MemberOrderStatusFillter.VerifyPayment) {
          requiredMembershipOrder = true;
          membershipOrderCond.status = MembershipOrderStatus.Pending;
        } else if (filterStatus === MemberOrderStatusFillter.Active) {
          includeLatestMembershipOrder = false;

          const membersWhichHasRejectdOrder = await Member.findAll({
            where: memberCond,
            include: [
              {
                attributes: ['id', 'status'],
                as: "LatestMembershipOrder",
                model: MembershipOrder,
                where: {
                  status: MembershipOrderStatus.Rejected,
                },
                required: true,
              },
            ],
          });

          memberIdList = membersWhichHasRejectdOrder.map(x => x.id);
          memberCond.deleted_flg = false;
          const orCond = [
            {
              latest_membership_order_id: { [Op.eq]: null }
            },
            {
              id: { [Op.in]: memberIdList }
            }
          ];

          memberCond[Op.or] = orCond;
        }
      }

      const include = includeLatestMembershipOrder ? [
        {
          attributes: ['id', 'status'],
          as: "LatestMembershipOrder",
          model: MembershipOrder,
          where: membershipOrderCond,
          required: requiredMembershipOrder,
          right: false,
        },
      ] : [];

      let order = [];
      const order_by = query.orderBy;
      if (order_by) {
        for (let sort of order_by.split(',')) {
          if (sort.includes('-')) {
            order.push([sort.trim().substring(1), 'DESC']);
          } else {
            order.push([sort.trim(), 'ASC']);
          }
        }
      } else {
        order.push(['created_at', 'DESC']);
      }

      const items = await Member.findAll({
        where: memberCond,
        include,
        order: order
      });

      const membershipTypeIds = items.map(item => item.membership_type_id);
      const membershipTypes = await MembershipType.findAll({
        where: {
          id: membershipTypeIds,
          deleted_flg: false
        }
      });

      items.forEach(item => {
        const membershipType = membershipTypes.find(membershipType => membershipType.id === item.membership_type_id);
        item.membership_type = membershipType ? membershipType.name : 'Basic';
        item.kyc_level = (item.kyc_level || '').replace('LEVEL_', '') || '0';
      });

      if (filterStatus) {
        items.forEach(item => {
          item.status = MemberFillterStatusText[filterStatus];
        });
      }

      items.forEach((item, index) => {
        item.no = index + 1;
        item.last_name = item.last_name || '-';
        item.first_name = item.first_name || '-';
        const latestMembershipOrder = item.LatestMembershipOrder;

        if (item.deleted_flg) {
          item.status = MemberOrderStatusFillter.Deactivated;
        }
        else if (item.member_sts === MemberStatus.UNACTIVATED) {
          item.status = MemberOrderStatusFillter.Unactivated;
        }
        else if (latestMembershipOrder) {
          switch (latestMembershipOrder.status) {
            case MembershipOrderStatus.Pending:
              item.status = MemberOrderStatusFillter.VerifyPayment;
              break;

            case MembershipOrderStatus.Approved:
              item.status = MemberOrderStatusFillter.FeeAccepted;
              break;

            case MembershipOrderStatus.Rejected:
              item.status = MemberOrderStatusFillter.Active;
              break;
          }
        } else {
          item.status = MemberOrderStatusFillter.Active;
        }

        item.status = MemberFillterStatusText[item.status];
      });

      const timezone_offset = query.timezone_offset || 0;
      items.forEach(element => {
        element.created_at = moment(element.createdAt).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
      });
      const data = await stringifyAsync(items, [
        { key: 'no', header: '#' },
        { key: 'last_name', header: 'Last Name' },
        { key: 'first_name', header: 'First Name' },
        { key: 'email', header: 'Email' },
        { key: 'kyc_level', header: 'KYC' },
        { key: 'kyc_status', header: 'KYC Status' },
        { key: 'membership_type', header: 'Membership' },
        { key: 'status', header: 'Status' },
        { key: 'referral_code', header: 'Referral' },
        { key: 'referrer_code', header: 'Referrer' },
        { key: 'created_at', header: 'Joined' },
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=member.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (error) {
      logger.error('download member CSV fail:', error);
      next(error);
    }
  },
  resendActiveEmail: async (req, res, next) => {
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

      const verifyToken = Buffer.from(uuidV4()).toString('base64');
      const expiredDate = moment().add(config.expiredVefiryToken, 'hours');
      await OTP.update({
        expired: true
      }, {
        where: {
          member_id: member.id,
          action_type: OtpType.REGISTER,
        },
        returning: true
      });

      const otp = await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: expiredDate,
        member_id: member.id,
        action_type: OtpType.REGISTER,
      });

      await _sendEmail[OtpType.REGISTER](member, otp, res);

      return res.ok(true);
    }
    catch (err) {
      logger.error('resend email fail:', err);
      next(err);
    }
  },
};

async function _createMemberCond(query) {
  const memberCond = {};
  if (query.membershipTypeId) {
    if (query.membershipTypeId == 'Basic') {
      memberCond.membership_type_id = { [Op.is]: null };
    }
    else {
      memberCond.membership_type_id = query.membershipTypeId;
    }
  }

  if (query.kycLevel) {
    memberCond.kyc_level = query.kycLevel;
  }

  if (query.kycStatus) {
    memberCond.kyc_status = KycStatus[query.kycStatus];
  }

  if (query.referralCode) {
    memberCond.referral_code = { [Op.iLike]: `%${query.referralCode}%` };
  }
  if (query.referrerCode) {
    memberCond.referrer_code = { [Op.iLike]: `%${query.referrerCode}%` };
  }

  if (query.firstName) {
    memberCond.first_name = { [Op.iLike]: `%${query.firstName}%` };
  }
  if (query.lastName) {
    memberCond.last_name = { [Op.iLike]: `%${query.lastName}%` };
  }

  if (query.email) {
    memberCond.email = { [Op.iLike]: `%${query.email}%` };
  }

  return memberCond;
}

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

const _sendEmail = {
  [OtpType.REGISTER]: async (member, otp, res) => {
    try {
      let templateName = EmailTemplateType.VERIFY_EMAIL;
      let template = await EmailTemplate.findOne({
        where: {
          name: templateName,
          language: member.current_language
        }
      });

      if (!template) {
        template = await EmailTemplate.findOne({
          where: {
            name: templateName,
            language: 'en'
          }
        });
      }

      if (!template) {
        return res.notFound(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ["id"] });
      }

      let subject = `${config.emailTemplate.partnerName} - ${template.subject}`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.website.urlActiveMember}${otp.code}`,
        hours: config.expiredVefiryToken
      };

      data = Object.assign({}, data, config.email);
      await mailer.sendWithDBTemplate(subject, from, member.email, data, template.template);
    } catch (err) {
      logger.error("resend email create account fail", err);
    }
  },

};
