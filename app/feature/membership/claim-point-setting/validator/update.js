const { Schemas } = require("aws-sdk");

const Joi = require('joi');

const schema = Joi.object().keys({
  claimPoints: Joi.number().min(1).required(),
  delayTimes: Joi.number().min(1).required()
});
module.exports = schema;
