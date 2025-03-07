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