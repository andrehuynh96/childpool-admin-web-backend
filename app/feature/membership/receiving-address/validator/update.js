const Joi = require('joi');

const schema = Joi.object().keys({
  description: Joi.string().max(1000).allow('').allow(null).optional()
});

module.exports = schema; 