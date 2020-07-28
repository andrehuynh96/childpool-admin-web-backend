const Joi = require('joi');

const schema = Joi.object().keys({
  claimRequestTxid: Joi.any().required()
});

module.exports = schema;