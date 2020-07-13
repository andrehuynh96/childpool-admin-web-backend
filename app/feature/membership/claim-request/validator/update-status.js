const Joi = require('joi');

const schema = Joi.object().keys({
  claimRequestIds: Joi.array().required()
});

module.exports = schema;