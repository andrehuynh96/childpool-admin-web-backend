const logger = require('app/lib/logger');
const AdaPoolNotifyCfg = require('app/model/wallet').ada_pool_notify_cfgs;

module.exports = {
  getOne: async (req, res, next) => {
    try {
      let current = await AdaPoolNotifyCfg.findOne({
        order: [['created_at', 'DESC']]
      });

      if (!current) {
        current = new AdaPoolNotifyCfg();
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
      let current = await AdaPoolNotifyCfg.findOne({
        order: [['created_at', 'DESC']]
      });

      if (!current) {
        current = new AdaPoolNotifyCfg();
      }

      return res.ok(current);
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
