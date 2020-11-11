const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].symbol': '[].symbol',
    '[].name': '[].name',
    '[].currency_symbol': '[].currency_symbol',
    '[].full_name': '[].full_name',
    '[].icon': '[].icon',
    '[].sc_token_address': '[].sc_token_address',
    '[].decimals': '[].decimals',
    '[].platform': '[].platform',
    '[].description': '[].description',
    '[].type': '[].type',
    '[].order_index': '[].order_index',
    '[].status': '[].status',
    '[].mobile_status': '[].mobile_status',
    '[].default_flg': '[].default_flg',
    '[].explore_url': '[].explore_url',
    '[].transaction_format_link': '[].transaction_format_link',
    '[].address_format_link': '[].address_format_link',
    '[].web_site_url': '[].web_site_url',
    '[].created_at': '[].created_at'
  },
  single: {
    id: '[].id',
    symbol: '[].symbol',
    currency_symbol: '[].currency_symbol',
    name: '[].name',
    full_name: '[].full_name',
    icon: '[].icon',
    sc_token_address: '[].sc_token_address',
    decimals: '[].decimals',
    platform: '[].platform',
    description: '[].description',
    type: '[].type',
    order_index: '[].order_index',
    status: '[].status',
    mobile_status: '[].mobile_status',
    default_flg: '[].default_flg',
    explore_url: '[]explore_url',
    transaction_format_link: '[].transaction_format_link',
    address_format_link: '[].address_format_link',
    web_site_url: '[]web_site_url',
    created_at: '[].created_at'
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
