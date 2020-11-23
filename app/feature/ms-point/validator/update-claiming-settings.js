const Joi = require('joi');

const claimPointSchema = Joi.object().keys({
  id: Joi.string().required(),
  points: Joi.number().min(1).required(),
});

const schema = Joi.object().keys({
  ms_point_claiming_is_enabled: Joi.boolean().required(),
  ms_point_delay_time_in_seconds: Joi.number().min(1).required(),
  ms_point_delay_time_duration: Joi.string().max(100).required(),
  membership_types: Joi.array().required().items(claimPointSchema),
});

module.exports = schema;
