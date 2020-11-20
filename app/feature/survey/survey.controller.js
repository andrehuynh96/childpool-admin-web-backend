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
const SurveyStatus = require('app/model/wallet/value-object/survey-status');

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const where = {
        deleted_flg: false
      };

      if (query.history) {
        where.status = SurveyStatus.DONE;
      }
      else {
        where.status = { [Op.not]: SurveyStatus.DONE };
      }

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
        order: [['created_at', 'DESC']],
        raw: true
      });

      items.forEach(item => {
        const startDate = Date.parse(item.start_date) / 1000;
        const endDate = Date.parse(item.end_date) / 1000;
        const secondDurations = endDate - startDate;
        item.duration = getDurationTime(secondDurations);

        const today = new Date();
        if (today < item.end_date && today > item.start_date && item.status === SurveyStatus.READY ) {
          item.status = 'IN_PROGRESS';
        }
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
        },
        raw: true
      });

      const startDate = Date.parse(survey.start_date) / 1000;
        const endDate = Date.parse(survey.end_date) / 1000;
        const secondDurations = endDate - startDate;
        survey.duration = getDurationTime(secondDurations);

        const today = new Date();
        if (today < survey.end_date && today > survey.start_date && survey.status === SurveyStatus.READY ) {
          survey.status = 'IN_PROGRESS';
        }

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

      const membershipPoint = survey.membership_point.reduce((result,value) => {
        result[value.membership_type_id] = value.amount;
        return result;
      },{});
      survey.membership_point = membershipPoint;
      survey.created_by = req.user.id;
      survey.updated_by = req.user.id;

      transaction = await database.transaction();
      const surveyRes = await Survey.create(survey, {
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        for (let item of questions) {
          await createQuestionAndAnswers(surveyRes.id, item, transaction,req.user.id);
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
      const { body: { survey, questions }, params: { id } } = req;
      const availableSurvey = await Survey.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });

      if (!availableSurvey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }
      const membershipPoint = survey.membership_point.reduce((result,value) => {
        result[value.membership_type_id] = value.amount;
        return result;
      },{});
      survey.membership_point = membershipPoint;
      transaction = await database.transaction();
      await Survey.update(survey, {
        where: {
          id: id
        },
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        await removeQuestionAndAnswerNotInList(id ,questions, transaction);

        for (let item of questions) {
          if (item.id) {
            await updateQuestions(id,item, transaction, req.user.id);
          }
          else {
            await createQuestionAndAnswers(id,item, transaction,req.user.id);
          }
        }
      }
      else {
        await removeAllQuestionAndAnswer(id, transaction);
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
  deleteSurvey: async (req, res, next) => {
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
      }, {
        where: {
          id: id
        },
        transaction: transaction
      });

      await Question.update({
        deleted_flg: true
      }, {
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

async function removeQuestionAndAnswerNotInList(survey_id, questions, transaction) {
  try {
    const listQuestionId = [];
    questions.forEach(item => {
      if (item.id) {
        listQuestionId.push(item.id);
      }
    });

    await Question.update({
      deleted_flg: true
    }, {
      where: {
        id: { [Op.notIn]: listQuestionId },
        survey_id: survey_id,
        deleted_flg: false
      },
      transaction: transaction
    });

    const questionsRemoved = await Question.findAll({
      where: {
        id: { [Op.notIn]: listQuestionId },
        survey_id: survey_id
      },
    });

    const questionRemovedIds = questionsRemoved.map(item => item.id);
    await QuestionAnswer.destroy({
      where: {
        question_id: questionRemovedIds
      },
      transaction: transaction
    });
  }
  catch (error) {
    logger.error('Remove question and answer not in list fail', error);
    throw error;
  }
}

async function createQuestionAndAnswers(survey_id, question, transaction, user_id) {
  try {
    const questionRes = await Question.create({
      title: question.title,
      title_ja: question.title_ja ? question.title_ja : '',
      question_type: question.question_type,
      actived_flg: true,
      points: 0,
      deleted_flg: false,
      created_by: user_id,
      updated_by: user_id,
      survey_id: survey_id,
      sub_type: QuestionSubType.SURVEY,
      estimate_time: 0
    }, {
      transaction: transaction
    });

    if (question.answers && question.answers.length > 0) {
      question.answers.forEach(x => {
        x.question_id = questionRes.id;
      });

      await QuestionAnswer.bulkCreate(question.answers, {
        transaction: transaction
      });
    }
  }
  catch (error) {
    logger.error('Create question and answer fail', error);
    throw error;
  }
}
async function updateQuestions(survey_id, question, transaction,user_id) {
  try {
    await Question.update({
      title: question.title,
      title_ja: question.title_ja ? question.title_ja : '',
      question_type: question.question_type,
      actived_flg: question.actived_flg,
      updated_by: user_id
    }, {
      where: {
        survey_id: survey_id,
        id: question.id,
        deleted_flg: false
      },
      transaction: transaction
    });

    if (question.answers && question.answers.length > 0) {
      const listAnswerId = [];
      question.answers.forEach(x => {
        if (x.id) {
          listAnswerId.push(x.id);
        }
      });

      await QuestionAnswer.destroy({
        where: {
          id: { [Op.notIn]: listAnswerId },
          question_id: question.id,
        }
      });

      for (let answer of question.answers) {
        if (answer.id) {
          await QuestionAnswer.update({
            text: answer.text,
            text_js: answer.text_js ? answer.text_js : '',
            is_correct_flg: answer.is_correct_flg
          }, {
            where: {
              id: answer.id
            },
            transaction: transaction
          });
        }
        else {
          await QuestionAnswer.create({
            question_id: question.id,
            text: answer.text,
            text_js: answer.text_js ? answer.text_js : '',
            is_correct_flg: answer.is_correct_flg
          }, {
            transaction: transaction
          });
        }
      }
    }
    else {
      await QuestionAnswer.destroy({
        where: {
          question_id: question.id
        },
        transaction: transaction
      });
    }
  }
  catch (error) {
    logger.error('Update question fail', error);
    throw error;
  }
}

async function removeAllQuestionAndAnswer(survey_id, transaction) {
  try {
    await Question.update({
      deleted_flg: true
    }, {
      where: {
        survey_id: survey_id,
        deleted_flg: false
      },
      transaction: transaction
    });
    const questionsRemoved = await Question.findAll({
      where: {
        survey_id: survey_id,
      }
    });

    const questionIds = questionsRemoved.map(item => item.id);
    await QuestionAnswer.destroy({
      where: {
        question_id: questionIds
      },
      transaction: transaction
    });
  }
  catch (error) {
    logger.error('Remove all question and answer of survey fail', error);
    throw error;
  }
}

function getDurationTime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + 'd ' : '';
  const hDisplay = h > 0 ? h + 'h ' : '';
  const mDisplay = m > 0 ? m + 'm ' : '';
  const sDisplay = s > 0 ? s + 's' : '';

  return dDisplay + hDisplay + mDisplay + sDisplay;
}
