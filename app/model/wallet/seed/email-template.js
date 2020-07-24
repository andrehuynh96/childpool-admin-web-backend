const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateTypes = require('app/model/wallet/value-object/email-template-type');
const fs = require('fs');
const logger = require('app/lib/logger');
const path = require("path");

module.exports = async () => {
    const emailNames = Object.values(EmailTemplateTypes);
    let root = path.resolve(
        __dirname + "../../../../../public/email-template/moonstake/"
    );
    const data = [{
        name: EmailTemplateTypes.MEMBERSHIP_ORDER_APPROVED,
        subject: 'Membership payment',
        template: fs.readFileSync(path.join(root, 'membership-order-approved.ejs'), 'utf-8'),
    }, {
        name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED,
        subject: 'Membership payment',
        template: fs.readFileSync(path.join(root, 'membership-order-rejected.ejs'), 'utf-8'),
    }];

    for (let item of emailNames) {
        const emailTemplate = await EmailTemplate.findAll({
            where: {
                name: item,
                language: ['en', 'jp']
            }
        });
        if (emailTemplate.length === 0) {
            const unavailableEmail = data.find(x => x.name === item);
            const emailTemplateData = [{
                ...unavailableEmail, language: 'en'
            }, {
                ...unavailableEmail, language: 'jp'
            }];
            
            await EmailTemplate.bulkCreate(emailTemplateData,{ returning:true });
            logger.info('insert email template');
        }
    }
};
