const Joi = require('joi');

const schema = Joi.object().keys({
  'g-recaptcha-response': Joi.string(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()-_=+]{6,30}$/)
    .required(),
  new_password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()-_=+]{6,30}$/)
    .required(),
});

module.exports = schema;