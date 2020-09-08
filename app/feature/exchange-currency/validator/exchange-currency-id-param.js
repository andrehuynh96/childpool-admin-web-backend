const Joi = require('joi');

const schema = Joi.object().keys({
  exchangeCurrencyId: Joi.number().required(),
});

module.exports = schema;
