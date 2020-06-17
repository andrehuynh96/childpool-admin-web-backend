const Joi = require('joi');

const schema = Joi.object().keys({
  membership_type_free_membership_flg: Joi.boolean().optional(),
  membership_type_upgrade_paid_member_flg: Joi.boolean().optional(),
  upgrade_to_membership_type_id: Joi.string().optional()
});

module.exports = schema;