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
      display_order: 0
    },
    // Rejected order
    {
      name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED,
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-en/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON,
    },
    {
      name: 'MEMBERSHIP_ORDER_REJECTED_TIMEOUT_2',
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/timed-out/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/timed-out/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON,
      option_name: 'Time out',
      display_order: 1,
    },
    {
      name: EmailTemplateTypes.CHILDPOOL_ADMIN_KYC_APPROVED,
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-approved-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-approved-en/html.ejs'), 'utf-8'),
    },
    // KYC_INSUFFICIENT
    {
      name: EmailTemplateTypes.CHILDPOOL_ADMIN_KYC_INSUFFICIENT,
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-en/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_INSUFFICIENT_OPTION,
    },
    {
      name: 'CHILDPOOL_ADMIN_KYC_INSUFFICIENT_OPTION_1_2',
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_INSUFFICIENT_OPTION,
      option_name: 'Option 1',
      display_order: 1,
    },
    {
      name: 'CHILDPOOL_ADMIN_KYC_INSUFFICIENT_OPTION_2_2',
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-option/option-2/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-option/option-2/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_INSUFFICIENT_OPTION,
      option_name: 'Option 2',
      display_order: 2,
    },
    // KYC Declined
    {
      name: EmailTemplateTypes.CHILDPOOL_ADMIN_KYC_DECLINED,
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-en/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_DECLINED_OPTION,
    },
    {
      name: 'CHILDPOOL_ADMIN_KYC_DECLINED_OPTION_1_2',
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_DECLINED_OPTION,
      option_name: 'Option 1',
      display_order: 1,
    },
    {
      name: 'CHILDPOOL_ADMIN_KYC_DECLINED_OPTION_2_2',
      locale: 'en',
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-2/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-2/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_DECLINED_OPTION,
      option_name: 'Option 2',
      display_order: 2,
    },

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
