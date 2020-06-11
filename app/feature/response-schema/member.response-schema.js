const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].fullname': '[].fullname',
    '[].actived_flg': '[].actived_flg',
    '[].referral_code': '[].referral_code',
    '[].referrer_code': '[].referrer_code',
    '[].membership_type_id': '[].membership_type_id',
    '[].membership_type': '[].membership_type',
    '[].kyc_id': '[].kyc_id',
    '[].kyc_level': '[].kyc_level',
    '[].kyc_status': '[].kyc_status',
    '[].deleted_flg': '[].deleted_flg',
    '[].plutx_userid_id': '[].plutx_userid_id',
    '[].created_at': '[].created_at',
    '[].updated_at': '[].updated_at',
  },
  single: {
    id: 'id',
    email: 'email',
    fullname: 'fullname',
    actived_flg: 'actived_flg',
    referral_code: 'referral_code',
    referrer_code: 'referrer_code',
    membership_type_id: 'membership_type_id',
    membership_type: 'membership_type',
    kyc_id: 'kyc_id',
    kyc_level: 'kyc_level',
    kyc_status: 'kyc_status',
    deleted_flg: 'deleted_flg',
    plutx_userid_id: 'plutx_userid_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
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