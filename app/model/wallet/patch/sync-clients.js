const config = require('app/config');
const Member = require("app/model/wallet").members;
const database = require('app/lib/database').db().wallet;
const MembershipType = require("app/model/wallet").membership_types;
const { membershipApi } = require('app/lib/affiliate-api');

module.exports = async() => {
  if (!config.patchData.patchIsEnabledSyncClients) {
    return;
  }
  const membershipTypes = await MembershipType.findAll({
    where: {
      is_enabled: true,
      deleted_flg: false
    },
  });
  const membershipTypeCache = membershipTypes.reduce((result,value) => {
    result[value.name] = value.id;
    return result;
  },{});

  const platinumMember = await Member.findAll({
    attributes: ['email','membership_type_id','referrer_code'],
    where: {
      membership_type_id: membershipTypeCache.Platinum
    }
  });

  for (let item of platinumMember) {
    await membershipApi.updateMembershipType(item, { id: membershipTypeCache.Platinum });
  }

  const goldMember = await Member.findAll({
    attributes: ['email','membership_type_id','referrer_code'],
    where: {
      membership_type_id: membershipTypeCache.Gold
    }
  });

  for (let item of goldMember) {
    await membershipApi.updateMembershipType(item, { id: membershipTypeCache.Gold });
  }

};

