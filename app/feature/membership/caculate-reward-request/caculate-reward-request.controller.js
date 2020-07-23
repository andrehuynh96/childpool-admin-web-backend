const logger = require('app/lib/logger');
const { affiliateApi } = require('app/lib/affiliate-api');
const CaculateRewardRequestStatus = require('app/model/wallet/value-object/caculate-reward-request-status');
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
            logger.info('get caculate reward request detail', error);
            next(error);
        }
    },
    getDetailList: async (req, res, next) => {
        try {
            const { query, params } = req;
            const requestId = params.requestId;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const result = await affiliateApi.getCaculateRewardRequestDetailList(requestId,limit, offset);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        }
        catch (error) {
            logger.info('get caculate reward request detail list fail', error);
            next(error);
        }
    },
    getStatus: async (req, res, next) => {
        try {
            const caculateRewardRequestStatus = Object.entries(CaculateRewardRequestStatus);
            const dropdownList = [];
            caculateRewardRequestStatus.forEach(item => {
                dropdownList.push({
                    label: item[0],
                    value: item[1]
                });
            });
            return res.ok(dropdownList);
        } catch (error) {
            logger.info('get caculate reward request status list fail', error);
            next(error);
        }
    },
    getRewardList: async (req, res, next) => {
        try {
            const { params } = req;
            const { requestId } = params;
            const result = await affiliateApi.getRewardsByRequestId(requestId);
            if (result.httpCode !== 200) {
                return res.status(result.httpCode).send(result.data);
            }
            return res.ok(result.data);
        } 
        catch (error) {
            logger.info('get reward list fail', error);
            next(error);
        }
    }
};
