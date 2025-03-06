import {
  createTestUser,
  removeTestCategories,
  removeTestUser,
} from './test-util.js';
import supertest from 'supertest';
import {web} from '../src/application/web.js';
import {logger} from '../src/application/logging.js';

describe('POST /api/categories', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestCategories();
    await removeTestUser();
  });

  it('should create new category', async () => {
    const result = await supertest(web).
        post('/api/categories').
        set('Authorization', 'test').
        send({
          category: 'test',
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.category).toBe('test');
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web).
        post('/api/categories').
        set('Authorization', 'test').
        send({
          category: '',
        });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if unauthorized', async () => {
    const result = await supertest(web).
        post('/api/categories').
        set('Authorization', 'salah').
        send({
          category: 'test',
        });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});