import {validate} from '../validation/validation.js';
import {
  createTaskValidation,
  getTaskValidation, updateTaskValidation,
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

const update = async (user, request) => {
  const task = validate(updateTaskValidation, request);

  const totalTaskInDatabase = await prismaClient.task.count({
    where: {
      username: user.username,
      id: task.id,
    },
  });

  if (totalTaskInDatabase !== 1) {
    throw new ResponseError(404, 'task not found');
  }

  return prismaClient.task.update({
    where: {
      id: task.id,
    },
    data: {
      category_id: task.category_id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
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
    }
  })
};

export default {
  create,
  get,
  update
};