const Joi = require('joi');

const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  keyword: Joi.string().allow('').allow(null).max(100).optional(),
  type: Joi.string().allow('').allow(null).max(100).optional(),
  from_date: Joi.date().iso().allow('').allow(null).optional(),
  to_date: Joi.date().iso().allow('').allow(null).optional(),
  wallet_address: Joi.string().allow('').allow(null).max(500).optional(),
});

module.exports = schema;
