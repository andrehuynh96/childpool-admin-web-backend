const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].code': '[].code',
    '[].name': '[].name',
    '[].display_name': '[].display_name?',
    '[].order_index': '[].order_index',
    '[].actived_flg': '[].actived_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    code: 'code',
    name: 'name',
    display_name: 'display_name?',
    order_index: 'order_index',
    actived_flg: 'actived_flg',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return srcObject.length ? objectMapper(srcObject, destObject.array) : [];
  }

  return objectMapper(srcObject, destObject.single);
};
