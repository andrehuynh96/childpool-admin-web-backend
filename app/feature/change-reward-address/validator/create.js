const Joi = require('joi');

const schema = Joi.object().keys({
  reward_address: Joi.string().required()
});

module.exports = schema;