const Joi = require('joi');
const QuestionType = require("app/model/wallet/value-object/question-type");

const answerSchema = Joi.object().keys({
  id: Joi.number().required(),
  text: Joi.string().max(2000).required(),
  text_ja: Joi.string().allow(null).allow('').max(2000).optional(),
  is_correct_flg: Joi.boolean().required(),
});

const questionSchema = Joi.object().keys({
  id: Joi.number().required(),
  title: Joi.string().required(),
  title_ja: Joi.string().allow(null).allow('').optional(),
  question_type: Joi.string().valid(Object.values(QuestionType)).required(),
  actived_flg: Joi.boolean().required(),
  answers: Joi.array().optional().items(answerSchema),
});

const schema = Joi.object().keys({
  survey: Joi.object().keys({
    name: Joi.string().max(256).required(),
    content: Joi.string().max(2000).required(),
    content_ja: Joi.string().allow(null).allow('').max(2000).optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    actived_flg: Joi.boolean().required(),
    description: Joi.string().allow(null).allow('').max(2000).optional(),
    point: Joi.number().min(1).required(),
    estimate_time: Joi.number().min(1).required(),
  }),
  questions: Joi.array().optional().items(questionSchema)
});

module.exports = schema;
