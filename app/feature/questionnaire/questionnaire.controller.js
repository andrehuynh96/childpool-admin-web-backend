const _ = require('lodash');
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
        cond.type = query.question_type;
      }

      if (query.category_type) {
        cond.event = query.category_type;
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
  update: async (req, res, next) => {
    let transaction;

    try {
      const { params, body, user } = req;
      let question = await Question.findOne({
        where: {
          id: params.questionId,
          deleted_flg: false,
        }
      });

      if (!question) {
        return res.notFound(res.__("QUESTION_NOT_FOUND"), "QUESTION_NOT_FOUND", { fields: ['id'] });
      }

      // const isPublished = !question.actived_flg && body.actived_flg;
      // transaction = await database.transaction();
      // // eslint-disable-next-line no-unused-vars
      // const [numOfItems, items] = await Question.update({
      //   ...body,
      //   updated_by: user.id,
      // }, {
      //   where: {
      //     id: params.questionId,
      //   },
      //   returning: true,
      //   transaction: transaction,
      // });

      // if (isPublished) {
      //   question = items[0];
      //   await questionService.publish(question, transaction);
      // }

      // await transaction.commit();

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
  create: async (req, res, next) => {
    const transaction = await database.transaction();

    try {
      const { body, user } = req;
      const data = {
        ...body,
        deleted_flg: false,
        created_by: user.id,
      };
      const question = await Question.create(data, { transaction });

      // if (question.actived_flg) {
      //   await questionService.publish(question, transaction);
      // }
      // await transaction.commit();

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
  delete: async (req, res, next) => {
    let transaction;

    try {
      const { params, user } = req;
      let question = await Question.findOne({
        where: {
          id: params.questionId,
          deleted_flg: false,
        }
      });

      if (!question) {
        return res.notFound(res.__("QUESTION_NOT_FOUND"), "QUESTION_NOT_FOUND", { fields: ['id'] });
      }

      // transaction = await database.transaction();
      // await QuestionDetails.update({
      //   deleted_flg: true,
      //   updated_by: user.id,
      // }, {
      //   where: {
      //     question_id: question.id,
      //   },
      //   transaction: transaction,
      // });
      // await Question.update({
      //   deleted_flg: true,
      //   updated_by: user.id,
      // }, {
      //   where: {
      //     id: question.id,
      //   },
      //   transaction: transaction,
      // });
      // await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      logger.error('Delete question fail', error);
      if (transaction) {
        await transaction.rollback();
      }

      next(error);
    }
  },
};
