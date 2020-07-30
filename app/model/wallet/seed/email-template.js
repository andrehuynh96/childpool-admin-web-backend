const fs = require('fs');
const path = require("path");
const _ = require("lodash");
const logger = require('app/lib/logger');
const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateTypes = require('app/model/wallet/value-object/email-template-type');
const EmailTemplateGroupNames = require('app/model/wallet/value-object/email-template-groupname');
const config = require('app/config');

let EMAIL_TEMPLATE_PATH = path.join(__dirname, "../../../../public/email-template/", _.toLower(config.emailTemplate.partnerName));

module.exports = async () => {
    const emailTemplates = [
        {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_APPROVED,
            locale: 'en',
            subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-approved-en/subject.ejs'), 'utf-8'),
            template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-approved-en/html.ejs'), 'utf-8'),
        },
        {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED,
            locale: 'en',
            subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-en/subject.ejs'), 'utf-8'),
            template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-en/html.ejs'), 'utf-8'),
            group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON
        },
        {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED_REASON_OPTION_1,
            locale: 'en',
            subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/option-1/subject.ejs'), 'utf-8'),
            template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/option-1/html.ejs'), 'utf-8'),
            group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON
        },
        {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED_REASON_OPTION_2,
            locale: 'en',
            subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/option-2/subject.ejs'), 'utf-8'),
            template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/option-2/html.ejs'), 'utf-8'),
            group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON
        }
    ];

    for (let item of emailTemplates) {
        const emailTemplate = await EmailTemplate.findOne({
            where: {
                name: item.name,
                language: item.locale,
            }
        });

        if (!emailTemplate) {
            const data = {
                ...item,
                language: item.locale,
            };

            await EmailTemplate.create(data, { returning: true });
        }
    }

    logger.info('Seeding email templates completed.');
};
