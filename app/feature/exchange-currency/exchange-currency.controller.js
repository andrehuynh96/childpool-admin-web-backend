// const _ = require('lodash');
const { forEach } = require('p-iteration');
const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const ExchangeCurrency = require('app/model/wallet').exchange_currencies;
const mapper = require("app/feature/response-schema/exchange-currency.response-schema");

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const cond = {};

      if (query.name) {
        cond.name = { [Op.iLike]: `%${query.name}%` };
      }
      if (query.platform) {
        cond.platform = query.platform;
      }

      const { count: total, rows: items } = await ExchangeCurrency.findAndCountAll({
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
      logger.error('get exchange currency list fail', error);
      next(error);
    }
  },
  getDetails: async (req, res, next) => {
    try {
      const ExchangeCurrency = await ExchangeCurrency.findAll({
        where: {
          name: req.params.name,
          deleted_flg: false
        }
      });

      if (!ExchangeCurrency) {
        return res.badRequest(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ['id'] });
      }
      return res.ok(ExchangeCurrency);
    }
    catch (error) {
      logger.error('get email template detail fail', error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      const { body } = req;
      const ExchangeCurrencys = body.email_templates;
      transaction = await database.transaction();
      for (let item of ExchangeCurrencys) {
        const ExchangeCurrency = await ExchangeCurrency.findOne({
          where: {
            name: item.name,
            language: item.language,
            deleted_flg: false
          }
        });

        if (ExchangeCurrency) {
          await ExchangeCurrency.update(
            {
              subject: item.subject,
              template: item.template
            },
            {
              where: {
                name: item.name,
                language: item.language
              },
              returning: true,
              transaction: transaction
            });
        } else {
          await ExchangeCurrency.create(
            item,
            { transaction: transaction });
        }
      }
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error('update email template fail', error);
      next(error);
    }
  },
  createExchangeCurrencyOption: async (req, res, next) => {
    try {
      const { body, user } = req;
      const { group_name, option_name, display_order, email_templates } = body;
      const name = uuidV4();
      const ExchangeCurrencyOptions = email_templates.map(item => {
        return {
          name,
          option_name,
          group_name,
          display_order,
          subject: item.subject,
          template: item.template,
          language: item.language,
          created_by: user.id,
        };
      });
      await ExchangeCurrency.bulkCreate(ExchangeCurrencyOptions);

      return res.ok(true);
    }
    catch (error) {
      logger.error('create option fail', error);
      next(error);
    }
  },
  updateExchangeCurrencyOption: async (req, res, next) => {
    let transaction;

    try {
      const { params, body, user } = req;
      const { name } = params;
      const { option_name, display_order, email_templates } = body;
      const ExchangeCurrency = await ExchangeCurrency.findOne({
        where: {
          name,
          language: 'en',
          option_name: { [Op.not]: null },
          deleted_flg: false,
        },
      });
      if (!ExchangeCurrency) {
        return res.badRequest(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: [req.params.name] });
      }

      transaction = await database.transaction();
      await forEach(email_templates, async item => {
        const ExchangeCurrency = await ExchangeCurrency.findOne({
          where: {
            name: name,
            language: item.language,
            deleted_flg: false,
          }
        });

        if (!ExchangeCurrency) {
          const data = {
            ...item,
            name,
            option_name,
            display_order,
            subject: item.subject,
            template: item.template,
            language: item.language,
            created_by: user.id,
          };

          await ExchangeCurrency.create(data, { transaction: transaction });
          return;
        }

        const data = {
          option_name,
          display_order,
          subject: item.subject,
          template: item.template,
          updated_by: user.id,
        };

        await ExchangeCurrency.update(data, {
          where: {
            id: ExchangeCurrency.id,
          },
          returning: true,
          transaction: transaction
        });
      });
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      logger.error('create option fail', error);
      if (transaction) {
        await transaction.rollback();
      }

      next(error);
    }
  },


};
