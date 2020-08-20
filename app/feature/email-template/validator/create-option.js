const Joi = require('joi');
const groupName = require('app/model/wallet/value-object/email-template-groupname');
const GroupNameList = Object.values(groupName);
const schema = Joi.object().keys({
  option_name: Joi.string().max(256).required(),
  group_name: Joi.string().valid(GroupNameList).required(),
  display_order: Joi.number().allow(null).optional(),
  email_templates: Joi.array().items(
    Joi.object().keys({
      subject: Joi.string().max(1000).required(),
      template: Joi.string().required(),
      language: Joi.string().max(20).required()
    }
    ).required()
  ).required()
});

module.exports = schema;
