const Joi = require('joi');

const schema = Joi.object().keys({
  membership_commission_usdt_minimum_claim_amount: Joi.number().greater(0).required(),
});

module.exports = schema;