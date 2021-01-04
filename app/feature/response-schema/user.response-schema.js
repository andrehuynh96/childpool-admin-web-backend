const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].name': '[].name',
    '[].user_roles[].role.name': '[].role',
    '[].twofa_enable_flg': '[].twofa_enable_flg',
    '[].created_at': '[].created_at',
    '[].user_sts': '[].user_sts',
    '[].country_code': '[].country_code?',
    '[].country': '[].country?',
    '[].latest_login_at': '[].latest_login_at',
  },
  single: {
    id: 'id',
    email: 'email',
    name: 'name',
    'user_roles[].role.name': 'role',
    twofa_enable_flg: 'twofa_enable_flg',
    created_at: 'created_at',
    user_sts: 'user_sts',
    country_code: 'country_code?',
    country: 'country?',
    latest_login_at: 'latest_login_at',
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
