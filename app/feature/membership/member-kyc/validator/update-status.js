const Joi = require('joi');

const schema = Joi.object().keys({
  status: Joi.string().valid(['APPROVED', 'DECLINED', 'INSUFFICIENT']).required(),
  note: Joi.string().allow("").allow(null).max(4000).optional(),
});

module.exports = schema;