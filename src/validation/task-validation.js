import Joi from 'joi';

const createTaskValidation = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(255).required(),
  deadline: Joi.date().optional(),
  priority: Joi.number().positive().optional(),
  category_id: Joi.number().positive().required(),
});

const getTaskValidation = Joi.number().positive().required();

const updateTaskValidation = Joi.object({
  id: Joi.number().positive().required(),
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(255).required(),
  deadline: Joi.date().optional(),
  priority: Joi.number().positive().optional(),
  category_id: Joi.number().positive().required(),
});

const searchTaskValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).max(100).positive().default(10),
  title: Joi.string().optional(),
});

export {
  createTaskValidation,
  getTaskValidation,
  updateTaskValidation,
  searchTaskValidation,
};