const Joi = require('joi');

const schema = Joi.object().keys({
  status: Joi.number().required(),
  token: Joi.string().required()
});

module.exports = schema;