const logger = require('app/lib/logger');
const { affiliateApi } = require('app/lib/affiliate-api');

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const result = await affiliateApi.getAllPolicies(limit, offset);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (error) {
            logger.info('get affiliate policy list fail', error);
            next(error);
        }
    },
};
