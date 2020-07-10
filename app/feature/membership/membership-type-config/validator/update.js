const Joi = require('joi');

const schema = Joi.object().keys({
  membership_type_free_membership_flg: Joi.boolean().optional(),
  membership_type_upgrade_paid_member_flg: Joi.boolean().optional(),
  items: Joi.array().optional().items(
    Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      is_enabled: Joi.boolean().required(),
    })
  )
});

module.exports = schema;