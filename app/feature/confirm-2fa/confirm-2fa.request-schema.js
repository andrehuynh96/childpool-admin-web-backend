const Joi = require('joi');

const schema = Joi.object().keys({
  verify_token: Joi.string().required(),
  twofa_code: Joi.string().required()
});

module.exports = schema;