const Joi = require('joi');

const schema = Joi.object().keys({
  txid: Joi.string().max(256).required()
});

module.exports = schema;