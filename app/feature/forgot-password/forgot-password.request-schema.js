const Joi = require('joi');

const schema = Joi.object().keys({
  'g-recaptcha-response': Joi.string().optional(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
});

module.exports = schema;