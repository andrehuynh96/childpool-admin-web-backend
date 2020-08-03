const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MemberKyc = require("app/model/wallet").member_kycs;
const Kyc = require("app/model/wallet").kycs;
const MemberKycProperty = require("app/model/wallet").member_kyc_properties;
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const config = require('app/config');
const KycStatus = require("app/model/wallet/value-object/kyc-status");
const { membershipApi } = require('app/lib/affiliate-api');
const Op = Sequelize.Op;

module.exports = {
  getAllMemberKyc: async (req, res, next) => {
    try {
      const memberWhere = {
        member_id: req.params.memberId
      };
      const memberKycPropertyCond = {
        field_name: { [Op.notILike]: 'Password' },
        field_key: { [Op.notILike]: 'password' }
      };
      const memberKycs = await MemberKyc.findAll({
        include: [
          {
            attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value', 'note', 'createdAt', 'updatedAt'],
            as: "MemberKycProperties",
            model: MemberKycProperty,
            where: memberKycPropertyCond,
            required: true
          }
        ],
        where: memberWhere,
        order: [['id', 'ASC']],
      });

      const kycIds = memberKycs.map(item => item.kyc_id);

      const kycs = await Kyc.findAll({
        where: {
          id: kycIds,
          key: { [Op.not]: 'LEVEL_0' }
        }
      });
      const memberKycsResponse = [];
      memberKycs.forEach(item => {
        const kyc = kycs.find(x => x.id === item.kyc_id);
        if (kyc) {
          item.dataValues.kyc_level = kyc.key.replace('LEVEL_', '');
          item.MemberKycProperties = _replaceImageUrl(item.MemberKycProperties);
          memberKycsResponse.push(item);
        }
      });
      return res.ok(memberKycsResponse);
    }
    catch (error) {
      logger.info('get member kyc list fail', error);
      next(error);
    }
  },
  getMemberKycDetail: async (req, res, next) => {
    try {
      const { params } = req;
      const { memberKycId, memberId } = params;
      const memberWhere = {
        member_id: memberId,
        id: memberKycId
      };
      const memberKycPropertyCond = {
        member_kyc_id: memberKycId,
        field_name: { [Op.notILike]: 'Password' },
        field_key: { [Op.notILike]: 'password' }
      };
      const memberKyc = await MemberKyc.findAll({
        include: [
          {
            attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value', 'createdAt', 'updatedAt'],
            as: "MemberKycProperties",
            model: MemberKycProperty,
            where: memberKycPropertyCond,
            required: true
          },
        ],
        where: memberWhere,
        order: [['created_at', 'DESC']]
      });

      if (!memberKyc) {
        return res.notFound(res.__("MEMBER_KYC_NOT_FOUND"), "MEMBER_KYC_NOT_FOUND", { field: ['memberId', 'memberKycId'] });
      }
      return res.ok(memberKyc);

    } catch (error) {
      logger.info('get member kyc detail fail', error);
      next(error);
    }
  },
  updateProperties: async (req, res, next) => {
    let transaction;
    try {
      const { body } = req;
      const memberKycProperties = body.member_kyc_properties;
      transaction = await database.transaction();
      for (let item of memberKycProperties) {
        const memberKycProperty = await MemberKycProperty.findOne({
          where: {
            id: item.id
          }
        });
        if (!memberKycProperty) {
          return res.notFound(res.__("MEMBER_KYC_PROPERTY_LIST_HAVE_ONE_ID_NOT_FOUND"), "MEMBER_KYC_PROPERTY_LIST_HAVE_ONE_ID_NOT_FOUND", { field: [item.id] });
        }
        await MemberKycProperty.update(
          { value: item.value },
          {
            where: {
              id: memberKycProperty.id
            },
            transaction: transaction
          }
        );
      }
      transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('get update member kyc properties fail', error);
      next(error);
    }
  },
  getKycStatuses: async (req, res, next) => {
    try {
      const memberOrderStatusDropdown = Object.keys(KycStatus).map(key => {
        return {
          value: key,
          label: KycStatus[key]
        };
      });

      return res.ok(memberOrderStatusDropdown);
    } catch (error) {
      logger.error('getKycStatuses:', error);
      next(error);
    }
  },
  updateStatus: async (req, res, next) => {
    let transaction;
    try {
      const { body, params } = req;
      const member = await Member.findOne({
        where: {
          id: params.memberId
        }
      });

      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }
      const kyc = await Kyc.findOne({
        where: {
          id: params.kycId
        }
      });

      const memberKyc = await MemberKyc.findOne({
        where: {
          member_id: member.id,
          kyc_id: kyc.id,
          status: [ KycStatus.IN_REVIEW, KycStatus.INSUFFICIENT ]
        }
      });
      if (!memberKyc) {
        return res.notFound(res.__("MEMBER_KYC_NOT_FOUND"), "MEMBER_KYC_NOT_FOUND");
      }

      transaction = await database.transaction();
      await Member.update({
        kyc_status: KycStatus[body.status]
      }, {
        where: {
          id: member.id
        },
        returning: true,
        transaction: transaction
      });
      await MemberKyc.update({
        status: KycStatus[body.status]
      }, {
        where: {
          id: memberKyc.id
        },
        returning: true,
        transaction: transaction
      });

      if (KycStatus[body.status] === KycStatus.APPROVED && kyc.approve_membership_type_id != null && !member.membership_type_id) {
        await Member.update({
          membership_type_id: kyc.approve_membership_type_id
        }, {
          where: {
            id: member.id
          },
          returning: true,
          transaction: transaction
        });

        const result = await membershipApi.updateMembershipType(member, { membership_type_id: kyc.approve_membership_type_id });

        if (result.httpCode !== 200) {
          transaction.rollback();
          return res.status(result.httpCode).send(result.data);
        }
      }
      transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback;
      }
      logger.error('update member kyc status fail', error);
      next(error);
    }
  }

};

function _replaceImageUrl(memberKycProperties) {
  memberKycProperties.forEach(e => {
    if (e.value && e.value.startsWith("http")) {
      for (let i of config.aws.bucketUrls) {
        if (e.value.indexOf(i) > -1) {
          e.value = e.value.replace(i, config.website.url + "/web/static/images");
          break;
        }
      }
    }
  });
}