const logger = require('app/lib/logger');
const ClaimRequest = require("app/model/wallet").claim_requests;
const Sequelize = require('sequelize');
const affiliateApi = require('app/lib/affiliate-api');
const Op = Sequelize.Op;

module.exports = {
    search: async (req, res, next) => {
        try {
            return res.ok(true);
        } 
        catch (error) {
            logger.info('get claim request list fail',error);
            next(error);
        }
    },
}