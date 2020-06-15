const Joi = require('joi');
const ClaimRequestStatus = require("app/model/wallet/value-object/claim-request-status");

const schema = Joi.object().keys({
  status: Joi.string().valid([ClaimRequestStatus.InProcessing,ClaimRequestStatus.Rejected]).required(),
});

module.exports = schema;