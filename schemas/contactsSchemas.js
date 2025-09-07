import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?[0-9\s\-()]{7,20}$/)
    .required(),
  favorite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[0-9\s\-()]{7,20}$/),
  favorite: Joi.boolean(),
}).min(1);

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
