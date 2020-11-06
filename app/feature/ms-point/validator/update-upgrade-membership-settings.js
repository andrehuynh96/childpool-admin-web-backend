const Joi = require('joi');

const upgradeMembershipPointsSchema = Joi.object().keys({
  id: Joi.string().required(),
  points: Joi.number().min(1).required(),
});

const schema = Joi.object().keys({
  ms_point_upgrading_membership_is_enabled: Joi.boolean().required(),
  membership_types: Joi.array().required().items(upgradeMembershipPointsSchema),
});

module.exports = schema;
