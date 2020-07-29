const logger = require('app/lib/logger');
const MemberKyc = require("app/model/wallet").member_kycs;
const Kyc = require("app/model/wallet").kycs;
const MemberKycProperty = require("app/model/wallet").member_kyc_properties;
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Mapper = require('app/feature/response-schema/member-kyc-property.response-schema');
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
            attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value','note', 'createdAt', 'updatedAt'],
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
          id: kycIds,
          key: { [Op.not]: 'LEVEL_0' }
        }
      });
      const memberKycsResponse = [];
      memberKycs.forEach(item => {
        const kyc = kycs.find(x => x.id === item.kyc_id);
        if (kyc) {
          item.kyc_id = kyc.key.replace('LEVEL_','');
          item.memberKycProperties = Mapper(item.MemberKycProperties);
          // console.log(item.MemberKycProperties);
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
  update: async (req, res, next) => {
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

};
