const _ = require('lodash');
const { forEach } = require('p-iteration');
const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Question = require('app/model/wallet').questions;
const QuestionAnswer = require('app/model/wallet').question_answers;
const QuestionType = require("app/model/wallet/value-object/question-type");
const QuestionCategory = require("app/model/wallet/value-object/question-category");
const mapper = require("app/feature/response-schema/question.response-schema");

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const keyword = _.trim(query.keyword);
      const cond = {
        deleted_flg: false,
      };
      const orCond = [];

      if (keyword) {
        orCond.push({
          title: { [Op.iLike]: `%${keyword}%` }
        });

        orCond.push({
          title_ja: { [Op.iLike]: `%${keyword}%` }
        });
      }

      if (orCond.length) {
        cond[Op.or] = orCond;
      }

      if (query.question_type) {
        cond.question_type = query.question_type;
      }

      if (query.category_type) {
        cond.category_type = query.category_type;
      }

      const { count: total, rows: items } = await Question.findAndCountAll({
        limit,
        offset,
        where: cond,
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: mapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.error('Search questions fail', error);
      next(error);
    }
  },
  getDetails: async (req, res, next) => {
    try {
      const { params } = req;
      const question = await Question.findOne({
        include: [
          {
            as: "Answers",
            model: QuestionAnswer,
            required: true,
          }
        ],
        where: {
          id: params.questionId,
          deleted_flg: false,
        },
      });

      if (!question) {
        return res.notFound(res.__("QUESTION_NOT_FOUND"), "QUESTION_NOT_FOUND", { fields: ['id'] });
      }

      return res.ok(mapper(question));
    }
    catch (error) {
      logger.error('get exchange currency details fail', error);
      next(error);
    }
  },
  create: async (req, res, next) => {
    const transaction = await database.transaction();

    try {
      const { body, user } = req;
      const data = {
        title: body.title,
        title_ja: body.title_ja,
        question_type: body.question_type,
        category_type: QuestionCategory.ANSWER_NOW,
        points: body.points,
        actived_flg: body.actived_flg,
        deleted_flg: false,
        created_by: user.id,
        Answers: body.answers || [],
      };
      const question = await Question.create(data, {
        include: [
          {
            model: QuestionAnswer,
            as: 'Answers'
          },
        ],
        transaction
      });

      await transaction.commit();

      return res.ok(mapper(question));
    }
    catch (error) {
      logger.error('create question fail', error);
      await transaction.rollback();

      next(error);
    }
  },
  getQuestionTypes: async (req, res, next) => {
    try {
      const result = Object.keys(QuestionType).map((key) => {
        return {
          value: key,
          label: QuestionType[key],
        };
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get getQuestionTypes fail', error);
      next(error);
    }
  },
  getQuestionCategories: async (req, res, next) => {
    try {
      const result = Object.keys(QuestionCategory).map((key) => {
        return {
          value: key,
          label: QuestionCategory[key],
        };
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get QuestionCategory fail', error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    let transaction;

    try {
      const { params, body, user } = req;
      const question = await Question.findOne({
        include: [
          {
            as: "Answers",
            model: QuestionAnswer,
            required: true,
          }
        ],
        where: {
          id: params.questionId,
          deleted_flg: false,
        },
      });

      if (!question) {
        return res.notFound(res.__("QUESTION_NOT_FOUND"), "QUESTION_NOT_FOUND");
      }

      transaction = await database.transaction();
      await Question.update({
        title: body.title,
        title_ja: body.title_ja,
        question_type: body.question_type,
        points: body.points,
        actived_flg: body.actived_flg,
        updated_by: user.id,
      }, {
        where: {
          id: question.id,
        },
        returning: true,
        transaction: transaction,
      });

      const questionAnswerCache = _.keyBy(question.Answers, item => item.id);
      const updateQuestionAnswers = [];
      const insertQuestionAnswers = [];
      const questionAnswerIdCache = {};

      body.answers.forEach(item => {
        if (!item.id) {
          insertQuestionAnswers.push({
            text: item.text,
            text_ja: item.text_ja,
            is_correct_flg: item.is_correct_flg,
            question_id: question.id,
          });

          return;
        }

        questionAnswerIdCache[item.id] = item;
        const questionAnswer = questionAnswerCache[item.id];
        if (questionAnswer) {
          questionAnswer.text = item.text;
          questionAnswer.text_ja = item.text_ja;
          questionAnswer.is_correct_flg = item.is_correct_flg;

          updateQuestionAnswers.push(questionAnswer);
        }
      });

      const removeQuestionAnswerIdList = [];
      question.Answers.forEach(item => {
        if (!questionAnswerIdCache[item.id]) {
          removeQuestionAnswerIdList.push(item.id);
        }
      });

      await forEach(updateQuestionAnswers, async (instance) => {
        await instance.save({ transaction });
      });
      await QuestionAnswer.bulkCreate(insertQuestionAnswers, { transaction });
      await QuestionAnswer.destroy({
        where: {
          id: {
            [Op.in]: removeQuestionAnswerIdList,
          },
        }

      }, { transaction });
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      logger.error('Update question fail', error);
      if (transaction) {
        await transaction.rollback();
      }

      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { params, user } = req;
      const [numOfItems, items] = await Question.update({
        deleted_flg: true,
        updated_by: user.id,
      }, {
        where: {
          id: params.questionId,
          deleted_flg: false,
        },
      });

      if (!numOfItems) {
        return res.notFound(res.__("QUESTION_NOT_FOUND"), "QUESTION_NOT_FOUND");
      }

      return res.ok(true);
    }
    catch (error) {
      logger.error('Delete question fail', error);
      next(error);
    }
  },
};
