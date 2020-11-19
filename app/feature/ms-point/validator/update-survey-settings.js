const Joi = require('joi');

const schema = Joi.object().keys({
  ms_point_survey_is_enabled: Joi.boolean().required(),
});

module.exports = schema;
