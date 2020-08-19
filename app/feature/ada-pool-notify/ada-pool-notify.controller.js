const logger = require('logger');
const AdaPoolNotifyCfs = require('app/model/wallet').ada_pool_notify_cfgs;
const AdaPoolNotifyCfsHis = require('app/model/wallet').ada_pool_notify_cfg_his;

module.exports = {
    get: async (req, res, next) => {
        try {
            const adaPoolNotifyConfig = await AdaPoolNotifyCfs.findOne();
            if (!adaPoolNotifyConfig) {
                return {
                    size: 0,
                    email: ''
                };
            }
            return adaPoolNotifyConfig;
        }
        catch (error) {
            logger.error('get ada pool notification config fail', error);
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            return res.ok(true);
        }
        catch (error) {
            logger.error('update ada pool notification config fail', error);
            next(error);
        }
    },
    getHis: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = query.offset ? parseInt(query.offset) : 0;
            const { count: total, rows: items } = await AdaPoolNotifyCfsHis.findAndCountAll({ limit, offset, order: [['created_at', 'DESC']] });
            return res.ok({
                items: items.length > 0 ? items : [],
                total: total,
                limit: limit,
                offset: offset
            });
        }
        catch (error) {
            logger.error('update ada pool notification config history fail', error);
            next(error);
        }
    }
};
