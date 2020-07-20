const Joi = require('joi');

const schema = Joi.object().keys({
  claim_affiliate_reward_atom: Joi.number().optional(),
  claim_affiliate_reward_iris: Joi.number().optional(),
  claim_affiliate_reward_ong: Joi.number().optional()
});

module.exports = schema;