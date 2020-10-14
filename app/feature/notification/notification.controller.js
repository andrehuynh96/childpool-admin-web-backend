const _ = require('lodash');
const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Notification = require('app/model/wallet').notifications;
const NotificationDetails = require('app/model/wallet').notification_details;
const NotificationType = require("app/model/wallet/value-object/notification-type");
const NotificationEvent = require("app/model/wallet/value-object/notification-event");
const mapper = require("app/feature/response-schema/notification.response-schema");
const notificationService = require('app/lib/notification');

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
      } else {
        cond.type = {
          [Op.in]: [
            NotificationType.SYSTEM,
            NotificationType.MARKETING,
            NotificationType.NEWS
          ],
        };
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
          deleted_flg: false,
        }
      });

      if (!notification) {
        return res.notFound(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND", { fields: ['id'] });
      }

      return res.ok(mapper(notification));
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
      let notification = await Notification.findOne({
        where: {
          id: params.notificationId,
          deleted_flg: false,
        }
      });

      if (!notification) {
        return res.notFound(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND", { fields: ['id'] });
      }

      if (notification.actived_flg && !body.actived_flg) {
        return res.forbidden(res.__("NOTIFICATION_HAVE_BEEN_PUBLISHED"), "NOTIFICATION_HAVE_BEEN_PUBLISHED");
      }

      const isPublished = !notification.actived_flg && body.actived_flg;
      transaction = await database.transaction();
      // eslint-disable-next-line no-unused-vars
      const [numOfItems, items] = await Notification.update({
        ...body,
        updated_by: user.id,
      }, {
        where: {
          id: params.notificationId,
        },
        returning: true,
        transaction: transaction,
      });

      if (isPublished) {
        notification = items[0];
        await notificationService.publish(notification, transaction);
      }

      await transaction.commit();

      return res.ok(mapper(items[0]));
    }
    catch (error) {
      logger.error('Update notification fail', error);
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
      const notification = await Notification.create(data, { transaction });

      if (notification.actived_flg) {
        await notificationService.publish(notification, transaction);
      }
      await transaction.commit();

      return res.ok(mapper(notification));
    }
    catch (error) {
      logger.error('create notification fail', error);
      await transaction.rollback();

      next(error);
    }
  },
  getNotificationTypes: async (req, res, next) => {
    try {
      const result = [
        NotificationType.SYSTEM,
        NotificationType.NEWS,
        NotificationType.MARKETING,
      ].map(key => {
        return {
          value: key,
          label: NotificationType[key],
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
      const result = Object.entries(NotificationEvent).map(item => {
        return {
          value: item[1],
          label: item[0],
        };
      });

      return res.ok(result);
    }
    catch (error) {
      logger.error('get NotificationEvent fail', error);
      next(error);
    }
  },
  delete: async (req, res, next) => {
    let transaction;

    try {
      const { params, user } = req;
      let notification = await Notification.findOne({
        where: {
          id: params.notificationId,
          deleted_flg: false,
        }
      });

      if (!notification) {
        return res.notFound(res.__("NOTIFICATION_NOT_FOUND"), "NOTIFICATION_NOT_FOUND", { fields: ['id'] });
      }

      transaction = await database.transaction();
      await NotificationDetails.update({
        deleted_flg: true,
        updated_by: user.id,
      }, {
        where: {
          notification_id: notification.id,
        },
        transaction: transaction,
      });
      await Notification.update({
        deleted_flg: true,
        updated_by: user.id,
      }, {
        where: {
          id: notification.id,
        },
        transaction: transaction,
      });
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      logger.error('Delete notification fail', error);
      if (transaction) {
        await transaction.rollback();
      }

      next(error);
    }
  },
};
