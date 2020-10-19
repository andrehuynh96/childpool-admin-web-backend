const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].Member': '[].member',
    '[].member_id': '[].member_id',
    '[].status': '[].status',
    '[].amount': '[].amount',
    '[].currency_symbol': '[].currency_symbol',
    '[].system_type': '[].system_type',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    Member: 'member',
    member_id: 'member_id',
    type: 'type',
    status: 'status',
    amount: 'amount',
    system_type: 'system_type',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return srcObject.length ? objectMapper(srcObject, destObject.array) : [];
  }

  return objectMapper(srcObject, destObject.single);
};
