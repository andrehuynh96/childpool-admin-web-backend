const logger = require('app/lib/logger');
const MemberKyc = require("app/model/wallet").member_kycs;
const Kyc = require("app/model/wallet").kycs;
const MemberKycProperty = require("app/model/wallet").member_kyc_properties;
const KycStatus = require("app/model/wallet/value-object/kyc-status");
const Sequelize = require('sequelize');
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
            attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value', 'createdAt', 'updatedAt'],
            as: "MemberKycProperties",
            model: MemberKycProperty,
            where: memberKycPropertyCond,
            required: true
          }
        ],
        where: memberWhere,
        order: [['id', 'ASC']]
      });

      const kycIds = memberKycs.map(item => item.kyc_id);

      const kycs = await Kyc.findAll({
        where: {
          id: kycIds
        }
      });

      memberKycs.forEach(item => {
        const kyc = kycs.find(x => x.id === item.kyc_id);
        if (kyc) {
          item.kyc_id = kyc.key.replace('LEVEL_','');
        }
      });
      return res.ok(memberKycs);
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
  updateStatus: async (req, res, next) => {
    try {
      const { params, body } = req;
      const { memberKycId, memberId } = params;
      const { status } = body;
      const memberWhere = {
        member_id: memberId,
        id: memberKycId,
        deleted_flg: false
      };
      const memberKyc = await MemberKyc.findOne(memberWhere);
      if (!memberKyc) {
        return res.notFound(res.__("MEMBER_KYC_NOT_FOUND"), "MEMBER_KYC_NOT_FOUND", { field: ['memberId', 'memberKycId'] });
      }

      if (status !== KycStatus.DECLINED || status !== KycStatus.APPROVED || status !== KycStatus.INSUFFICIENT) {
        return res.notFound(res.__("KYC_STATUS_NOT_FOUND"), "KYC_STATUS_NOT_FOUND", { field: ['status'] });
      }

      await MemberKyc.update({
        status: status
      }, {
        where: memberWhere,
        returning: true
      });
    }
    catch (error) {
      logger.info('get update member kyc status fail', error);
      next(error);
    }
  },

};
