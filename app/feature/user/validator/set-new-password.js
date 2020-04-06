const Joi = require('joi');

const schema = Joi.object().keys({
  verify_token: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()-_=+]{6,30}$/)
    .required(),
});

module.exports = schema;