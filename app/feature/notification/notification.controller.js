const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const Notification = require('app/model/wallet').notifications;
const NotificationType = require("app/model/wallet/value-object/notification-type");
// const NotificationEvent = require("app/model/wallet/value-object/notification-event");
const mapper = require("app/feature/response-schema/notification.response-schema");

const Op = Sequelize.Op;
const EXCHANGE_CURRENCY_STATUS_TEXT_CACHE = Object.entries(NotificationType).reduce((result, items) => {
  result[items[1]] = items[0];

  return result;
}, {});

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

      if (query.symbol) {
        cond.symbol = { [Op.iLike]: `%${query.symbol}%` };
      }

      if (query.platform) {
        cond.platform = query.platform;
      }

      if (query.status) {
        cond.status = query.status;
      }

      const { count: total, rows: items } = await Notification.findAndCountAll({
        limit,
        offset,
        where: cond,
        order: [['created_at', 'DESC']]
      });

      const result = items.map(item => {
        return {
          ...mapper(item),
          status_text: EXCHANGE_CURRENCY_STATUS_TEXT_CACHE[item.status],
        };
      });

      return res.ok({
        items: result,
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
      const { params } = req;
      const exchangeCurrency = await Notification.findOne({
        where: {
          id: params.exchangeCurrencyId,
        }
      });

      if (!exchangeCurrency) {
        return res.badRequest(res.__("EXCHANGE_CURRENCY_NOT_FOUND"), "EXCHANGE_CURRENCY_NOT_FOUND", { fields: ['id'] });
      }

      exchangeCurrency.statusText = EXCHANGE_CURRENCY_STATUS_TEXT_CACHE[exchangeCurrency.status];

      return res.ok(mapper(exchangeCurrency));
    }
    catch (error) {
      logger.error('get exchange currency details fail', error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { params, body, user } = req;
      const [numOfItems, items] = await Notification.update({
        ...body,
        updated_by: user.id,
      }, {
        where: {
          id: params.exchangeCurrencyId,
        },
        returning: true,
      });

      if (!numOfItems) {
        return res.badRequest(res.__("EXCHANGE_CURRENCY_NOT_FOUND"), "EXCHANGE_CURRENCY_NOT_FOUND");
      }

      return res.ok(mapper(items[0]));
    }
    catch (error) {
      logger.error('update exchange currency fail', error);
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { body, user } = req;
      const data = {
        ...body,
        deleted_flg: false,
        created_by: user.id,
      };
      const notification = await Notification.create(data);

      return res.ok(mapper(notification));
    }
    catch (error) {
      logger.error('create notification fail', error);
      next(error);
    }
  },
  getNotificationTypes: async (req, res, next) => {
    try {
      const result = Object.entries(NotificationType).map(items => {
        return {
          value: items[1],
          label: items[0],
        };
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get getNotificationTypes fail', error);
      next(error);
    }
  },

};
