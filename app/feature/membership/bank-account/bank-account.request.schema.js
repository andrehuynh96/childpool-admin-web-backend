const Joi = require('joi');

const schema = Joi.object().keys({
  bank_name: Joi.string().required(),
  swift: Joi.string().required(),
  account_name: Joi.string().required(),
  account_number: Joi.string().required()
});

module.exports = schema;