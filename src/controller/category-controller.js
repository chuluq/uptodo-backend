import categoryService from '../service/category-service.js';

const create = async (req, res, next) => {
  try {
    const result = await categoryService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await categoryService.get();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  get,
};