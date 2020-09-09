const Joi = require('joi');

const schema = Joi.object().keys({
  symbol: Joi.string().max(128).required(),
  platform: Joi.string().max(128).required(),
  name: Joi.string().max(128).required(),
  icon: Joi.string().max(256).required(),
  decimals: Joi.number().integer().optional(),
  description: Joi.string().max(1000).allow('').allow(null).optional(),
  contract_address: Joi.string().max(256).allow('').allow(null).optional(),
  order_index: Joi.number().integer().optional(),
  status: Joi.number().integer().required(),
  from_flg: Joi.boolean().required(),
  to_flg: Joi.boolean().required(),
  fix_rate_flg: Joi.boolean().required(),
});

module.exports = schema;
