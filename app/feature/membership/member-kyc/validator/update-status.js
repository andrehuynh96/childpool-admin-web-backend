const Joi = require('joi');

const schema = Joi.object().keys({
  status: Joi.string().valid(['APPROVED','DECLINED','INSUFFICIENT']).required()
});

module.exports = schema;