const Joi = require('joi');

const schema = Joi.object().keys({
  title: Joi.string().max(5000).required(),
  description: Joi.string().max(5000).allow('').allow(null).optional(),
  content: Joi.string().required(),
  title_ja: Joi.string().max(5000).optional(),
  content_ja: Joi.string().optional(),
  type: Joi.string().max(32).required(),
  event: Joi.string().max(32).required(),
  actived_flg: Joi.boolean().required(),
  sent_all_flg: Joi.boolean().required(),
});

module.exports = schema;
