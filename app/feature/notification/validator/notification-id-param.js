const Joi = require('joi');

const schema = Joi.object().keys({
  notificationId: Joi.number().required(),
});

module.exports = schema;
