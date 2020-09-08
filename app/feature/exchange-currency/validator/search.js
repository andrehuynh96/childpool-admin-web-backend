const Joi = require('joi');

const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  name: Joi.string().allow('').allow(null).max(100).optional(),
  platform: Joi.string().allow('').allow(null).max(100).optional(),
});

module.exports = schema;
