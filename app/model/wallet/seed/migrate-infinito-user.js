const Member = require('app/model/wallet').members;
const MemberSetting = require('app/model/wallet').member_settings;
const Kyc = require('app/model/wallet').kycs;
const KycProperty = require('app/model/wallet').kyc_properties;
const MemberKyc = require('app/model/wallet').member_kycs;
const MemberKycProperty = require('app/model/wallet').member_kyc_properties;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const KycDataType = require('app/model/wallet/value-object/kyc-data-type');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
const { affiliateApi } = require('app/lib/affiliate-api');
const logger = require('app/lib/logger');
const Joi = require("joi");
const database = require('app/lib/database').db().wallet;

module.exports = async () => {
  try {
    let result = await _getInfinitoUser();
    if (result && result.length > 0) {
      for (let u of result) {
        await _createMember(u);
      }
    }
  }
  catch (err) {
    logger.error(`sync Infinito User:: `, err)
  }
};

async function _createMember(user) {
  let transaction;
  try {
    transaction = await database.transaction();
    let member = await Member.create({
      email: user.email.toLowerCase(),
      password_hash: user.password,
      fullname: user.full_name,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      member_sts: user.active == 1 ? MemberStatus.ACTIVATED : MemberStatus.UNACTIVATED,
      referral_code: '',
      infinito_id: user.id,
      source: 'Infinito'
    }, {
        transaction: transaction
      });

    if (!member) {
      throw new Error(`Create member failed :: ${user.email.toLowerCase()}`);
    }
    await MemberSetting.create({
      member_id: member.id
    }, {
        transaction: transaction
      });

    let resultAffiliate = await affiliateApi.register({
      email: user.email.toLowerCase()
    });
    if (resultAffiliate.httpCode !== 200) {
      throw new Error(`Create affiliate failed :: `, resultAffiliate.data);
    }
    member.referral_code = resultAffiliate.data.code;
    member.affiliate_id = resultAffiliate.data.client_affiliate_id;

    member = await _createKyc(member, transaction);
    await transaction.commit();
    await member.save();
    await _sync(user.id);
  }
  catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    if (err.name === "SequelizeUniqueConstraintError") {
      await _sync(user.id);
    }
    logger.error(`_createMember member failed :: `, err)
  }
}

async function _createKyc(member, transaction) {
  let kyc = await Kyc.findOne({
    where: {
      first_level_flg: true
    }
  });
  if (!kyc) {
    return member;
  }

  let oldMemberKyc = await MemberKyc.findOne({
    where: {
      kyc_id: kyc.id,
      member_id: member.id,
    }
  });
  if (oldMemberKyc) {
    return member;
  }

  const properties = await KycProperty.findAll({
    where: {
      kyc_id: kyc.id,
      enabled_flg: true
    },
    order: [['order_index', 'ASC']]
  });

  let dataMember = {};
  for (let p of properties) {
    if (member[p.member_field]) {
      dataMember[p.field_key] = member[p.member_field];
    }
  }

  let vefify = _validateKYCProperties(properties, dataMember);
  if (vefify.error) {
    return member;
  }
  let memberKyc = await MemberKyc.create({
    member_id: member.id,
    kyc_id: kyc.id,
    status: kyc.auto_approve_flg ? KycStatus.APPROVED : KycStatus.IN_REVIEW,
  }, { transaction: transaction });

  let data = [];
  for (let p of properties) {
    let value = p.member_field ? member[p.member_field] : member[p.field_key];
    data.push({
      member_kyc_id: memberKyc.id,
      property_id: p.id,
      field_name: p.field_name,
      field_key: p.field_key,
      value: value
    });
  }
  await MemberKycProperty.bulkCreate(data, { transaction: transaction });
  if (kyc.approve_membership_type_id && !member.membership_type_id) {
    member.membership_type_id = kyc.approve_membership_type_id;
  }
  member.kyc_id = kyc.id.toString();
  member.kyc_level = kyc.key;
  member.kyc_status = memberKyc.status;
  return member;
}

function _validateKYCProperties(properties, data) {
  let obj = {};
  for (let p of properties) {
    obj[p.field_key] = _buildJoiFieldValidate(p);
  }

  let schema = Joi.object().keys(obj);
  return Joi.validate(data, schema);
}

function _buildJoiFieldValidate(p) {
  let result;
  switch (p.data_type) {
    case KycDataType.TEXT:
    case KycDataType.PASSWORD: {
      result = Joi.string();
      if (!p.require_flg) {
        result = result.allow("")
      }
      break;
    }
    case KycDataType.EMAIL: {
      result = Joi.string().email({
        minDomainAtoms: 2
      });
      break;
    }
    case KycDataType.UPLOAD: {
      result = Joi.any();
      break;
    }
    case KycDataType.DATETIME: {
      result = Joi.date();
      break;
    }
    default:
      {
        result = Joi.string();
        if (!p.require_flg) {
          result = result.allow("")
        }
        break;
      }
  }

  if (p.require_flg) {
    result = result.required()
  }
  else {
    result = result.optional()
  }

  return result;
}

async function _getInfinitoUser() {
  var sql = `
  SELECT *
  FROM sso_users
  WHERE sync_flg is null or sync_flg = false`;
  var rs = await database.query(sql, { type: database.QueryTypes.SELECT });
  return rs;
}

async function _sync(id) {
  var sql = `update sso_users set sync_flg  = true where id ='${id}'`;
  var rs = await database.query(sql, { type: database.QueryTypes.BULKUPDATE });
  return rs;
}