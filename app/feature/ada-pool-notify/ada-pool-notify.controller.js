const logger = require('app/lib/logger');
const AdaPoolNotifyCfg = require('app/model/wallet').ada_pool_notify_cfgs;
const AdaPoolNotifyHis = require('app/model/wallet').ada_pool_notify_his;

module.exports = {
  getOne: async (req, res, next) => {
    try {
      let current = await AdaPoolNotifyCfg.findOne({
        order: [['created_at', 'DESC']]
      });

      if (!current) {
        current = {
          is_enabled: false,
          size: null,
          emails: null,
        };
      }

      return res.ok(current);
    }
    catch (error) {
      logger.error('Get ada_pool_notify_cfg fail', error);
      next();
    }
  },
  getNotificationHistories: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const { count: total, rows: items } = await AdaPoolNotifyHis.findAndCountAll({
        limit,
        offset,
        order: [['created_at', 'ASC']]
      });

      return res.ok({
        items: items && items.length > 0 ? items : [],
        offset: offset,
        limit: limit,
        total: total,
      });
    }
    catch (error) {
      logger.error('Get getNotificationHistories fail', error);
      next();
    }
  },
  update: async (req, res, next) => {
    try {
      const { body } = req;
      let current = await AdaPoolNotifyCfg.findOne({
        order: [['created_at', 'DESC']]
      });

      if (current) {
        current = await AdaPoolNotifyCfg.update({
          size: body.size,
          emails: body.emails,
          is_enabled:body.is_enabled,
          updated_by: req.user.id,
        }, {
          where: {
            id: current.id,
          },
          returning: true,
        });

        return res.ok(true);
      }

      current = await AdaPoolNotifyCfg.create({
        size: body.size,
        emails: body.emails,
        is_enabled:body.is_enabled,
        created_by: req.user.id,
      });

      return res.ok(true);
    }
    catch (error) {
      logger.error('Update ada_pool_notify_cfg fail', error);
      next();
    }
  },
};
