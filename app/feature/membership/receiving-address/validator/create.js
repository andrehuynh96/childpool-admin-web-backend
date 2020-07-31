const Joi = require('joi');

const schema = Joi.object().keys({
  platform: Joi.string().valid(['ETH','BTC','USDT']).required(),
  address: Joi.string().required(),
  description: Joi.string().max(1000).allow('').allow(null).optional()
});

module.exports = schema; 