const Joi = require('joi');

const schema = Joi.object().keys({
  subject: Joi.string().max(1000).required(),
  template: Joi.string().required(),
});

module.exports = schema;