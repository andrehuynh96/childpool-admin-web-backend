const Joi = require('joi');

const schema = Joi.object().keys({
  email_templates: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().max(256).required(),
      subject: Joi.string().max(1000).required(),
      template: Joi.string().required(),
      language: Joi.string().max(20).required()
    }
    ).required()
  ).required()
});

module.exports = schema;