const Joi = require('joi');
const Platform = require("app/model/wallet/value-object/platform");

const schema = Joi.object().keys({
  platform: Joi.string().valid(Object.keys(Platform)).required(),
  address: Joi.string().required()
});

module.exports = schema; 