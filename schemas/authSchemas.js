const Joi = require("joi");

const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userRegisterSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "password is too short",
    "any.required": `missing required "password" field`,
  }),

  email: Joi.string().pattern(emailRegExp).required().messages({
    "any.required": `missing required "email" field`,
    "string.pattern.base": "email address is invalid",
  }),

  subscription: Joi.string(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

const userLoginSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": `missing required "password" field` }),

  email: Joi.string()
    .pattern(emailRegExp)
    .required()
    .messages({ "any.required": `missing required "email" field` }),
});

const userSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const authSchemas = {
  userRegisterSchema,
  emailSchema,
  userLoginSchema,
  userSubscriptionSchema,
};

module.exports = authSchemas;
