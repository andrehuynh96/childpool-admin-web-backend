const _ = require('lodash');
const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const Notification = require('app/model/wallet').notifications;
const NotificationType = require("app/model/wallet/value-object/notification-type");
const NotificationEvent = require("app/model/wallet/value-object/notification-event");
const mapper = require("app/feature/response-schema/notification.response-schema");

const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const keyword = _.trim(query.keyword);
      const cond = {};
      const orCond = [];

      if (keyword) {
        orCond.push({
          title: { [Op.iLike]: `%${keyword}%` }
        });

        orCond.push({
          title_ja: { [Op.iLike]: `%${keyword}%` }
        });

        orCond.push({
          content: { [Op.iLike]: `%${keyword}%` }
        });

        orCond.push({
          content_ja: { [Op.iLike]: `%${keyword}%` }
        });
      }

      if (orCond.length) {
        cond[Op.or] = orCond;
      }

      if (query.type) {
        cond.type = query.type;
      }

      if (query.event) {
        cond.event = query.event;
      }

      const { count: total, rows: items } = await Notification.findAndCountAll({
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
      logger.error('Search notifications fail', error);
      next(error);
    }
  },
  getDetails: async (req, res, next) => {
    try {
      const { params } = req;
      const notification = await Notification.findOne({
        where: {
          id: params.notificationId,
        }
      });

      if (!notification) {
        return res.badRequest(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND", { fields: ['id'] });
      }

      return res.ok(mapper(notification));
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
          id: params.notificationId,
        },
        returning: true,
      });

      if (!numOfItems) {
        return res.badRequest(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND");
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
  getNotificationEvents: async (req, res, next) => {
    try {
      const result = Object.entries(NotificationEvent).map(items => {
        return {
          value: items[1],
          label: items[0],
        };
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get NotificationEvent fail', error);
      next(error);
    }
  },

};
