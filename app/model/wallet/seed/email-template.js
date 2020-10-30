const fs = require('fs');
const path = require("path");
const _ = require("lodash");
const { forEach } = require('p-iteration');
const logger = require('app/lib/logger');
const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateTypes = require('app/model/wallet/value-object/email-template-type');
const EmailTemplateGroupNames = require('app/model/wallet/value-object/email-template-groupname');
const config = require('app/config');
const Sequelize = require('sequelize');

const EMAIL_TEMPLATE_PATH = path.join(__dirname, "../../../../public/email-template/", _.toLower(config.emailTemplate.partnerName));
const WEB_WALLET_EMAIL_NAMES = [
  'WEB_WALLET_TRANSACTION_RECEIVED',
  'WEB_WALLET_TRANSACTION_SENT',
  'WEB_WALLET_VERIFY_EMAIL',
  'WEB_WALLET_RESET_PASSWORD',
  'WEB_WALLET_DEACTIVE_ACCOUNT',
  'WEB_WALLET_REFERRAL',
];
const DEFAULT_LOCALE = 'en';

module.exports = async () => {
  const emailTemplates = [
    // Membership order approved
    {
      name: EmailTemplateTypes.MEMBERSHIP_ORDER_APPROVED,
      display_name: 'Membership order approved',
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-approved-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-approved-en/html.ejs'), 'utf-8'),
      display_order: 0
    },
    // Membership order rejected
    {
      name: EmailTemplateTypes.MEMBERSHIP_ORDER_REJECTED,
      display_name: 'Membership order rejected',
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-en/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON,
    },
    {
      name: 'V2_CP_MEMBERSHIP_ORDER_REJECTED_TIMEOUT_2',
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/timed-out/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/timed-out/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON,
      option_name: 'Time out',
      display_order: 1,
    },
    {
      name: 'V2_CP_MEMBERSHIP_ORDER_REJECTED_OPTION_1_2',
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/option-1/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './membership-order-rejected-reason-en/option-1/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBERSHIP_ORDER_REJECTED_REASON,
      option_name: 'Insufficient Funds',
      display_order: 2,
    },
    // KYC approved
    {
      name: EmailTemplateTypes.CHILDPOOL_ADMIN_KYC_APPROVED,
      display_name: 'KYC approved',
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-approved-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-approved-en/html.ejs'), 'utf-8'),
    },
    // KYC insufficient
    {
      name: EmailTemplateTypes.CHILDPOOL_ADMIN_KYC_INSUFFICIENT,
      display_name: 'KYC insufficient',
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-en/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_INSUFFICIENT_OPTION,
    },
    {
      name: 'V2_CP_KYC_INSUFFICIENT_OPTION_1_2',
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_INSUFFICIENT_OPTION,
      option_name: 'Option 1',
      display_order: 1,
    },
    {
      name: 'V2_CP_KYC_INSUFFICIENT_OPTION_2_2',
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-option/option-2/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-insufficient-option/option-2/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_INSUFFICIENT_OPTION,
      option_name: 'Option 2',
      display_order: 2,
    },
    // KYC Declined
    {
      name: EmailTemplateTypes.CHILDPOOL_ADMIN_KYC_DECLINED,
      display_name: 'KYC Declined',
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-en/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-en/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_DECLINED_OPTION,
    },
    {
      name: 'V2_CP_KYC_DECLINED_OPTION_1_2',
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-1/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_DECLINED_OPTION,
      option_name: 'Files not accepted',
      display_order: 1,
    },
    {
      name: 'V2_CP_KYC_DECLINED_OPTION_2_2',
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-2/subject.ejs'), 'utf-8'),
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './kyc-declined-option/option-2/html.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.MEMBER_KYC_DECLINED_OPTION,
      option_name: 'Poor image quality',
      display_order: 2,
    },
    {
      name: EmailTemplateTypes.MS_POINT_NOTIFICATION_ADD_POINT_STAKING,
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: "Bonus Point Staking",
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './point-notification/staking.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.POINT_NOTIFICATION,
      display_order: 2,
    },
    {
      name: EmailTemplateTypes.MS_POINT_NOTIFICATION_ADD_POINT_EXCHANGE,
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: "Bonus Point Exchange",
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './point-notification/exchange.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.POINT_NOTIFICATION,
      display_order: 2,
    },
    {
      name: EmailTemplateTypes.MS_POINT_NOTIFICATION_ADD_POINT_UPGRADE_MEMBERSHIP,
      display_name: null,
      locale: DEFAULT_LOCALE,
      subject: "Bonus Point Upgrade Membership",
      template: fs.readFileSync(path.join(EMAIL_TEMPLATE_PATH, './point-notification/upgrade-membership.ejs'), 'utf-8'),
      group_name: EmailTemplateGroupNames.POINT_NOTIFICATION,
      display_order: 2,
    },
  ];

  await forEach(WEB_WALLET_EMAIL_NAMES, async (name) => {
    await EmailTemplate.update(
      {
        display_name: _.capitalize(_.replace(name, /_/g, ' ')),
      },
      {
        where: {
          name,
          display_name: null,
        }
      });
  });

  await forEach(emailTemplates, async item => {
    const emailTemplate = await EmailTemplate.findOne({
      where: {
        name: item.name,
        language: item.locale,
      }
    });

    if (!emailTemplate) {
      const data = [
        {
          ...item,
          language: item.locale,
        },
        {
          ...item,
          language: 'ja',
        },
      ];

      await EmailTemplate.bulkCreate(data);
    }
  });

  logger.info('Seeding email templates completed.');
};
