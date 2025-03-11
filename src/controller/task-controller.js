import taskService from '../service/task-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await taskService.create(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const taskId = req.params.taskId;
    const result = await taskService.get(user, taskId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const taskId = req.params.taskId;
    const request = req.body;
    request.id = taskId;
    const result = await taskService.update(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const taskId = req.params.taskId;
    await taskService.remove(user, taskId);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const user = req.user;
    const request = {
      title: req.query.title,
      page: req.query.page,
      size: req.query.size,
    };

    const result = await taskService.search(user, request);
    res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  get,
  update,
  remove,
  search,
};