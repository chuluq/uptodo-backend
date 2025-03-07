import {validate} from '../validation/validation.js';
import {
  createTaskValidation,
  getTaskValidation,
} from '../validation/task-validation.js';
import {prismaClient} from '../application/database.js';
import {ResponseError} from '../error/response-error.js';

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
    },
  });
};

const get = async (user, taskId) => {
  taskId = validate(getTaskValidation, taskId);

  const task = await prismaClient.task.findFirst({
    where: {
      username: user.username,
      id: taskId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      priority: true,
      category_id: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!task) {
    throw new ResponseError(404, 'task not found');
  }

  return task;
};

export default {
  create,
  get,
};