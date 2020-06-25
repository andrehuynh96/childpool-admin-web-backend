const logger = require('app/lib/logger');
const ClaimRequest = require("app/model/wallet").claim_requests;
const ClaimRequestStatus = require("app/model/wallet/value-object/claim-request-status");
const { membershipApi } = require('app/lib/affiliate-api');
const database = require('app/lib/database').db().wallet;
const Member = require("app/model/wallet").members;
const moment = require('moment');
const mapper = require("app/feature/response-schema/claim-request.response-schema");
const Sequelize = require('sequelize');
const stringify = require('csv-stringify');
const Op = Sequelize.Op;
const PaymentType = require("app/model/wallet/value-object/claim-request-payment-type");
const Platform = require("app/model/wallet/value-object/platform");
const blockchainHelpper = require('app/lib/blockchain-helpper');

module.exports = {
    search: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const where = {};
            let fromDate, toDate;
            if (query.from_date || query.to_date) {
                where.created_at = {};
            }
            if (query.from_date) {
                fromDate = moment(query.from_date).toDate();
                where.created_at[Op.gte] = fromDate;
            }
            if (query.to_date) {
                toDate = moment(query.to_date).add(1, 'minute').toDate();
                where.created_at[Op.lt] = toDate;
            }
            if (fromDate && toDate && fromDate >= toDate) {
                return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
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
            const memberCond = {
                deleted_flg: false
            };
            if (query.email) {
                memberCond.email = { [Op.iLike]: `%${query.email}%` };
            }
            console.log(memberCond);
            const { count: total, rows: items } = await ClaimRequest.findAndCountAll({
                limit,
                offset,
                include: [
                    {
                        attributes: ['email'],
                        as: "Member",
                        model: Member,
                        where: memberCond,
                        required: true
                    }
                ],
                where: where,
                order: [['created_at', 'DESC']]
            });

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
    getDetail: async (req, res, next) => {
        try {
            const claimRequest = await ClaimRequest.findOne({
                include: [
                    {
                        attributes: ['email'],
                        as: "Member",
                        model: Member,
                        where: {
                            deleted_flg: false
                        },
                        required: true
                    }
                ],
                where: {
                    id: req.params.claimRequestId
                }
            });

            if (!claimRequest) {
                return res.badRequest(res.__("CLAIM_REQUEST_NOT_FOUND"), "CLAIM_REQUEST_NOT_FOUND", { field: ['claimRequestId'] });
            }
            claimRequest.explorer_link = blockchainHelpper.getUrlTxid(claimRequest.txid, claimRequest.currency_symbol);
            return res.ok(mapper(claimRequest));
        }
        catch (error) {
            logger.info('get claim request detail fail', error);
            next(error);
        }
    },
    updateTxid: async (req, res, next) => {
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
           await ClaimRequest.update(
                { txid: body.txid },
                {
                    where: {
                        id: claimRequest.id
                    }
                }
            );
            return res.ok(true);
        }
        catch (error) {
            logger.info('update claim request tx_id fail', error);
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

            const transaction = await database.transaction();
            try {
                await ClaimRequest.update(
                    { status: body.status },
                    {
                        where: {
                            id: claimRequest.id
                        },
                        transaction: transaction,
                        returning: true
                    });

                const result = await membershipApi.updateClaimRequest(claimRequest.affiliate_claim_reward_id, body.status);

                if (result.httpCode !== 200) {
                    await transaction.rollback();

                    return res.status(result.httpCode).send(result.data);
                }

                await transaction.commit();
                return res.ok(true);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        catch (error) {
            logger.info('update claim request fail', error);
            next(error);
        }
    },
    downloadCSV: async (req, res, next) => {
        try {
            const { query } = req;
            const where = {};
            let fromDate, toDate;
            if (query.from_date || query.to_date) {
                where.created_at = {};
            }
            if (query.from_date) {
                fromDate = moment(query.from_date).toDate();
                where.created_at[Op.gte] = fromDate;
            }
            if (query.to_date) {
                toDate = moment(query.to_date).add(1, 'minute').toDate();
                where.created_at[Op.lt] = toDate;
            }
            if (fromDate && toDate && fromDate >= toDate) {
                return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
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
            let memberCond = {
                deleted_flg: false
            };
            if (query.email) {
                memberCond.email = { [Op.iLike]: `%${query.email}%` };
            }
            const items = await ClaimRequest.findAll({
                include: [
                    {
                        attributes: ['email', 'fullname'],
                        as: "Member",
                        model: Member,
                        where: memberCond,
                        required: true
                    }
                ],
                where: where,
                order: [['created_at', 'DESC']]
            });

            items.forEach(element => {
                element.member_email = element.Member.email;
                element.created_at = moment(element.createdAt).format('YYYY-MM-DD HH:mm');
            });
            const data = await stringifyAsync(items, [
                { key: 'id', header: 'Id' },
                { key: 'created_at', header: 'Time' },
                { key: 'member_email', header: 'Email' },
                { key: 'wallet_address', header: 'Wallet Address' },
                { key: 'amount', header: 'Claim Amount' },
                { key: 'currency_symbol', header: 'Crypto Platform' },
                { key: 'status', header: 'Status' },
                { key: 'type', header: 'Payment' }
            ]);
            res.setHeader('Content-disposition', 'attachment; filename=claim-request.csv');
            res.set('Content-Type', 'text/csv');
            res.send(data);
        }
        catch (error) {
            logger.info('download csv fail', error);
            next(error);
        }
    },
    getPaymentType: async (req, res, next) => {
        try {
            return res.ok(PaymentType);
        }
        catch (error) {
            logger.info('get payment type fail', error);
            next(error);
        }
    },
    getCryptoPlatform: async (req, res, next) => {
        try {
            return res.ok(Platform);
        }
        catch (error) {
            logger.info('get crypto platform fail', error);
            next(error);
        }
    }
};

function stringifyAsync(data, columns) {
    return new Promise(function (resolve, reject) {
        stringify(data, {
            header: true,
            columns: columns
        }, function (err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        }
        );
    });
}