const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].member_id': '[].member_id',
    '[].member_account_id': '[].member_account_id',
    '[].membership_type_id': '[].membership_type_id',
    '[].payment_type': '[].payment_type',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].account_number': '[].account_number',
    '[].bank_name': '[].bank_name',
    '[].bracnch_name': '[].branch_name',
    '[].account_holder': '[].account_holder',
    '[].payment_ref_code': '[].payment_ref_code',
    '[].memo': '[].memo',
    '[].wallet_address': '[].wallet_address',
    '[].txid': '[].txid',
    '[].rate_by_usdt': '[].rate_by_usdt',
    '[].status': '[].status',
    '[].notes': '[].notes',
    '[].approved_by_id': '[].approved_by_id',
    '[].Member': '[].Member',
    '[].MembershipType':'[].MembershipType',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    'id': 'id',
    'member_id': 'member_id',
    'member_account_id': 'member_account_id',
    'membership_type_id': 'membership_type_id',
    'payment_type': 'payment_type',
    'currency_symbol': 'currency_symbol',
    'amount': 'amount',
    'account_number': 'account_number',
    'bank_name': 'bank_name',
    'bracnch_name': 'branch_name',
    'account_holder': 'account_holder',
    'payment_ref_code': 'payment_ref_code',
    'memo': 'memo',
    'wallet_address': 'wallet_address',
    'txid': 'txid',
    'rate_by_usdt': 'rate_by_usdt',
    'status': 'status',
    'notes': 'notes',
    'approved_by_id': 'approved_by_id',
    'Member': 'Member',
    'MembershipType':'MembershipType',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at',
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