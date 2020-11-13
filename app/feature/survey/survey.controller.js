const logger = require('app/lib/logger');
const Question = require('app/model/wallet').questions;
const QuestionAnswer = require('app/model/wallet').question_answers;
const Survey = require('app/model/wallet').surveys;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const where = {};

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
      const { surveyId } = req.params;
      const survey = await Survey.findOne({
        where: {
          id: surveyId
        }
      });
      if (!survey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"),"SURVEY_NOT_FOUND", { field: ['surveyId'] });
      }

      const questions = await Question.findAll({
        include: [
          {
            as: "Answers",
            model: QuestionAnswer,
            required: true,
          }
        ],
        where: {
          survey_id: surveyId,
          deleted_flg: false,
        }
      });

      return res.ok({
        survey: survey,
        questions: questions
      });
    } catch (error) {
      logger.error('Get survey detail fail', error);
      next(error);
    }
  }
};
