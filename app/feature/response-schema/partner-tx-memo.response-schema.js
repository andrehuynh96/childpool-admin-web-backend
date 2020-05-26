const objectMapper = require('object-mapper');

const destObject = {
  id: 'id',
  platform: 'platform',
  memo: 'memo',
  default_flg: 'default_flg',
  created_by: 'updated_by',
  updated_at: 'updated_at'
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject);
};
