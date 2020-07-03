const Joi = require('joi');

const schema = Joi.object().keys({
  usd_rate_by_jpy: Joi.number().greater(0).required(),
  membership_comission_usdt_minimum_claim_amount: Joi.number().greater(0).required(),
});

module.exports = schema;