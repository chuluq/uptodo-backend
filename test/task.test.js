import {
  createTestCategory,
  createTestUser, getTestCategory,
  removeTestCategories, removeTestTasks, removeTestUser,
} from './test-util.js';
import supertest from 'supertest';
import {web} from '../src/application/web.js';
import {logger} from '../src/application/logging.js';

describe('POST /api/tasks', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestCategory();
  });

  afterEach(async () => {
    await removeTestTasks();
    await removeTestCategories();
    await removeTestUser();
  });

  it('should create new task', async () => {
    const category = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'test').
        send({
          title: 'test',
          description: 'test description',
          deadline: '2025-03-07T07:02:49.341Z',
          priority: 1,
          category_id: category.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('test');
    expect(result.body.data.description).toBe('test description');
    expect(result.body.data.category_id).toBe(category.id);
    expect(result.body.data.deadline).toBe('2025-03-07T07:02:49.341Z');
    expect(result.body.data.priority).toBe(1);
  });

  it('should able create new task without priority and deadline', async () => {
    const category = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'test').
        send({
          title: 'test',
          description: 'test description',
          category_id: category.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('test');
    expect(result.body.data.description).toBe('test description');
    expect(result.body.data.category_id).toBe(category.id);
  });

  it('should reject create task if request is invalid', async () => {
    const category = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'test').
        send({
          title: '',
          description: '',
          deadline: '2025-03-07T07:02:49.341Z',
          priority: 1,
          category_id: category.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject create task if user is unauthenticated', async () => {
    const category = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'salah').
        send({
          title: 'test',
          description: 'test description',
          deadline: '2025-03-07T07:02:49.341Z',
          priority: 1,
          category_id: category.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});