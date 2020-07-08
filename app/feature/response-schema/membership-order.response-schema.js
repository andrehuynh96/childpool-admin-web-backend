const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].member_id': '[].member_id',
    '[].membership_type_id': '[].membership_type_id',
    '[].payment_type': '[].payment_type',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].account_number': '[].account_number',
    '[].bank_name': '[].bank_name',
    '[].swift': '[].swift',
    '[].account_holder': '[].account_holder',
    '[].payment_ref_code': '[].payment_ref_code',
    '[].memo': '[].memo',
    '[].wallet_address': '[].wallet_address',
    '[].txid': '[].txid',
    '[].explorer_link': '[].explorer_link',
    '[].rate_usd': '[].rate_usd',
    '[].status': '[].status',
    '[].order_no': '[].order_no',
    '[].notes': '[].notes',
    '[].approved_by_id': '[].approved_by_id',
    '[].Member': '[].member',
    '[].MembershipType':'[].membership_type',
    '[].wallet_id': '[].wallet_id',
    '[].branch_name': '[].branch_name',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    'id': 'id',
    'member_id': 'member_id',
    'membership_type_id': 'membership_type_id',
    'payment_type': 'payment_type',
    'currency_symbol': 'currency_symbol',
    'amount': 'amount',
    'account_number': 'account_number',
    'bank_name': 'bank_name',
    'swift': 'swift',
    'account_holder': 'account_holder',
    'payment_ref_code': 'payment_ref_code',
    'memo': 'memo',
    'wallet_address': 'wallet_address',
    'txid': 'txid',
    'explorer_link': 'explorer_link',
    'rate_usd': 'rate_usd',
    'status': 'status',
    'order_no': 'order_no',
    'notes': 'notes',
    'approved_by_id': 'approved_by_id',
    'Member': 'member',
    'MembershipType':'membership_type',
    'wallet_id': 'wallet_id',
    'branch_name': 'branch_name',
    'your_wallet_address': 'your_wallet_address',
    'Wallet':'wallet',
    'ReceivingAddress': 'receiving_address',
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