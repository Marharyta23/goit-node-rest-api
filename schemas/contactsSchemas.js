import Joi from "joi";

export const createContactSchema = Joi.object({
  owner: Joi.string(),
  name: Joi.string().required().min(2),
  email: Joi.string().email().required().max(50),
  phone: Joi.string().required().min(5),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email().max(50),
  phone: Joi.string().min(5),
  favorite: Joi.boolean(),
}).min(1);

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
