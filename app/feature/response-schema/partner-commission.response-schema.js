const objectMapper = require('object-mapper');

const destObject = {
  single: {
    id: 'id',
    platform: 'platform',
    commission: 'commission',
    reward_address: 'reward_address',
    updated_by: 'updated_by',
    updatedAt: 'updated_at',
    updated_by_user_name: 'updated_by_user_name'
  },
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].commission': '[].commission',
    '[].reward_address': '[].reward_address',
    '[].updated_by': '[].updated_by',
    '[].updatedAt': '[].updated_at',
    '[].updated_by_user_name': '[].updated_by_user_name'
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 