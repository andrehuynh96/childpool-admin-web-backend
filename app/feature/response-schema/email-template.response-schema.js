const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].subject': '[].subject',
    '[].language': '[].language',
    '[].group_name': '[].group_name',
    '[].deleted_flg': '[].deleted_flg',
  },
  single: {
    id: 'id',
    name: 'name',
    subject: 'subject',
    language: 'language',
    group_name: 'group_name',
    deleted_flg: 'deleted_flg'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return [];
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};  