const Joi = require('joi');

const schema = Joi.object().keys({
  payoutTransferred: Joi.string().min(10).max(40).required()
});

module.exports = schema;
