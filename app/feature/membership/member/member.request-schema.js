const Joi = require('joi');

const schema = Joi.object().keys({
  membershipTypeId: Joi.string().required(),
  referrerCode: Joi.string().allow("").allow(null).optional()
});

module.exports = schema;