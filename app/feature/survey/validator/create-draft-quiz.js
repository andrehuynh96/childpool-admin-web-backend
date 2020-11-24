const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");
const SurveyType = require('app/model/wallet/value-object/survey-type');
const SurveyStatus = require('app/model/wallet/value-object/survey-status');

const surveyTypes = Object.values(SurveyType);
const surveyStatuses = Object.values(SurveyStatus);

const answerSchema = Joi.object().keys({
  text: Joi.string().max(1000).required(),
  text_ja: Joi.string().allow(null).allow('').max(1000).optional(),
  is_correct_flg: Joi.boolean().required(),
});

const questionSchema = Joi.object().keys({
  title: Joi.string().required(),
  title_ja: Joi.string().allow(null).allow('').optional(),
  question_type: Joi.string().valid(Object.values(QuestionType)).required(),
  answers: Joi.array().optional().items(answerSchema),
});

const createDraftQuizSchema = Joi.object().keys({
  title: Joi.string().max(24).required(),
  title_ja: Joi.string().allow(null).allow('').max(14).optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  silver_membership_point: Joi.number().allow(null).optional(),
  gold_membership_point: Joi.number().allow(null).optional(),
  platinum_membership_point: Joi.number().allow(null).optional(),
  questions: Joi.array().optional().items(questionSchema),
});

module.exports = createDraftQuizSchema;

