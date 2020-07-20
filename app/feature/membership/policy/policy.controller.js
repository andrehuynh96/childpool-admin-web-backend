const logger = require('app/lib/logger');
const { membershipApi } = require('app/lib/affiliate-api');
module.exports = {
    getAllPolicies: async (req, res, next) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset) : 0;
            const result = await membershipApi.getAllPolicies(limit,offset);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }

            return res.ok(result.data);
        }
        catch (error) {
            logger.info('get policy list fail', error);
            next(error);
        }
    },
    updatePolicy: async (req, res, next) => {
        try {
            const { body, params } = req;
            const policyId = params.policyId;
            const result = await membershipApi.updatePolicy(policyId, body);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }

            return res.ok(result.data);
        } catch (error) {
            logger.info('update policy fail', error);
            next(error);
        }
    },
};