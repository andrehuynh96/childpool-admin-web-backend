const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',  
    '[].symbol': '[].symbol',
    '[].name': '[].name',
    '[].icon': '[].icon',
    '[].sc_token_address': '[].sc_token_address',
    '[].decimals': '[].decimals',
    '[].platform': '[].platform',
    '[].description': '[].description',
    '[].type': '[].type',
    '[].order_index': '[].order_index',
    '[].status': '[].status',
    '[].default_flg': '[].default_flg',
    '[].created_at': '[].created_at'
  },
  single: {
    'id': 'id',  
    'symbol': 'symbol',
    'name': '[].name',
    'icon': '[].icon',
    'sc_token_address': '[].sc_token_address',
    'decimals': '[].decimals',
    'platform': '[].platform',
    'description': '[].description',
    'type': '[].type',
    'order_index': '[].order_index',
    'status': '[].status',
    'default_flg': '[].default_flg',
    'created_at': '[].created_at'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return [];
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};  