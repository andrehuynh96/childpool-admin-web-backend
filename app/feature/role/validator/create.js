const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  level: Joi.number().required(),
  permission_ids: Joi.array().required()
});

module.exports = schema;