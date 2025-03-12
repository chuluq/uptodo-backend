import {validate} from '../validation/validation.js';
import {
  createTaskValidation,
  getTaskValidation, searchTaskValidation, updateTaskValidation,
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
      status: true,
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
      status: true,
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
      status: task.status,
      deadline: task.deadline,
      priority: task.priority,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      deadline: true,
      priority: true,
      category_id: true,
      created_at: true,
      updated_at: true,
    },
  });
};

const remove = async (user, taskId) => {
  taskId = validate(getTaskValidation, taskId);

  const totalTaskInDatabase = await prismaClient.task.count({
    where: {
      username: user.username,
      id: taskId,
    },
  });

  if (totalTaskInDatabase !== 1) {
    throw new ResponseError(404, 'task not found');
  }

  return prismaClient.task.delete({
    where: {
      id: taskId,
    },
  });
};

const search = async (user, request) => {
  request = validate(searchTaskValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  filters.push({
    username: user.username,
  });

  if (request.title) {
    filters.push(
        {
          title: {
            contains: request.title,
          },
        },
    );
  }

  const tasks = await prismaClient.task.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalTask = await prismaClient.task.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: tasks,
    pagination: {
      page: request.page,
      total_item: totalTask,
      total_page: Math.ceil(totalTask / request.size),
    },
  };
};

export default {
  create,
  get,
  update,
  remove,
  search,
};