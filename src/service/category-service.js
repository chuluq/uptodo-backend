import {validate} from '../validation/validation.js';
import {createCategoryValidation} from '../validation/category-validation.js';
import {prismaClient} from '../application/database.js';

const create = async (request) => {
  const category = validate(createCategoryValidation, request);

  return prismaClient.category.create({
    data: category,
    select: {
      id: true,
      category: true,
    },
  });
};

export default {
  create,
};