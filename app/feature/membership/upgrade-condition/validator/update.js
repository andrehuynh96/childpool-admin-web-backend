const Joi = require('joi');

const schema = Joi.object().keys({
  allow_upgrade_flg: Joi.boolean().optional(),
  num_of_paid_members: Joi.number().integer().optional(),
  num_of_free_members: Joi.number().integer().optional(),
  staking_amount: Joi.number().optional(),
  staking_amount_currency_symbol: Joi.string().optional(),
  staking_reward: Joi.number().optional(),
  staking_reward_currency_symbol: Joi.string().optional()
});

module.exports = schema;