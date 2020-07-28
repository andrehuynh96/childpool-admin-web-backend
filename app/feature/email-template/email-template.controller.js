const logger = require('app/lib/logger');
const EmailTemplate = require('app/model/wallet').email_templates;
const mapper = require("app/feature/response-schema/email-template.response-schema");
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const Op = Sequelize.Op;
module.exports = {
    getAll: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const cond = {
                language: 'en'
            };
            const { count: total, rows: items } = await EmailTemplate.findAndCountAll({
                limit,
                offset,
                where: cond,
                order: [['created_at', 'DESC']]
            });
            return res.ok({
                items: mapper(items),
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
            const emailTemplate = await EmailTemplate.findAll({
                where: {
                    name: req.params.name
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
        let transaction;
        try {
            const { body } = req;
            const emailTemplates = body.email_templates;
            transaction = await database.transaction();
            for (let item of emailTemplates) {
                const emailTemplate = await EmailTemplate.findOne({
                    where: {
                        name: item.name,
                        language: item.language
                    }
                });
                if (emailTemplate) {
                    await EmailTemplate.update(
                        {
                            subject: item.subject,
                            template: item.template
                        },
                        {
                            where: {
                                name: item.name,
                                language: item.language
                            },
                            returning: true,
                            transaction: transaction
                        });
                }
                else {
                    await EmailTemplate.create(
                        item,
                        { transaction: transaction });
                }
            }
            transaction.commit();
            return res.ok(true);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            logger.error('update email template fail', error);
            next(error);
        }
    }
};
