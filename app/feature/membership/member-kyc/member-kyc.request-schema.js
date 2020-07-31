const Joi = require('joi');

const schema = Joi.object().keys({
  member_kyc_properties: Joi.array().items(
    Joi.object().keys({
      id: Joi.number().required(),
      value: Joi.string().allow('').optional()
    }
    ).required()
  ).required()
});

module.exports = schema;