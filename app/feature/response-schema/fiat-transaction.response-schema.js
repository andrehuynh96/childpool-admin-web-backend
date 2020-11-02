const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].member_id': '[].member_id',
    '[].Member.email': '[].email?',
    '[].from_currency': '[].from_currency',
    '[].to_cryptocurrency': '[].to_cryptocurrency',
    '[].payment_method': '[].payment_method',
    '[].payment_method_name': '[].payment_method_name',
    '[].transaction_id': '[].transaction_id',
    '[].from_amount': '[].from_amount',
    '[].to_amount': '[].to_amount',
    '[].status': '[].status',
    '[].provider': '[].provider',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    member_id: 'member_id',
    '[].Member.email': 'email',
    from_currency: 'from_currency',
    to_cryptocurrency: 'to_cryptocurrency',
    payment_method: 'payment_method',
    payment_method_name: 'payment_method_name',
    transaction_id: 'transaction_id',
    from_amount: 'from_amount',
    to_amount: 'to_amount',
    status: 'status',
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
    srcObject.forEach(item => {
      if (!item.Member) {
        item.Member = {
          email: ''
        };
      }
    });
    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};
