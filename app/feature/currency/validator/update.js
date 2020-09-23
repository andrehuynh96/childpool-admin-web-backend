const Joi = require('joi');

const schema = Joi.object().keys({
  symbol: Joi.string().max(128).required(),
  platform: Joi.string().max(128).required(),
  name: Joi.string().max(128).required(),
  icon: Joi.string().max(256).required(),
  decimals: Joi.number().integer().allow(null).optional(),
  description: Joi.string().max(1000).allow('').allow(null).optional(),
  sc_token_address: Joi.string().max(256).allow('').allow(null).optional(),
  order_index: Joi.number().integer().allow(null).optional(),
  default_flg: Joi.boolean().required(),
  status: Joi.number().integer().required(),
  explore_url: Joi.string().max(500).allow('').allow(null).optional(),
  transaction_format_link: Joi.string().max(500).allow('').allow(null).optional(),
  address_format_link: Joi.string().max(500).allow('').allow(null).optional(),
});

module.exports = schema;
