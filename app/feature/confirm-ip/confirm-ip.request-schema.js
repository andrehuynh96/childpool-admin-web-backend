const Joi = require('joi');

const schema = Joi.object().keys({
  verify_token: Joi.string().required()
});

module.exports = schema;