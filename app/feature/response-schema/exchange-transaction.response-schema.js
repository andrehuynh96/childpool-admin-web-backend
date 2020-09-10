const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].member_id': '[].member_id',
    '[].Member.email': '[].email',
    '[].from_currency': '[].from_currency',
    '[].to_currency': '[].to_currency',
    '[].request_recipient_address': '[].request_recipient_address',
    '[].request_amount': '[].request_amount',
    '[].transaction_id': '[].transaction_id',
    '[].amount_expected_from': '[].amount_expected_from',
    '[].amount_expected_to': '[].amount_expected_to',
    '[].amount_to': '[].amount_to',
    '[].status': '[].status',
    '[].transaction_date': '[].transaction_date',
    '[].provider': '[].provider',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    member_id: 'member_id',
    '[].Member.email': 'email',
    from_currency: 'from_currency',
    to_currency: 'to_currency',
    request_recipient_address: 'request_recipient_address',
    request_amount: 'request_amount',
    transaction_id: 'transaction_id',
    amount_expected_from: 'amount_expected_from',
    amount_expected_to: 'amount_expected_to',
    amount_to: 'amount_to',
    status: 'status',
    transaction_date: 'transaction_date',
    provider: 'provider',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (!srcObject || srcObject.length === 0) {
      return [];
    }

    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};
