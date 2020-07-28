const Joi = require('joi');

const schema = Joi.object().keys({
  bank_name: Joi.string().required(),
  branch_name: Joi.string().required(),
  account_name: Joi.string().required(),
  account_number: Joi.string().required(),
  currency_symbol: Joi.string().required(),
  account_type: Joi.string().required(),
  memo: Joi.string().max(1000).allow('').allow(null).optional(),
});

module.exports = schema;