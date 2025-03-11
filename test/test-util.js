import {prismaClient} from '../src/application/database.js';
import bcrypt from 'bcrypt';

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'test',
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'test',
      password: await bcrypt.hash('rahasia', 10),
      name: 'test',
      token: 'test',
    },
  });
};

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: 'test',
    },
  });
};

export const removeTestCategories = async () => {
  await prismaClient.category.deleteMany({
    where: {
      category: {
        contains: 'test',
      },
    },
  });
};

export const createManyTestCategories = async () => {
  for (let i = 0; i < 10; i++) {
    await prismaClient.category.create({
      data: {
        category: `test ${i + 1}`,
      },
    });
  }
};

export const createTestCategory = async () => {
  await prismaClient.category.create({
    data: {
      category: 'test',
    },
  });
};

export const getTestCategory = async () => {
  return prismaClient.category.findUnique({
    where: {
      category: 'test',
    },
  });
};

export const removeTestTasks = async () => {
  await prismaClient.task.deleteMany({
    where: {
      username: 'test',
    },
  });
};

export const createTestTask = async () => {
  const category = await getTestCategory();
  await prismaClient.task.create({
    data: {
      title: 'test',
      description: 'test description',
      deadline: '2025-03-07T07:02:49.341Z',
      priority: 1,
      category_id: category.id,
      username: 'test',
    },
  });
};

export const getTestTask = async () => {
  return prismaClient.task.findFirst({
    where: {
      username: 'test',
    },
  });
};

export const createManyTestTask = async () => {
  const category = await getTestCategory();
  for (let i = 0; i < 15; i++) {
    await prismaClient.task.create({
      data: {
        title: `test ${i + 1}`,
        description: 'test description',
        deadline: '2025-03-07T07:02:49.341Z',
        priority: 1,
        category_id: category.id,
        username: 'test',
      },
    });
  }
};