const logger = require('app/lib/logger');
const Term = require('app/model/wallet').terms;
const moment = require('moment');
const Hashids = require('hashids/cjs');
module.exports = {
    getAll: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;

            const { count: total, rows: items } = await Term.findAndCountAll({
                limit,
                offset,
                order: [['created_at', 'DESC']]
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
            const { term_no } = req.params;

            const term = await Term.findOne({
                where: {
                    term_no: term_no
                }
            });

            if (!term) {
                return res.badRequest(res.__("TERM_NOT_FOUND"), "TERM_NOT_FOUND", { field: ['term_no'] });
            }
            return res.ok(term);
        }
        catch (error) {
            logger.error('Get term detail fail', error);
            next();
        }

    },
    create: async (req, res, next) => {
        try {
            const data = req.body;

            if (data.applied_date) {
                if (moment(data.applied_date).toDate() <= moment().toDate()) {
                    return res.badRequest(res.__("APPLIED_DATE_MUST_BE_GREATER_THAN_TODAY"), "APPLIED_DATE_MUST_BE_GREATER_THAN_TODAY", { field: ['applied_date'] });
                }
                data.applied_date = moment(data.applied_date).toDate();

            }
            let term_no = null;
            let term = null;
            do {
                let salt = `${Date.now().toString()}-${req.user.id}`;
                let hashids = new Hashids(salt, 8);
                term_no = hashids.encode(1, 2, 3, 4).toUpperCase();

                term = await Term.findOne({ where: { term_no: term_no } });
            } while (term);
            data.term_no = term_no;
            data.created_by = req.user.id;
            data.updated_by = req.user.id;

            const termResponse = await Term.create(data, { returning: true });
            return res.ok(termResponse);
        }
        catch (error) {
            logger.error('Create term fail', error);
            next();
        }
    },
    update: async (req, res, next) => {
        try {
            const { params, body } = req;
            const term = await Term.findOne({
                where: {
                    term_no: params.term_no
                }
            });

            if (!term) {
                return res.badRequest(res.__("TERM_NOT_FOUND"), "TERM_NOT_FOUND", { field: ['term_no'] });
            }
            const data = {
                content: body.content,
                is_published: body.is_published,
                updated_by: req.user.id
            };
            if (body.applied_date) {
                if (moment(body.applied_date).toDate() <= moment().toDate()) {
                    return res.badRequest(res.__("APPLIED_DATE_MUST_BE_GREATER_THAN_TODAY"), "APPLIED_DATE_MUST_BE_GREATER_THAN_TODAY", { field: ['applied_date'] });
                }
                data.applied_date = moment(body.applied_date).toDate();

            }

            const [_, termResponse] = await Term.update(
                data,
                {
                    where: {
                        term_no: term.term_no
                    },
                    returning: true
                });
            return res.ok(termResponse[0]);
        }
        catch (error) {
            logger.error('Update term fail', error);
            next();
        }
    },
};
