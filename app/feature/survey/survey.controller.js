const logger = require('app/lib/logger');
const Question = require('app/model/wallet').questions;
const QuestionAnswer = require('app/model/wallet').question_answers;
const Quiz = require('app/model/wallet').quizzes;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const questionMapper = require("app/feature/response-schema/question.response-schema");
const database = require('app/lib/database').db().wallet;
const QuestionSubType = require('app/model/wallet/value-object/question-sub-type');
const SurveyStatus = require('app/model/wallet/value-object/survey-status');
const SurveyType = require('app/model/wallet/value-object/survey-type');
const Joi = require('joi');
const QuestionType = require('app/model/wallet/value-object/question-type');
const { updateDraftSurveys, updateDraftQuiz, updateSurveys, updateQuiz } = require('./validator');

const ActionName = {
  Draft: 'draft',
  Publish: 'publish'
};

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

      const { count: total, rows: items } = await Quiz.findAndCountAll({
        limit: limit,
        offset: offset,
        where: where,
        order: [['created_at', 'DESC']],
        raw: true
      });

      items.forEach(item => {
        item.duration = getDurationTime(item.start_date, item.end_date);
        const today = new Date();
        if (today <= item.end_date && today >= item.start_date && item.status === SurveyStatus.READY) {
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
      const survey = await Quiz.findOne({
        where: {
          id: id,
          deleted_flg: false
        },
        raw: true
      });

      survey.duration = getDurationTime(survey.start_date, survey.end_date);

      const today = new Date();
      if (today <= survey.end_date && today >= survey.start_date && survey.status === SurveyStatus.READY) {
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
  saveAsDraftQuiz: async (req, res, next) => {
    let transaction;
    let startDate, endDate;
    try {
      const { body } = req;
      const { questions } = body;

      if (body.start_date) {
        startDate = moment(body.start_date).toDate();
      }
      if (body.end_date) {
        endDate = moment(body.end_date).toDate();
      }
      if (startDate && endDate && startDate >= endDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['start_date', 'end_date'] });
      }

      for (let i = 0; i < questions.length; i++) {
        if (questions[i].answers && questions[i].answers.length > 0 && questions[i].answers.length <= 5) {
          let errFlag = false;
          let answers = questions[i].answers;
          for (let j = 0; j < answers.length; j++) {
            if (answers[0].text.trim() != '' || answers[1].text.trim() != '') {
              errFlag = true;
            }
          }
          if (errFlag) {
            return res.badRequest(res.__("ANSWER_TEXT_FIELD_ONE_AND_TWO_ARE_REQUIRED"), "ANSWER_TEXT_FIELD_ONE_AND_TWO_ARE_REQUIRED", { field: ['answers_text'] });
          }
        } else {
          return res.badRequest(res.__("ROW_ANSWER_TEXT_FIELD_MUST_BE_GREATER_THAN_OR_EQUAL_FIVE"), "ROW_ANSWER_TEXT_FIELD_MUST_BE_GREATER_THAN_OR_EQUAL_FIVE", { field: ['answers_text'] });
        }
      }

      const data = {
        name: body.name,
        name_ja: body.name_ja,
        start_date: body.start_date,
        end_date: body.end_date,
        silver_membership_point: body.silver_membership_point,
        gold_membership_point: body.gold_membership_point,
        platinum_membership_point: body.platinum_membership_point,
        type: body.type,
        status: SurveyStatus.DRAFT,
        created_by: req.user.id,
        updated_by: req.user.id,
      };

      transaction = await database.transaction();
      const newQuiz = await Quiz.create(data, {
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        for (let item of questions) {
          await createQuestionAndAnswers(newQuiz.id, item, transaction, req.user.id);
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
  saveAsDraftSurveys: async (req, res, next) => {
    let transaction;
    try {
      const { body } = req;
      const { questions } = body;
      const data = {
        name: body.name,
        name_ja: body.name_ja,
        start_date: body.start_date,
        end_date: body.end_date,
        silver_membership_point: body.silver_membership_point,
        gold_membership_point: body.gold_membership_point,
        platinum_membership_point: body.platinum_membership_point,
        type: body.type,
        status: SurveyStatus.DRAFT,
        created_by: req.user.id,
        updated_by: req.user.id,
      };

      transaction = await database.transaction();
      const newQuiz = await Quiz.create(data, {
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        for (let item of questions) {
          await createQuestionAndAnswers(newQuiz.id, item, transaction, req.user.id);
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
  createSurvey: async (req, res, next) => {
    let transaction;
    try {
      const { survey, questions } = req.body;
      survey.created_by = req.user.id;
      survey.updated_by = req.user.id;

      transaction = await database.transaction();
      const surveyRes = await Quiz.create(survey, {
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        for (let item of questions) {
          await createQuestionAndAnswers(surveyRes.id, item, transaction, req.user.id);
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
  updateQuiz: async (req, res, next) => {
    let transaction;
    let startDate, endDate;
    const today = new Date();
    const { body: { questions }, params: { id } } = req;
    try {
      if (req.body.start_date) {
        startDate = moment(req.body.start_date).toDate();
      }
      if (req.body.end_date) {
        endDate = moment(req.body.end_date).toDate();
      }
      if (startDate && endDate && startDate >= endDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['start_date', 'end_date'] });
      }

      for (let i = 0; i < questions.length; i++) {
        if (questions[i].answers && questions[i].answers.length > 0 && questions[i].answers.length <= 5) {
          let errFlag = false;
          let answers = questions[i].answers;
          for (let j = 0; j < answers.length; j++) {
            if (answers[0].text.trim() != '' || answers[1].text.trim() != '') {
              errFlag = true;
            }
          }
          if (errFlag) {
            return res.badRequest(res.__("ANSWER_TEXT_FIELD_ONE_AND_TWO_ARE_REQUIRED"), "ANSWER_TEXT_FIELD_ONE_AND_TWO_ARE_REQUIRED", { field: ['answers_text'] });
          }
        } else {
          return res.badRequest(res.__("ROW_ANSWER_TEXT_FIELD_MUST_BE_GREATER_THAN_OR_EQUAL_FIVE"), "ROW_ANSWER_TEXT_FIELD_MUST_BE_GREATER_THAN_OR_EQUAL_FIVE", { field: ['answers_text'] });
        }
      }

      const availableSurvey = await Quiz.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });

      if (!availableSurvey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }

      if (req.body.action_name.toLowerCase() === ActionName.Draft) {
        const result = Joi.validate(req.body, updateDraftQuiz);
        req.body.status = SurveyStatus.DRAFT;
        if (result.error) {
          const err = {
            details: result.error.details,
          };
          return res.badRequest(res.__('MISSING_PARAMETERS'), 'MISSING_PARAMETERS', err);
        }
      } else if (req.body.action_name.toLowerCase() === ActionName.Publish) {
        const result = Joi.validate(req.body, updateQuiz);
        req.body.status = SurveyStatus.READY;
        if (result.error) {
          const err = {
            details: result.error.details,
          };
          return res.badRequest(res.__('MISSING_PARAMETERS'), 'MISSING_PARAMETERS', err);
        }
        if (availableSurvey.status != SurveyStatus.READY && startDate < today) {
          return res.badRequest(res.__("START_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TODAY"), "START_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TODAY", { field: ['start_date'] });
        }
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].answers && questions[i].answers.length > 0) {
            let textArray = [];
            let textJaArray = [];
            let errFlag = false;
            questions[i].answers.forEach(answer => {
              textArray.push(answer.text);
              if (answer.text_ja != '') {
                textJaArray.push(answer.text_ja);
              }
              if (questions[i].question_type !== QuestionType.OPEN_ENDED && !answer.is_other_flg && answer.text.trim() === '') {
                errFlag = true;
              }
            });
            if (errFlag) {
              return res.badRequest(res.__("ANSWER_TEXT_FIELD_IS_REQUIRED"), "ANSWER_TEXT_FIELD_IS_REQUIRED", { field: ['answers_text'] });
            }
            questions[i].answers.forEach(answer => {
              const resultText = textArray.filter(item => item === answer.text);
              const resultTextJa = textJaArray.filter(item => item === answer.text_ja);
              if (resultText.length >= 2 || resultTextJa.length >= 2) {
                errFlag = true;
              }
            });
            if (errFlag) {
              return res.badRequest(res.__("THERE_ARE_TWO_OVERLAPPING_FIELD"), "THERE_ARE_TWO_OVERLAPPING_FIELD", { field: ['answers_text'] });
            }
          }
        }

        const checkQuizReady = await Quiz.findOne({
          where: {
            deleted_flg: false,
            status: SurveyStatus.READY,
            [Op.not]: { id: id },
            [Op.or]: [{
              start_date: {
                [Op.between]: [startDate, endDate],
              }
            }, {
              end_date: {
                [Op.between]: [startDate, endDate],
              }
            },
            {
              start_date: {
                [Op.lt]: startDate,
              },
              end_date: {
                [Op.gt]: endDate
              }
            },
            {
              start_date: {
                [Op.gt]: startDate,
              },
              end_date: {
                [Op.lt]: endDate
              }
            }
            ]
          }
        });
        if (checkQuizReady != null) {
          return res.notFound(res.__("THERE_ARE_ACTIVITY_DURING_THIS_TIME"), "THERE_ARE_ACTIVITY_DURING_THIS_TIME", { field: ['start_date', 'end_date'] });
        }
      }

      transaction = await database.transaction();
      await Quiz.update(req.body, {
        where: {
          id: id
        },
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        await removeQuestionAndAnswerNotInList(id, questions, transaction);

        for (let item of questions) {
          if (item.id) {
            await updateQuestions(id, item, transaction, req.user.id);
          }
          else {
            await createQuestionAndAnswers(id, item, transaction, req.user.id);
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

  updateSurvey: async (req, res, next) => {
    let transaction;
    let startDate, endDate;
    const today = new Date();
    const { body: { questions }, params: { id } } = req;
    try {
      if (req.body.start_date) {
        startDate = moment(req.body.start_date).toDate();
      }
      if (req.body.end_date) {
        endDate = moment(req.body.end_date).toDate();
      }
      if (startDate && endDate && startDate >= endDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['start_date', 'end_date'] });
      }

      const availableSurvey = await Quiz.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });

      if (!availableSurvey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }

      if (req.body.action_name.toLowerCase() === ActionName.Draft) {
        const result = Joi.validate(req.body, updateDraftSurveys);
        req.body.status = SurveyStatus.DRAFT;
        if (result.error) {
          const err = {
            details: result.error.details,
          };
          return res.badRequest(res.__('MISSING_PARAMETERS'), 'MISSING_PARAMETERS', err);
        }
      } else if (req.body.action_name.toLowerCase() === ActionName.Publish) {
        const result = Joi.validate(req.body, updateSurveys);
        req.body.status = SurveyStatus.READY;
        if (result.error) {
          const err = {
            details: result.error.details,
          };
          return res.badRequest(res.__('MISSING_PARAMETERS'), 'MISSING_PARAMETERS', err);
        }
        if (availableSurvey.status != SurveyStatus.READY && startDate < today) {
          return res.badRequest(res.__("START_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TODAY"), "START_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TODAY", { field: ['start_date'] });
        }
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].answers && questions[i].answers.length > 0) {
            let textArray = [];
            let textJaArray = [];
            let errFlag = false;
            questions[i].answers.forEach(answer => {
              textArray.push(answer.text);
              if (answer.text_ja != '') {
                textJaArray.push(answer.text_ja);
              }
              if (questions[i].question_type !== QuestionType.OPEN_ENDED && !answer.is_other_flg && answer.text.trim() === '') {
                errFlag = true;
              }
            });
            if (errFlag) {
              return res.badRequest(res.__("ANSWER_TEXT_FIELD_IS_REQUIRED"), "ANSWER_TEXT_FIELD_IS_REQUIRED", { field: ['answers_text'] });
            }
            questions[i].answers.forEach(answer => {
              const resultText = textArray.filter(item => item === answer.text);
              const resultTextJa = textJaArray.filter(item => item === answer.text_ja);
              if (resultText.length >= 2 || resultTextJa.length >= 2) {
                errFlag = true;
              }
            });
            if (errFlag) {
              return res.badRequest(res.__("THERE_ARE_TWO_OVERLAPPING_FIELD"), "THERE_ARE_TWO_OVERLAPPING_FIELD", { field: ['answers_text'] });
            }
          }
        }

        const checkQuizReady = await Quiz.findOne({
          where: {
            deleted_flg: false,
            status: SurveyStatus.READY,
            [Op.not]: { id: id },
            [Op.or]: [{
              start_date: {
                [Op.between]: [startDate, endDate],
              }
            }, {
              end_date: {
                [Op.between]: [startDate, endDate],
              }
            },
            {
              start_date: {
                [Op.lt]: startDate,
              },
              end_date: {
                [Op.gt]: endDate
              }
            },
            {
              start_date: {
                [Op.gt]: startDate,
              },
              end_date: {
                [Op.lt]: endDate
              }
            }
            ]
          }
        });
        if (checkQuizReady != null) {
          return res.notFound(res.__("THERE_ARE_ACTIVITY_DURING_THIS_TIME"), "THERE_ARE_ACTIVITY_DURING_THIS_TIME", { field: ['start_date', 'end_date'] });
        }
      }

      transaction = await database.transaction();
      await Quiz.update(req.body, {
        where: {
          id: id
        },
        transaction: transaction
      });

      if (questions && questions.length > 0) {
        await removeQuestionAndAnswerNotInList(id, questions, transaction);

        for (let item of questions) {
          if (item.id) {
            await updateQuestions(id, item, transaction, req.user.id);
          }
          else {
            await createQuestionAndAnswers(id, item, transaction, req.user.id);
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
      const availableSurvey = await Quiz.findOne({
        where: {
          id: id,
          deleted_flg: false
        }
      });

      if (!availableSurvey) {
        return res.notFound(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND", { field: ['id'] });
      }
      transaction = await database.transaction();
      await Quiz.update({
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
  getOptions: (req, res, next) => {
    try {
      const options = {};
      options.status = Object.entries(SurveyStatus).map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });

      options.type = Object.entries(SurveyType).map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });

      return res.ok(options);
    }
    catch (error) {
      logger.error('get survey options fail', error);
      next(error);
    }
  }
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
async function updateQuestions(survey_id, question, transaction, user_id) {
  try {
    await Question.update({
      title: question.title,
      title_ja: question.title_ja ? question.title_ja : '',
      question_type: question.question_type,
      actived_flg: question.actived_flg,
      updated_by: user_id,
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
            text_ja: answer.text_ja,
            is_correct_flg: answer.is_correct_flg,
            is_other_flg: answer.is_other_flg
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
            text_ja: answer.text_ja,
            is_correct_flg: answer.is_correct_flg,
            is_other_flg: answer.is_other_flg
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

function getDurationTime(start_date, end_date) {
  const startDate = Date.parse(start_date) / 1000;
  const endDate = Date.parse(end_date) / 1000;
  const secondDurations = endDate - startDate;

  const d = Math.floor(secondDurations / (3600 * 24));
  const h = Math.floor(secondDurations % (3600 * 24) / 3600);
  const m = Math.floor(secondDurations % 3600 / 60);
  const s = Math.floor(secondDurations % 60);

  const dDisplay = d > 0 ? d + 'd ' : '';
  const hDisplay = h > 0 ? h + 'h ' : '';
  const mDisplay = m > 0 ? m + 'm ' : '';
  const sDisplay = s > 0 ? s + 's' : '';

  return dDisplay + hDisplay + mDisplay + sDisplay;
}
