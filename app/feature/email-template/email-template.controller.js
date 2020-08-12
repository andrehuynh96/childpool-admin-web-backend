const logger = require('app/lib/logger');
const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateGroupNames = require('app/model/wallet/value-object/email-template-groupname');
const mapper = require("app/feature/response-schema/email-template.response-schema");
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const cond = {
        language: 'en',
        deleted_flg: false,
        option_name: null,
      };
      const { count: total, rows: items } = await EmailTemplate.findAndCountAll({
        limit,
        offset,
        where: cond,
        order: [['created_at', 'DESC']]
      });

      const groupNames = _.uniq(items.filter(item => item.group_name).map(item => item.group_name));
      const emailTemplateOptions = await EmailTemplate.findAll({
        where: {
          deleted_flg: false,
          group_name: { [Op.in]: groupNames },
          option_name: { [Op.not]: null }
        },
      });
      const result = [];

      items.forEach((item, index) => {
        item.no = index + 1;
        result.push(mapper(item));

        if (item.group_name) {
          const emailTemplateOptions2 = emailTemplateOptions.filter(emailTemplateOption => emailTemplateOption.group_name === item.group_name);

          emailTemplateOptions2.forEach(emailTemplateOption => {
            result.push(mapper(emailTemplateOption));
          });

          result.push({ is_add_button: true, group_name: item.group_name });
        }
      });

      return res.ok({
        items: result,
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
          name: req.params.name,
          deleted_flg: false
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
            language: item.language,
            deleted_flg: false
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
  },
  getEmailTemplatesByGroupName: async (req, res, next) => {
    try {
      const emailTemplates = await EmailTemplate.findAll({
        where: {
          group_name: req.params.groupName,
          deleted_flg: false
        }
      });

      return res.ok(emailTemplates);
    }
    catch (error) {
      logger.error('get email template by group name fail', error);
      next(error);
    }
  },
  getGroupName: async (req, res, next) => {
    try {
      const data = [];
      for (let [label, value] of Object.entries(EmailTemplateGroupNames)) {
        data.push({
          label: label,
          value: value
        });
      }
      return res.ok(data);
    }
    catch (error) {
      logger.error('get group name list fail', error);
      next(error);
    }
  },
  createEmailTemplateOption: async (req, res, next) => {
    try {
      const { body, user } = req;
      const { group_name, display_order, email_templates } = body;
      const name = uuidV4();
      const emailTemplateOptions = email_templates.map(item => {
        return {
          name,
          group_name,
          display_order,
          subject: item.subject,
          template: item.template,
          language: item.language,
          created_by: user.id,
        };
      });
      await EmailTemplate.bulkCreate(emailTemplateOptions);

      return res.ok(true);
    }
    catch (error) {
      logger.error('create option fail', error);
      next(error);
    }
  },
  duplicateEmailTemplateOption: async (req, res, next) => {
    try {
      const emailTemplates = await EmailTemplate.findAll({
        where: {
          name: req.params.name
        },
        raw: true
      });
      if (emailTemplates.length == 0) {
        return res.badRequest(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: [req.params.name] });
      }
      const data = [];
      emailTemplates.forEach(item => {
        delete item.id;
        item.subject = `${item.subject} - Duplicate`;
        data.push(item);
      });
      await EmailTemplate.bulkCreate(data);
      return res.ok(true);
    }
    catch (error) {
      logger.error('create option fail', error);
      next(error);
    }
  },
  deleteEmailTemplateOption: async (req, res, next) => {
    try {
      const name = req.params.name;
      const emailTemplate = await EmailTemplate.findAll({
        where: {
          name: name,
          group_name: { [Op.not]: null }
        }
      });

      if (!emailTemplate) {
        return res.badRequest(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ['id'] });
      }

      await EmailTemplate.update({
        deleted_flg: true
      }, {
        where: {
          name: name
        }
      });
      return res.ok(true);
    }
    catch (error) {
      logger.error('delete email template fail', error);
      next(error);
    }
  }
};
