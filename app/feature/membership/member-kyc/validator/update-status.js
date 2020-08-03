const Joi = require('joi');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
const kycStatusValue = Object.keys(KycStatus);
const schema = Joi.object().keys({
  status: Joi.string().valid(kycStatusValue).required()
});

module.exports = schema;