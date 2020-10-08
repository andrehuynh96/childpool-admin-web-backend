const nodemailer = require('nodemailer');
const config = require('app/config');
const logger = require('app/lib/logger');
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const uuidV4 = require('uuid/v4');
const EmailTemplate = require('email-templates');
const EmailTemplateModel = require('app/model/wallet').email_templates;
const EmailLoggingModel = require('app/model/wallet').email_loggings;
const BlacklistEmailModel = require('app/model/wallet').blacklist_emails;
const EmailLoggingStatus = require('app/model/wallet/value-object/email-logging-status');

const TEMPLATES_PATH = path.resolve(__dirname + "../../../../public/email-template/");

class EmailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      ignoreTLS: config.smtp.ignoreTLS,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
  }

  getRawTemplate(templateFile) {
    return fs.readFileSync(path.join(TEMPLATES_PATH, templateFile), { encoding: 'utf8', flag: 'r' });
  }

  async getMailContentFromCustomTemplate(template, data) {
    const email = new EmailTemplate({
      render: (template, locals) => {
        return new Promise((resolve, reject) => {
          try {
            const options = { delimiter: '_', openDelimiter: '$', closeDelimiter: '$' };
            const html = ejs.render(template, locals, options);

            resolve(html);
          } catch (err) {
            logger.error(err);
            reject(err);
          }
        });
      }
    });

    const mailContent = await email.render(template, data);

    return mailContent;
  }

  async sendWithDBTemplate(
    subject,
    from,
    to,
    data,
    template
  ) {
    let mailContent = await this.getMailContentFromCustomTemplate(template, data);

    return this.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: mailContent
    });
  }

  async getMailTemplate(data, fileName) {
    const email = new EmailTemplate({
      views: {
        root: TEMPLATES_PATH,
        options: { extension: 'ejs' }
      }
    });
    const mailContent = await email.render(fileName, data);

    return mailContent;
  }

  async sendWithTemplate(
    subject,
    from,
    to,
    data,
    templateFile
  ) {
    let mailContent = await this.getMailTemplate(data, templateFile);

    return this.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: mailContent
    });
  }

  async findEmailTemplate(templateName, language) {
    let template = await EmailTemplateModel.findOne({
      where: {
        name: templateName,
        language: language
      }
    });

    if (!template && language !== 'en') {
      template = await EmailTemplateModel.findOne({
        where: {
          name: templateName,
          language: 'en'
        }
      });
    }

    if (!template) {
      logger.info(`Not found template: ${templateName}`);
    }

    return template;
  }

  async sendMail(mailOptions) {
    const id = uuidV4();
    const email = mailOptions.to;
    const subject = mailOptions.subject;
    const body = mailOptions.html;
    logger.info('Send email to', email);
    const isInBlacklist = await BlacklistEmailModel.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
    if (isInBlacklist) {
      logger.warn(`Email ${email} is in blacklist.`);
      return;
    }

    const trackingHost = config.webWallet.apiUrl;
    const url = `${trackingHost}/web/email-trackings/${id}`;
    const image = `<br /><img src="${url}" width="0" height="0" style="display:block" />`;

    mailOptions.html = mailOptions.html + image;
    let mailMessageId = null;

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          logger.error(err);
          EmailLoggingModel.create({
            id,
            email,
            subject,
            body,
            num_of_views: 0,
            status: EmailLoggingStatus.Failed,
            error_message: err.message,
            sent_result: null,
            mail_message_id: mailMessageId,
          });

          return reject(err);
        }

        // logger.info('Message sent: ' + info.response);
        mailMessageId = info.messageId;

        EmailLoggingModel.create({
          id,
          email,
          subject,
          body,
          num_of_views: 0,
          status: EmailLoggingStatus.Success,
          error_message: null,
          sent_result: JSON.stringify(info, null, 2),
          mail_message_id: mailMessageId,
        });

        return resolve(info);
      });
    });
  }

}

const emailService = new EmailService();

module.exports = emailService;
