const logger = require('app/lib/logger');
const ClaimRequest = require("app/model/wallet").claim_requests;
const affiliateApi = require('app/lib/affiliate-api');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    search: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const where = {};
            if (query.from) {
                fromDate = moment(query.from).toDate();
                where.created_at= {
                    [Op.gt]: fromDate
                };
            } 
            if (query.to) {
                toDate = moment(query.to).toDate();
                where.created_at[Op.lt]= toDate
            }
            if (query.email) where.email = { [Op.iLike]: `%${req.query.email}%` };
            if (query.payment) where.type= query.payment;
            if (query.status) where.status= query.status;
            if (query.cryptoPlatform) where.currency_symbol = query.cryptoPlatform;
            console.log(where)
            const { count: total, rows: items } = await ClaimRequest.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });
            
            return res.ok({
                items: items && items.length > 0 ? items : [],
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
}