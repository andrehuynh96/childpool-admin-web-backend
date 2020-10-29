const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].price': '[].price',
    '[].currency_symbol': '[].currency_symbol',
    '[].type': '[].type',
    '[].is_enabled': '[].is_enabled',
    '[].display_order': '[].display_order?',
    '[].claim_points': '[].claim_points?',
    '[].staking_points': '[].staking_points?',
    '[].upgrade_membership_points': '[].upgrade_membership_points?',
    '[].exchange_points': '[].exchange_points?',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    name: 'name',
    price: 'price',
    currency_symbol: 'currency_symbol',
    type: 'type',
    is_enabled: 'is_enabled',
    display_order: 'display_order?',
    claim_points: 'claim_points?',
    staking_points: 'staking_points?',
    upgrade_membership_points: 'upgrade_membership_points?',
    exchange_points: 'exchange_points?',
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
