const Joi = require('joi');
const UserStatus = require("app/model/wallet/value-object/user-status");
const status = Object.keys(UserStatus);

const schema = Joi.object().keys({
  user_sts: Joi.string().valid(status).required(),
  role_id: Joi.number().required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  name: Joi.string().required(),
});

module.exports = schema;