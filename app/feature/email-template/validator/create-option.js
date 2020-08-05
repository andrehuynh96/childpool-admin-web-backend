const Joi = require('joi');
const groupName = require('app/model/wallet/value-object/email-template-groupname');
const GroupNameList = Object.values(groupName);
const schema = Joi.object().keys({
    subject: Joi.string().max(1000).required(),
    template: Joi.string().required(),
    group_name: Joi.string().valid(GroupNameList).required(),
    display_order: Joi.number().allow('').allow(null).optional()
});

module.exports = schema;