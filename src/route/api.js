import express from 'express';
import userController from '../controller/user-controller.js';
import {authMiddleware} from '../middleware/auth-middleware.js';
import categoryController from '../controller/category-controller.js';
import taskController from '../controller/task-controller.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Category API
userRouter.post('/api/categories', categoryController.create);
userRouter.get('/api/categories', categoryController.get);

// Task API
userRouter.post('/api/tasks', taskController.create);

export {
  userRouter,
};