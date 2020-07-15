const Joi = require('joi');

const schema = Joi.object().keys({
  token_payout_ids: Joi.array().items(Joi.number().required()).required()
});

module.exports = schema;