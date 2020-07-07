const Joi = require('joi');

const schema = Joi.object().keys({
  usd_rate_by_jpy: Joi.number().greater(0).required(),
  usd_rate_by_jpy_updated_at: Joi.string().max(50).required(),
});

module.exports = schema;