const Joi = require('joi');

const schema = Joi.object().keys({
  emails: Joi.string().max(1000).required(),
  size: Joi.number().required(),
});

module.exports = schema;
