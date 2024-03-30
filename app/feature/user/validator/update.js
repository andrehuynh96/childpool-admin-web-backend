const Joi = require('joi');
const UserStatus = require("app/model/wallet/value-object/user-status");
const status = Object.keys(UserStatus);

const schema = Joi.object().keys({
  user_sts: Joi.string().valid(status).required(),
  role_id: Joi.number().required(),
  name: Joi.string().required(),
  country_code: Joi.string().allow(null).max(100).optional(),
});

module.exports = schema;
