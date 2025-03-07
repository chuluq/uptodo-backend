import {validate} from '../validation/validation.js';
import {createTaskValidation} from '../validation/task-validation.js';
import {prismaClient} from '../application/database.js';

const create = async (user, request) => {
  const task = validate(createTaskValidation, request);
  task.username = user.username;

  return prismaClient.task.create({
    data: task,
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      priority: true,
      category_id: true,
      created_at: true,
      updated_at: true,
    }
  });
};

export default {
  create,
}