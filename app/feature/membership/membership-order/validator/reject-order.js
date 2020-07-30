const Joi = require('joi');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type');
const emailTemplateType = Object.keys(EmailTemplateType);
const schema = Joi.object().keys({
    template: Joi.string().valid(emailTemplateType).optional(),
    note: Joi.string().allow("").allow(null).optional()
});

module.exports = schema;