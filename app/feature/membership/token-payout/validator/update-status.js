const Joi = require('joi');

const schema = Joi.object().keys({
  token_payout_ids: Joi.array().required()
});

module.exports = schema;