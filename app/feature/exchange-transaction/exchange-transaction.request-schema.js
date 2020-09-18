const Joi = require('joi');
const ExchangeTransactionStatus = require('app/model/wallet/value-object/exchange-transaction-status');
const Status = Object.values(ExchangeTransactionStatus);
const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  email: Joi.string().allow('').allow(null).max(100).optional(),
  from_date: Joi.date().allow('').allow(null).optional(),
  to_date: Joi.date().allow('').allow(null).optional(),
  from_currency: Joi.string().allow('').allow(null).max(100).optional(),
  to_currency: Joi.string().allow('').allow(null).max(100).optional(),
  status: Joi.string().valid(Status).allow('').allow(null).optional(),
});

module.exports = schema;
