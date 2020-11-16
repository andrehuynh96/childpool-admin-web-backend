const Joi = require('joi');

const exchangePointSchema = Joi.object().keys({
  id: Joi.string().required(),
  points: Joi.number().min(1).required(),
});

const schema = Joi.object().keys({
  ms_point_exchange_is_enabled: Joi.boolean().required(),
  ms_point_exchange_mininum_value_in_usdt: Joi.number().min(1).required(),
  membership_types: Joi.array().required().items(exchangePointSchema),
});

module.exports = schema;
