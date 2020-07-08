const Joi = require('joi');

const schema = Joi.object().keys({
  membershipTypeId: Joi.string().required(),
});

module.exports = schema;