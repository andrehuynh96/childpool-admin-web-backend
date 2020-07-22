const nodemailer = require('nodemailer');
const config = require('app/config');
const path = require("path");
const ejs = require('ejs');
const EmailTemplate = require('email-templates');


let transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

transporter.getMailTemplate = async (template, data) => {
  const email = new EmailTemplate({
    render: (template, locals) => {
      return new Promise(async (resolve, reject) => {
        let html = ejs.render(template, locals);
        email.juiceResources(html).then(html => resolve(html)).catch(e => reject(e))
      })
    }
  });
  const mailContent = await email.render(template, data);
  return mailContent;
}

transporter.sendWithTemplate = async function (
  subject,
  from,
  to,
  data,
  template
) {
  let mailContent = await transporter.getMailTemplate(template, data);
  return await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: mailContent
  });
};


module.exports = transporter;
