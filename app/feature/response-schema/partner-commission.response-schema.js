const objectMapper = require('object-mapper');

const destObject = {
  single: {
    id: 'id',
    platform: 'platform',
    commission: 'commission',
    reward_address: 'reward_address',
    staking_platform_id: 'staking_platform_id',
    updated_by: 'updated_by',
    updatedAt: 'updated_at',
    updated_by_user_name: 'updated_by_user_name',
    // partner_updated_by: 'partner_updated_by'
  },
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].commission': '[].commission',
    '[].reward_address': '[].reward_address',
    '[].staking_platform_id': '[].staking_platform_id',
    '[].updated_by': '[].updated_by',
    '[].updatedAt': '[].updated_at',
    '[].updated_by_user_name': '[].updated_by_user_name',
    // '[].partner_updated_by': '[].partner_updated_by'
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 