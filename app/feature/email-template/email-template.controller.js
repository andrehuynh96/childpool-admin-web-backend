const logger = require('app/lib/logger');
const EmailTemplate = require('app/model/wallet').email_templates;
const mapper = require("app/feature/response-schema/email-template.response-schema");
module.exports = {
    getAll: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const { count: total, rows: items } = await EmailTemplate.findAndCountAll({
                limit,
                offset,
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
            logger.error('get email template list fail', error);
            next(error);
        }
    },
    getDetail: async (req, res, next) => {
        try {
            const emailTemplate = await EmailTemplate.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (!emailTemplate) {
                return res.badRequest(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ['id'] });
            }
            return res.ok(emailTemplate);
        }
        catch (error) {
            logger.error('get email template detail fail', error);
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { body, params } = req;
            const emailTemplate = await EmailTemplate.findOne({
                where: {
                    id: params.id
                }
            });

            if (!emailTemplate) {
                return res.badRequest(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ['id'] });
            }

            await EmailTemplate.update(
                {
                    subject: body.subject,
                    template: body.template
                },
                {
                    where: {
                        id: emailTemplate.id
                    },
                    returning: true
                });
        }
        catch (error) {
            logger.error('update email template fail', error);
            next(error);
        }
    }
};
