const Joi = require('joi');

const schema = Joi.object().keys({
  content: Joi.string().required(),
  is_published: Joi.boolean().required(),
  applied_date: Joi.string().optional()
});

module.exports = schema;