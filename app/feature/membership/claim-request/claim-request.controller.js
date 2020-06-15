const logger = require('app/lib/logger');
const ClaimRequest = require("app/model/wallet").claim_requests;
const ClaimRequestStatus = require("app/model/wallet/value-object/claim-request-status");
const affiliateApi = require('app/lib/affiliate-api');
const database = require('app/lib/database').db().wallet;
const moment = require('moment');
const mapper = require("app/feature/response-schema/claim-request.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    search: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const where = {};
            if (query.from_date) {
                const fromDate = moment(query.from_date).toDate();
                where.created_at = {
                    [Op.gt]: fromDate
                };
                if (query.to_date) {
                    const toDate = moment(query.to_date).toDate();
                    where.created_at[Op.lt] = toDate
                    if (fromDate > toDate) {
                        return res.badRequest(res.__("TO_DATE_INVALID"), "TO_DATE_INVALID", { field: ['from_date', 'to_date'] });
                    }
                }
            }
            if (query.email) {
                where.email = { [Op.iLike]: `%${query.email}%` };
            }
            if (query.payment) {
                where.type = { [Op.iLike]: `${query.payment}` };
            }
            if (query.status) {
                where.status = { [Op.iLike]: `${query.status}` };
            }
            if (query.crypto_platform) {
                where.currency_symbol = { [Op.iLike]: `${query.crypto_platform}` };
            }

            const { count: total, rows: items } = await ClaimRequest.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });

            return res.ok({
                items: mapper(items) && items.length > 0 ? mapper(items) : [],
                offset: offset,
                limit: limit,
                total: total
            });
        }
        catch (error) {
            logger.info('get claim request list fail', error);
            next(error);
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            const { body, params } = req;
            const claimRequest = await ClaimRequest.findOne({
                where: {
                    id: params.claimRequestId
                }
            });

            if (!claimRequest) {
                return res.badRequest(res.__("CLAIM_REQUEST_NOT_FOUND"), "CLAIM_REQUEST_NOT_FOUND", { field: ['claimRequestId'] });
            }

            if (claimRequest.status !== ClaimRequestStatus.Pending) {
                return res.badRequest(res.__("CAN_NOT_APPROVE_REJECT_CLAIM_REQUEST"), "CAN_NOT_APPROVE_REJECT_CLAIM_REQUEST", { field: ['claimRequestId'] });
            }
            let transaction = await database.transaction();
            try {
                await ClaimRequest.update(
                    { status: body.status },
                    {
                      where: {
                        id: claimRequest.id
                      },
                      returning: true
                    },{ transaction });
    
                let result = await affiliateApi.updateClaimRequest(claimRequest.affiliate_claim_reward_id, body.status);
    
                if (result.httpCode == 200) {
                    await transaction.commit();
                    return res.ok(true);
                }
                else {
                    await transaction.rollback();
                }
                return res.status(result.httpCode).send(result.data);
                
            } 
            catch (error) {
                await transaction.rollback();
                throw error
            }
        }
        catch (error) {
            logger.info('update claim request fail', error);
            next(error);
        }
    },
}