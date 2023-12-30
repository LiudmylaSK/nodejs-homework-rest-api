const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string()
    .trim()
    .replace(/[^\d]+/g, "")
    .min(10)
    .max(15)
    .required(),
});

const updateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30),
  email: Joi.string().trim().email(),
  phone: Joi.string()
    .trim()
    .replace(/[^\d]+/g, "")
    .min(10)
    .max(15),
})
  .min(1)
  .max(3)
  .options({ allowUnknown: true, presence: "optional" });

module.exports = { addSchema, updateSchema };
