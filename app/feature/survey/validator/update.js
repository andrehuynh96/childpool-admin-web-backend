const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");
const SurveyType = require('app/model/wallet/value-object/survey-type');
const SurveyStatus = require('app/model/wallet/value-object/survey-status');

const surveyTypes = Object.values(SurveyType);
const surveyStatuses = Object.values(SurveyStatus);

const answerSchema = Joi.object().keys({
  id: Joi.number().optional(),
  text: Joi.string().max(2000).required(),
  text_ja: Joi.string().allow(null).allow('').max(2000).optional(),
  is_correct_flg: Joi.boolean().required(),
});

const questionSchema = Joi.object().keys({
  id: Joi.number().optional(),
  title: Joi.string().required(),
  title_ja: Joi.string().allow(null).allow('').optional(),
  question_type: Joi.string().valid(Object.values(QuestionType)).required(),
  answers: Joi.array().optional().items(answerSchema),
});

const schema = Joi.object().keys({
  survey: Joi.object().keys({
    name: Joi.string().max(256).required(),
    content: Joi.string().max(2000).required(),
    content_ja: Joi.string().allow(null).allow('').max(2000).optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    description: Joi.string().allow(null).allow('').max(2000).optional(),
    point: Joi.number().min(1).required(),
    status: Joi.string().valid(surveyStatuses).required(),
    type: Joi.string().valid(surveyTypes).required(),
    title: Joi.string().max(1000).required(),
    title_ja: Joi.string().allow(null).allow('').max(1000).optional(),
    silver_membership_point: Joi.number().required(),
    gold_membership_point: Joi.number().required(),
    platinum_membership_point: Joi.number().required(),
  }),
  questions: Joi.array().optional().items(questionSchema)
});

module.exports = schema;
