const Joi = require('joi');

const schema = Joi.object().keys({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  email: Joi.string().allow('').allow(null).optional(),
  status: Joi.string().allow('').allow(null).optional(),
  action: Joi.string().allow('').allow(null).optional(),
  from_date: Joi.date().iso().allow('').allow(null).optional(),
  to_date: Joi.date().iso().allow('').allow(null).optional(),
});

module.exports = schema;
