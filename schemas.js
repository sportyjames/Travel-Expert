const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().escapeHTML(),
        UserName: Joi.string().required().escapeHTML(),
        DepText: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.flightrouteSchema = Joi.object({
    flightroute: Joi.object({
        date: Joi.string().required().escapeHTML(),
    }).required()
})

module.exports.registerSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().required().escapeHTML(),
    email: Joi.string().email().escapeHTML(),
    departure: Joi.string().required().escapeHTML()
})

