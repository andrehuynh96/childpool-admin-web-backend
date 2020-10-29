const Joi = require('joi');

const stakingPointSchema = Joi.object().keys({
  id: Joi.string().required(),
  points: Joi.number().min(1).required(),
});

const schema = Joi.object().keys({
  ms_point_staking_is_enabled: Joi.boolean().required(),
  membership_types: Joi.array().required().items(stakingPointSchema),
});

module.exports = schema;
