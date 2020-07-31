const nodemailer = require('nodemailer');
const config = require('app/config');
const path = require("path");
const ejs = require('ejs');
const EmailTemplate = require('email-templates');

// https://stackoverflow.com/questions/37567148/unable-to-verify-the-first-certificate-in-node-js
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

transporter.getMailDBTemplate = async (template, data) => {
  const email = new EmailTemplate({
    render: (template, locals) => {
      return new Promise((resolve, reject) => {
        let html = ejs.render(template, locals);

        email.juiceResources(html).then(html => resolve(html)).catch(e => reject(e));
      });
    }
  });

  const mailContent = await email.render(template, data);
  return mailContent;
};

transporter.sendWithDBTemplate = async function (
  subject,
  from,
  to,
  data,
  template
) {
  console.log(data.note)
  let mailContent = await transporter.getMailDBTemplate(template, data);
console.log(mailContent);
  return await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: mailContent
  });
};

transporter.getMailTemplate = async (data, fileName) => {
  let root = path.resolve(
    __dirname + "../../../../public/email-template/"
  );
  const email = new EmailTemplate({
    views: { root, options: { extension: 'ejs' } }
  });
  const mailContent = await email.render(fileName, data);
  return mailContent;
};

transporter.sendWithTemplate = async function (
  subject,
  from,
  to,
  data,
  templateFile
) {
  let mailContent = await transporter.getMailTemplate(data, templateFile);
  return await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: mailContent
  });
};

module.exports = transporter;
