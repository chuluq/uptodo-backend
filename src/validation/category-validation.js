import Joi from 'joi';

const createCategoryValidation = Joi.object({
  category: Joi.string().max(100).required(),
});

export {
  createCategoryValidation,
};