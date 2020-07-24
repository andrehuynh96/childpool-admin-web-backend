const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateTypes = require('app/model/wallet/value-object/email-template-type');
const fs = require('fs');
const path = require("path");
const config = require('app/config');

module.exports = async () => {
    const emailNames = Object.values(EmailTemplateTypes);
    const countEmailTemplates = await EmailTemplate.count({
        where: {
            name: emailNames
        }
    });
    if (countEmailTemplates === 0) {
        let root = path.resolve(
            __dirname + "../../../../../public/email-template/"
        );
        const data = [{
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_APPROVED,
            subject: 'Membership payment',
            template: fs.readFileSync(`${root}/${config.emailTemplate.membershipOrderApproved}`, 'utf-8'),
            language: 'en'
        }, {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED,
            subject: 'Membership payment',
            template: fs.readFileSync(`${root}/${config.emailTemplate.membershipOrderRejected}`, 'utf-8'),
            language: 'en'
        },
        {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_APPROVED,
            subject: 'Membership payment jp',
            template: fs.readFileSync(`${root}/${config.emailTemplate.membershipOrderApproved}`, 'utf-8'),
            language: 'jp'
        }, {
            name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED,
            subject: 'Membership payment jp',
            template: fs.readFileSync(`${root}/${config.emailTemplate.membershipOrderRejected}`, 'utf-8'),
            language: 'jp'
        }];
        await EmailTemplate.bulkCreate(data, { returning: true });
    }
};
