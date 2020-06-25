const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].Member.email': '[].email',
    '[].member_id': '[].member_id',
    '[].member_account_id': '[].member_account_id',
    '[].type': '[].type',
    '[].status': '[].status',
    '[].amount': '[].amount',
    '[].currency_symbol': '[].currency_symbol',
    '[].createdAt': '[].created_at',
  },
  single: {
    id: 'id',
    Member: 'member',
    member_id: 'member_id',
    member_account_id: 'member_account_id',
    type: 'type',
    status: 'status',
    amount: 'amount',
    membership_type: 'membership_type',
    txid: 'txid',
    explorer_link: 'explorer_link',
    currency_symbol: 'currency_symbol',
    createdAt: 'created_at',
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