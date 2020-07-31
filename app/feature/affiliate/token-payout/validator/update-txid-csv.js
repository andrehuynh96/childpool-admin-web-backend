const Joi = require('joi');

const schema = Joi.object().keys({
  tokenPayoutTxid: Joi.any().required()
});

module.exports = schema;