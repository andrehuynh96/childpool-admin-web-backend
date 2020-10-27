const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");

const answerSchema = Joi.object().keys({
  text: Joi.string().max(2000).required(),
  text_ja: Joi.string().allow(null).allow('').max(2000).optional(),
  is_correct_flg: Joi.boolean().required(),
});

const schema = Joi.object().keys({
  title: Joi.string().required(),
  title_ja: Joi.string().allow(null).allow('').optional(),
  question_type: Joi.string().valid(Object.values(QuestionType)).max(32).required(),
  points: Joi.number().min(1).required(),
  actived_flg: Joi.boolean().required(),
  answers: Joi.array().optional().items(answerSchema),
});

module.exports = schema;
