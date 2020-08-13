const Joi = require('joi');

const schema = Joi.object().keys({
  template: Joi.string().allow("").allow(null).max(500).optional(),
  note: Joi.string().allow("").allow(null).optional(),
});

module.exports = schema;
