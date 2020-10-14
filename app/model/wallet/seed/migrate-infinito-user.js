const Member = require('app/model/wallet').members;
const MemberSetting = require('app/model/wallet').member_settings;
const MemberKyc = require('app/model/wallet').member_kycs;
const MemberKycProperty = require('app/model/wallet').member_kyc_properties;
const db = require("app/model/wallet");
const logger = require('app/lib/logger');

module.exports = async () => {
  try {
    let result = await _getInfinitoUser();
    if (result && result.length > 0) {

    }
  }
  catch (err) {
    logger.error(`sync Infinito User:: `, err)
  }
};

async function _getInfinitoUser() {
  var sql = `
  SELECT *
  FROM sso_users
  WHERE sync_flg is null or sync_flg = false`;
  var rs = await db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT });
  return rs;
}