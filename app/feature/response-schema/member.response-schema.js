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
    '[].max_references': '[].max_references?',
    '[].membership_type_id': '[].membership_type_id',
    '[].membership_type': '[].membership_type',
    '[].latest_membership_order_id': '[].latest_membership_order_id?',
    '[].status': '[].status',
    '[].kyc_id': '[].kyc_id',
    '[].kyc_level': '[].kyc_level',
    '[].kyc_status': '[].kyc_status',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
    '[].twofa_enable_flg': '[].twofa_enable_flg',
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
    max_references: 'max_references?',
    membership_type_id: 'membership_type_id',
    membership_type: 'membership_type',
    latest_membership_order_id: 'latest_membership_order_id?',
    status: 'status',
    kyc_id: 'kyc_id',
    kyc_level: 'kyc_level',
    kyc_status: 'kyc_status',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    twofa_enable_flg: 'twofa_enable_flg',
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
