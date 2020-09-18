const Joi = require('joi');

const schema = Joi.object().keys({
  payoutTransferred: Joi.date().required()
});

module.exports = schema;
