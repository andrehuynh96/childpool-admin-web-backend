const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  partner_type: Joi.string().valid("CHILD", "AFFILIATE").required()
});

module.exports = schema;