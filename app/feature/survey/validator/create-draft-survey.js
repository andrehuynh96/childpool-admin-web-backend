const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");

const answerSchema = Joi.object().keys({
  text: Joi.string().allow(null).allow('').max(1000).optional(),
  text_ja: Joi.string().allow(null).allow('').max(1000).optional(),
  is_correct_flg: Joi.boolean().required(),
  is_other_flg: Joi.boolean().optional(),
});

const questionSchema = Joi.object().keys({
  title: Joi.string().max(1000).required(),
  title_ja: Joi.string().allow(null).allow('').max(1000).optional(),
  question_type: Joi.string().valid(Object.values(QuestionType)).required(),
  answers: Joi.array().optional().items(answerSchema),
});

const Schema = Joi.object().keys({
  name: Joi.string().max(24).required(),
  name_ja: Joi.string().allow(null).allow('').max(14).optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  type: Joi.string().max(100).required(),
  silver_membership_point: Joi.number().allow(null).optional(),
  gold_membership_point: Joi.number().allow(null).optional(),
  platinum_membership_point: Joi.number().allow(null).optional(),
  questions: Joi.array().min(1).required().items(questionSchema),
});

module.exports = Schema;

