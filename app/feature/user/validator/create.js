const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  name: Joi.string().required(),
  role_id: Joi.number().required(),
  country_code: Joi.string().allow(null).max(100).optional(),
});

module.exports = schema;
