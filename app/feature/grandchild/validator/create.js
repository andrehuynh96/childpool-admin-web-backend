const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  name: Joi.string().required(),
  partner_type: Joi.string().valid("CHILD", "AFFILIATE").required()
});

module.exports = schema;