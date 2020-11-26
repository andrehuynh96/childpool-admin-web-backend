const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");

const answerSchema = Joi.object().keys({
  id: Joi.number().optional(),
  text: Joi.string().allow(null).max(1000).required(),
  text_ja: Joi.string().allow(null).allow('').max(1000).optional(),
  is_correct_flg: Joi.boolean().required(),
});

const questionSchema = Joi.object().keys({
  id: Joi.number().optional(),
  title: Joi.string().max(1000).required(),
  title_ja: Joi.string().allow(null).allow('').max(1000).optional(),
  question_type: Joi.string().valid(Object.values(QuestionType)).required(),
  answers: Joi.array().optional().items(answerSchema),
});

const schema = Joi.object().keys({
  action_name: Joi.string().max(100).required(),
  name: Joi.string().max(24).required(),
  name_ja: Joi.string().allow(null).allow('').max(14).optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  silver_membership_point: Joi.number().min(0).required(),
  gold_membership_point: Joi.number().min(0).required(),
  platinum_membership_point: Joi.number().min(0).required(),
  questions: Joi.array().optional().items(questionSchema),
});

module.exports = schema;
