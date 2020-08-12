const Joi = require('joi');

const schema = Joi.object().keys({
    description: Joi.string().max(1000).required(),
});

module.exports = schema;