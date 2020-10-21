const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].type': '[].type',
    '[].message': '[].message',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    type: 'type',
    message: 'message',
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
