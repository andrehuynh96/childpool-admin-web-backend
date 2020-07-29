const Joi = require('joi');

const schema = Joi.object().keys({
  txid: Joi.string().min(10).max(200).required()
});

module.exports = schema;