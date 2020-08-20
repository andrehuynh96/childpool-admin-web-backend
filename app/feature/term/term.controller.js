const logger = require('app/lib/logger');
const Term = require('app/model/wallet').terms;
module.exports = {
    getAll: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;

            const { count: total, rows: items } = await Term.findAndCountAll({
                limit,
                offset,
                order: [['created_at','DESC']]
            });
            return res.ok({
                items: items.length > 0 ? items : [],
                limit: limit,
                offset: offset,
                total: total
            });
        }
        catch (error) {
            logger.error('Get all term fail', error);
            next();
        }
    },
    getDetail: async (req, res, next) => {
        try {
            const { id } = req.params;

            const term = await Term.findOne({
                where: {
                    id: id
                }
            });

            if (!term) {
                return res.badRequest(res.__("TERM_NOT_FOUND"),"TERM_NOT_FOUND",{ field: ['id'] });
            }
            return res.ok(term);
        }
        catch (error) {
            logger.error('Get term detail fail', error);
            next();
        }

    },
    create: async (req, res, next) => {
        return res.ok();
    },
    update: async (req, res, next) => {
        return res.ok();
    },
};
