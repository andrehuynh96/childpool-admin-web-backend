const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].name': '[].name',
    '[].first_name': '[].first_name',
    '[].last_name': '[].last_name',
    '[].actived_flg': '[].actived_flg',
    '[].referral_code': '[].referral_code',
    '[].referrer_code': '[].referrer_code',
    '[].membership_type_id': '[].membership_type_id',
    '[].membership_type': '[].membership_type',
    '[].status': '[].status',
    '[].kyc_id': '[].kyc_id',
    '[].kyc_level': '[].kyc_level',
    '[].kyc_status': '[].kyc_status',
    '[].plutx_userid_id': '[].plutx_userid_id',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    email: 'email',
    name: 'name',
    first_name: 'first_name',
    last_name: 'last_name',
    actived_flg: 'actived_flg',
    referral_code: 'referral_code',
    referrer_code: 'referrer_code',
    membership_type_id: 'membership_type_id',
    membership_type: 'membership_type',
    stasus: 'status',
    kyc_id: 'kyc_id',
    kyc_level: 'kyc_level',
    kyc_status: 'kyc_status',
    plutx_userid_id: 'plutx_userid_id',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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