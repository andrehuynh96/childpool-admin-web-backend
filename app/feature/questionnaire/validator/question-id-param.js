const Joi = require('joi');

const schema = Joi.object().keys({
  questionId: Joi.number().required(),
});

module.exports = schema;
