const Joi = require('joi');

const schema = Joi.object().keys({
  is_enabled: Joi.boolean().required(),
  emails: Joi.string().max(1000).required(),
  size: Joi.number().required(),
});

module.exports = schema;
