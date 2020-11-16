const logger = require('app/lib/logger');
const Question = require('app/model/wallet').questions;
const QuestionAnswer = require('app/model/wallet').question_answers;
const Survey = require('app/model/wallet').surveys;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const questionMapper = require("app/feature/response-schema/question.response-schema");
const database = require('app/lib/database').db().wallet;
const QuestionSubType = require('app/model/wallet/value-object/question-sub-type');

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const where = {
        deleted_flg: false
      };

      if (query.name) {
        where.name = { [Op.iLike]: `%${query.name}%` };
      }
      if (query.from_date && query.to_date) {
        const fromDate = moment(query.from_date).toDate();
        const toDate = moment(query.to_date).toDate();
        if (fromDate >= toDate) {
          return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
        }
        where.created_at = {
          [Op.gte]: fromDate,
          [Op.lt]: toDate
        };
      }

      const { count: total, rows: items } = await Survey.findAndCountAll({
        limit: limit,
        offset: offset,
        where: where,
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: items,
        limit: limit,
        offset: offset,
        total: total
      });
    }
    catch (error) {
      logger.error('Search survey fail', error);
      next(error);
    }
  },
  details: async (req, res, next) => {
    try {
      const { id } = req.params;
      const survey = await Survey.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });
      if (!survey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }

      const questions = await Question.findAll({
        include: [
          {
            as: "Answers",
            model: QuestionAnswer,
          }
        ],
        where: {
          survey_id: id,
          deleted_flg: false,
        }
      });

      return res.ok({
        survey: survey,
        questions: questionMapper(questions)
      });
    } catch (error) {
      logger.error('Get survey detail fail', error);
      next(error);
    }
  },
  createSurvey: async (req, res, next) => {
    let transaction;
    try {
      const { survey, questions } = req.body;
      survey.created_by = req.user.id;
      survey.updated_by = req.user.id;

      transaction = await database.transaction();
      const surveyRes = await Survey.create(survey,{
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        for (let item of questions) {
          const questionData = { ...item };
          questionData.points = 0;
          questionData.created_by = req.user.id;
          questionData.updated_by = req.user.id;
          questionData.survey_id = surveyRes.id;
          questionData.sub_type = QuestionSubType.SURVEY;
          questionData.deleted_flg = false;
          const questionRes = await Question.create(questionData,{
            transaction: transaction
          });

          if (item.answers && item.answers.length > 0) {
            item.answers.forEach(x => {
              x.question_id = questionRes.id;
            });

            await QuestionAnswer.bulkCreate(item.answers,{
              transaction: transaction
            });
          }
        }
      }
      await transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error('Create survey detail fail', error);
      next(error);
    }
  },
  updateSurvey: async (req, res, next) => {
    let transaction;
    try {
      const { body: { survey, questions } , params : { id } } = req;
      const availableSurvey = await Survey.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });

      if (!availableSurvey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }
      transaction = await database.transaction();
      await Survey.update(survey,{
        where: {
          id: id
        },
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        for (let item of questions) {
          await Question.update({
            title: item.title,
            title_ja : item.title_ja ? item.title_ja : '',
            question_type: item.question_type,
            actived_flg: item.actived_flg,
            updated_by: req.user.id
          },{
            where: {
              survey_id: id,
              id: item.id,
              deleted_flg: false
            },
            transaction: transaction
          });

          if (item.answers && item.answers.length > 0) {
            for (let answer of  item.answers) {
              await QuestionAnswer.update({
                text: answer.text,
                text_js: answer.text_js ? answer.text_js : '',
                is_correct_flg: answer.is_correct_flg
              },{
                where: {
                  id: answer.id
                },
                transaction: transaction
              });
            }
          }
        }
      }
      await transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error('Update survey detail fail', error);
      next(error);
    }
  },
  deleteSurvey: async(req, res, next) => {
    let transaction;
    try {
      const { params: { id } } = req;
      const availableSurvey = await Survey.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });

      if (!availableSurvey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }
      transaction = await database.transaction();
      await Survey.update({
        deleted_flg: true
      },{
        where: {
          id: id
        },
        transaction: transaction
      });

      await Question.update({
        deleted_flg: true
      },{
        where: {
          survey_id: id
        },
        transaction: transaction
      });

      await transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error('Delete survey detail fail', error);
      next(error);
    }
  },
};
