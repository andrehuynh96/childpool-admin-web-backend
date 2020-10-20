const Joi = require('joi');

const schema = Joi.object().keys({
  claimPoints: Joi.object().keys({
    Silver: Joi.number().min(0).required(),
    Gold: Joi.number().min(0).required(),
    Platinum: Joi.number().min(0).required(),
  }).required(),
  delayTime: Joi.number().min(0).required()
});
module.exports = schema;
