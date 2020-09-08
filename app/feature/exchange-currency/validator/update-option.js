const Joi = require('joi');

const schema = Joi.object().keys({
  option_name: Joi.string().max(256).required(),
  display_order: Joi.number().allow(null).optional(),
  email_templates: Joi.array().items(
    Joi.object().keys({
      subject: Joi.string().max(1000).required(),
      template: Joi.string().required(),
      language: Joi.string().max(20).required()
    }
    ).required()
  ).required()
});

module.exports = schema;
