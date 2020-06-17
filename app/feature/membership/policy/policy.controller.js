const logger = require('app/lib/logger');
const affiliateApi = require('app/lib/affiliate-api');
module.exports = {
    getAllPolicy: async (req, res, next) => {
        try {
            const result = await affiliateApi.getAllPolicy();
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        } 
        catch (error) {
            logger.info('get policy list fail',error);
            next(error);
        }
    },
    updatePolicy: async (req,res, next) => {
        try {
            const { body, params } = req;
            const policyId = params.policyId;
            const result = await affiliateApi.updatePolicy( policyId, body);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        } catch (error) {
            logger.info('update policy fail',error);
            next(error);
        }
    },
};