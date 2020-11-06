const Joi = require('joi');

const schema = Joi.object().keys({
  loggingId: Joi.number().required(),
});

module.exports = schema;
