const Joi = require('joi');

const schema = Joi.object().keys({
  twofa_secret: Joi.string().optional().allow(""),
  twofa_code: Joi.string().required(),
  disable: Joi.boolean()
});

module.exports = schema;