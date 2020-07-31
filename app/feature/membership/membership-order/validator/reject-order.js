const Joi = require('joi');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type');
const EmailTemplateGroupName = require('app/model/wallet/value-object/email-template-groupname');
const emailTemplateTypes = Object.values(EmailTemplateType);
const reasonTemplates = emailTemplateTypes.map(item => {
    if (item.startsWith(EmailTemplateGroupName.MEMBERSHIP_ORDER_REJECTED_REASON)){
        return item;
    }
}).filter(value => value);

const schema = Joi.object().keys({
    template: Joi.string().valid(reasonTemplates).optional(),
    note: Joi.string().allow("").allow(null).optional()
});

module.exports = schema;