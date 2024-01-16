const Joi = require("joi");

const phoneRegExp = /^\(\d{3}\) \d{3}-\d{4}$/;

const addSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({ "any.required": `missing required "name" field ` }),
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": `missing required "email" field` }),
  phone: Joi.string()
    .pattern(phoneRegExp)
    .required()
    .messages({ "any.required": `missing required "phone" field` }),
  favorite: Joi.boolean(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": `missing field "favorite"` }),
});

module.exports = { addSchema, updateSchema, updateFavoriteSchema };
