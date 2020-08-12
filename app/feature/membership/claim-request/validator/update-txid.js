const Joi = require('joi');

const schema = Joi.object().keys({
  txid: Joi.string().max(500).required(),
});

module.exports = schema;