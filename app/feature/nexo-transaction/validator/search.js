const Joi = require('joi');

const schema = Joi.object().keys({
  offset: Joi.number().min(0).optional(),
  limit: Joi.number().greater(0).optional(),
  type: Joi.string().allow('').allow(null).optional(),
  status: Joi.string().allow('').allow(null).optional(),
  tx_id: Joi.string().allow('').allow(null).optional(),
  address: Joi.string().allow(null).allow('').optional(),
  email: Joi.string().allow(null).allow('').optional(),
  from_date: Joi.date().allow('').allow(null).optional(),
  to_date: Joi.date().allow('').allow(null).optional(),
});

module.exports = schema;
