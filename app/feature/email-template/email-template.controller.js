const logger = require('app/lib/logger');
const EmailTemplate = require('app/model/wallet').email_templates;

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const emailTemplates = await EmailTemplate.findAll();
            return res.ok(emailTemplates);
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
