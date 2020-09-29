const Joi = require('joi');

const schema = Joi.object().keys({
  isActiveStatus2FA: Joi.bool().required(),
});

module.exports = schema;
