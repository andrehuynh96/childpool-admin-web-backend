const logger = require('app/lib/logger');
const affiliateApi = require('app/lib/affiliate-api');

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const result = await affiliateApi.getAllAffiliatePolicy(req.query.limit,req.query.offset);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        } 
        catch (error) {
            logger.info('get affiliate policy list fail',error);
            next(error);
        }
    },
};
