const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().max(128).required(),
  icon: Joi.string().max(256).required(),
  description: Joi.string().max(1000).allow('').allow(null).optional(),
  order_index: Joi.number().integer().allow(null).optional(),
  default_flg: Joi.boolean().required(),
  status: Joi.number().integer().required(),
  network: Joi.string().max(100).required(),
  explore_url: Joi.string().max(500).allow('').allow(null).optional(),
  transaction_format_link: Joi.string().max(500).allow('').allow(null).optional(),
  address_format_link: Joi.string().max(500).allow('').allow(null).optional(),
});

module.exports = schema;
