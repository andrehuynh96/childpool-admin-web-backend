const Joi = require('joi');

const schema = Joi.object().keys({
  claim_affiliate_reward_atom: Joi.number().min(0).optional(),
  claim_affiliate_reward_iris: Joi.number().min(0).optional(),
  claim_affiliate_reward_ong: Joi.number().min(0).optional(),
  claim_affiliate_reward_one: Joi.number().min(0).optional(),
  claim_affiliate_reward_xtz: Joi.number().min(0).optional(),

  claim_affiliate_reward_atom_network_fee: Joi.number().min(0).optional(),
  claim_affiliate_reward_iris_network_fee: Joi.number().min(0).optional(),
  claim_affiliate_reward_ong_network_fee: Joi.number().min(0).optional(),
  claim_affiliate_reward_one_network_fee: Joi.number().min(0).optional(),
  claim_affiliate_reward_xtz_network_fee: Joi.number().min(0).optional(),
});

module.exports = schema;