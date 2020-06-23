const logger = require('app/lib/logger');
const { affiliateApi } = require('app/lib/affiliate-api');
const affiliatePolicyTypes = require('app/model/wallet/value-object/affiliate-policy-type');

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
    create: async (req, res, next) => {
        try {
            let result = await affiliateApi.createPolicy(req.body);

            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (err) {
            logger.error("create affiliate policy fail:", err);
            next(err);
        }
    },
    getDetail: async (req, res, next) => {
        try {
            let result = await affiliateApi.getPolicyDetail(req.params.policyId);

            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (err) {
            logger.error("get affiliate policy detail fail:", err);
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            let result = await affiliateApi.updatePolicy(req.params.policyId, req.body);

            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (err) {
            logger.error("update affiliate policy fail:", err);
            next(err);
        }
    },
    getTypes: async (req, res, next) => {
        try {
            const affiliatePolicyTypeArr = Object.entries(affiliatePolicyTypes);
            const result = [];
            affiliatePolicyTypeArr.forEach( item => {
                result.push({ 
                    value: item[0],
                    label: item[1]
                });
            });
            return res.ok(result);
        }
        catch (err) {
            logger.error("get affiliate policy types fail:", err);
            next(err);
        }
    },
};
