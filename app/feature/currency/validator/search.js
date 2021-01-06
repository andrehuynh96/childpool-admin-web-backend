const Joi = require('joi');

const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  name: Joi.string().allow('').allow(null).max(100).optional(),
  platform: Joi.string().allow('').allow(null).max(100).optional(),
  symbol: Joi.string().allow('').allow(null).max(100).optional(),
  status: Joi.number().integer().allow(null).allow('').optional(),
  mobile_ios_status: Joi.number().integer().allow(null).allow('').optional(),
  mobile_android_status: Joi.number().integer().allow(null).allow('').optional(),
});

module.exports = schema;
