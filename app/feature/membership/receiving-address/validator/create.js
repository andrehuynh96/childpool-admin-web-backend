const Joi = require('joi');

const schema = Joi.object().keys({
  platform: Joi.string().valid(['ETH','BTC','USDT']).required(),
  address: Joi.string().required()
});

module.exports = schema; 