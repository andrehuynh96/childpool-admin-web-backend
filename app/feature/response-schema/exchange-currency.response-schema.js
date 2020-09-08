const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].symbol': '[].symbol',
    '[].platform': '[].platform',
    '[].name': '[].name',
    '[].icon': '[].icon',
    '[].decimals': '[].decimals',
    '[].description': '[].description',
    '[].contract_address': '[].contract_address',
    '[].order_index': '[].order_index',
    '[].status': '[].status',
    '[].from_flg': '[].from_flg',
    '[].to_flg': '[].to_flg',
    '[].fix_rate_flg': '[].fix_rate_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    symbol: 'symbol',
    platform: 'platform',
    name: 'name',
    icon: 'icon',
    decimals: 'decimals',
    description: 'description',
    contract_address: 'contract_address',
    order_index: 'order_index',
    status: 'status',
    from_flg: 'from_flg',
    to_flg: 'to_flg',
    fix_rate_flg: 'fix_rate_flg',
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
