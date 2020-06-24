const logger = require('app/lib/logger');
const { affiliateApi } = require('app/lib/affiliate-api');

module.exports = {
    search: async (req, res, next) => {
        try {
            const result = await affiliateApi.searchCaculateRewardRequest(req.query);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (error) {
            logger.info('search caculate reward request fail', error);
            next(error);
        }
    },
    getDetail: async (req, res, next) => {
        try {
            const result = await affiliateApi.getCaculateRewardRequestDetail(req.params.requestId);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (error) {
            logger.info('search caculate reward request fail', error);
            next(error);
        }
    },
};
