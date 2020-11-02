const Joi = require('joi');

const schema = Joi.object().keys({
  ms_point_mode: Joi.string().max(100).required(),
});

module.exports = schema;
