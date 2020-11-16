const Joi = require('joi');
const FiatTransactionStatus = require('app/model/wallet/value-object/fiat-transaction-status');
const PaymentMethod = require('app/model/wallet/value-object/payment-method');
const statuses = Object.values(FiatTransactionStatus);
const paymentMethods = Object.values(PaymentMethod);

const schema = Joi.object().keys({
  offset: Joi.number().min(0).required(),
  limit: Joi.number().greater(0).required(),
  from_date: Joi.date().allow('').allow(null).optional(),
  to_date: Joi.date().allow('').allow(null).optional(),
  email: Joi.string().allow('').allow(null).max(100).optional(),
  from_currency: Joi.date().allow('').allow(null).optional(),
  to_cryptocurrency: Joi.date().allow('').allow(null).optional(),
  payment_method: Joi.valid(paymentMethods).allow('').allow(null).optional(),
  status: Joi.string().valid(statuses).allow('').allow(null).optional()
});

module.exports = schema;
