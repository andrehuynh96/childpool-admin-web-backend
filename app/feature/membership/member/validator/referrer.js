const Joi = require('joi');

const schema = Joi.object().keys({
    referrerCode: Joi.string().min(1).max(20).required(),
});

module.exports = schema;