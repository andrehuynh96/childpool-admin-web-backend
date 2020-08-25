const Joi = require('joi');

const schema = Joi.object().keys({
  content: Joi.string().required(),
  ja_content: Joi.string().allow("").allow(null).optional(),
  is_published: Joi.boolean().required(),
  applied_date: Joi.string().allow("").allow(null).optional()
});

module.exports = schema;