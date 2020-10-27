const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");
const QuestionCategory = require("app/model/wallet/value-object/question-category");

const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  keyword: Joi.string().allow('').allow(null).max(100).optional(),
  question_type: Joi.string().allow('').allow(null).valid(Object.values(QuestionType)).optional(),
  category_type: Joi.string().allow('').allow(null).valid(Object.values(QuestionCategory)).optional(),
});

module.exports = schema;
