const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  platform: 'platform',
  commission: 'commission',
  reward_address: 'reward_address',
  updated_by: 'updated_by',
  updatedAt: 'updated_at'
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};
