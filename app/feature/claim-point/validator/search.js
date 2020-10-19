const Joi = require('joi');

const schema = Joi.object().keys({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  email: Joi.string().allow('').allow(null).optional(),
});

module.exports = schema;
