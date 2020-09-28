const Joi = require('joi');

const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  keyword: Joi.string().allow('').allow(null).max(100).optional(),
  type: Joi.string().allow('').allow(null).max(100).optional(),
  event: Joi.string().allow('').allow(null).max(100).optional(),
});

module.exports = schema;
