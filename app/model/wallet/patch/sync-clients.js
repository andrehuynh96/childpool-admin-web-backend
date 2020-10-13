const config = require('app/config');
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const { membershipApi } = require('app/lib/affiliate-api');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

  const members = await Member.findAll({
    attributes: ['email','membership_type_id','referrer_code'],
    where: {
      membership_type_id: { [Op.in]: [membershipTypeCache.Gold,membershipTypeCache.Platinum ] }
    }
  });

  for (let item of members) {
    await membershipApi.updateMembershipType(item, { id: item.membership_type_id });
  }

};

