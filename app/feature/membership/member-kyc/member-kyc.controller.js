const logger = require('app/lib/logger');
const MemberKyc = require("app/model/wallet").member_kycs;
const MemberKycProperty = require("app/model/wallet").member_kyc_properties;
const KycProperty = require("app/model/wallet").kyc_properties;
const KycStatus = require("app/model/wallet/value-object/kyc-status");
module.exports = {
  getAllMemberKyc: async (req, res, next) => {
    try {
      const { query, params } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const memberWhere = {
        member_id: params.memberId
      };
      const { count: total, rows: items } = await MemberKyc.findAndCountAll({
        limit,
        offset,
        include: [
          {
            attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value', 'createdAt', 'updatedAt'],
            as: "MemberKycProperty",
            model: MemberKycProperty,
            require: true
          },
          {
            attributes: ['id', 'kyc_id', 'field_name', 'field_key', 'description', 'data_type', 'member_field', 'require_flg', 'check_data_type_flg', 'order_index', 'enabled_flg', 'group_name', 'createdAt', 'updatedAt'],
            as: "KycProperty",
            model: KycProperty,
            require: true
          }
        ],
        where: memberWhere,
        order: [['created_at', 'DESC']]
      });
      return res.ok({
        items: items && items.length > 0 ? items : [],
        offset: offset,
        limit: limit,
        total: total
      });
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
        id: memberKycId,
      };
      const memberKyc = await MemberKyc.findAll({
        include: [
          {
            attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value', 'createdAt', 'updatedAt'],
            as: "MemberKycProperty",
            model: MemberKycProperty,
            required: true
          },
          {
            attributes: ['id', 'kyc_id', 'field_name', 'field_key', 'description', 'data_type', 'member_field', 'require_flg', 'check_data_type_flg', 'order_index', 'enabled_flg', 'group_name', 'createdAt', 'updatedAt'],
            as: "KycProperty",
            model: KycProperty,
            required: true
          }
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
