import {prismaClient} from '../src/application/database.js';

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'test',
    },
  });
};