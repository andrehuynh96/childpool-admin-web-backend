const { Schemas } = require("aws-sdk");

const Joi = require('joi');

const schema = Joi.object().keys({
  claimPoints: Joi.object().keys({
    Silver: Joi.number().min(1).required(),
    Gold: Joi.number().min(1).required(),
    Platinum: Joi.number().min(1).required(),
  }).required(),
  delayTime: Joi.number().min(1).required()
});
module.exports = schema;
