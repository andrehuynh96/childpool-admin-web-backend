const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      id: Joi.string().optional(),
      platform: Joi.string().required(),
      commission: Joi.number().required()
    })
  )
});

module.exports = schema;