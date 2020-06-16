const Joi = require('joi');

const schema = Joi.object().keys({
  membershipTypeId: Joi.string().required(),
  refererrCode: Joi.string().allow(null).optional()
});

module.exports = schema;