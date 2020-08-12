const Joi = require('joi');

const schema = Joi.object().keys({
    note: Joi.string().allow("").allow(null).optional()
});

module.exports = schema;