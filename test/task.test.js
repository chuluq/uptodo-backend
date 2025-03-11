import {
  createTestCategory, createTestTask,
  createTestUser, getTestCategory, getTestTask,
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
    const testCategory = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'test').
        send({
          title: 'test',
          description: 'test description',
          deadline: '2025-03-07T07:02:49.341Z',
          priority: 1,
          category_id: testCategory.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('test');
    expect(result.body.data.description).toBe('test description');
    expect(result.body.data.category_id).toBe(testCategory.id);
    expect(result.body.data.deadline).toBe('2025-03-07T07:02:49.341Z');
    expect(result.body.data.priority).toBe(1);
  });

  it('should able create new task without priority and deadline', async () => {
    const testCategory = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'test').
        send({
          title: 'test',
          description: 'test description',
          category_id: testCategory.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('test');
    expect(result.body.data.description).toBe('test description');
    expect(result.body.data.category_id).toBe(testCategory.id);
  });

  it('should reject create task if request is invalid', async () => {
    const testCategory = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'test').
        send({
          title: '',
          description: '',
          deadline: '2025-03-07T07:02:49.341Z',
          priority: 1,
          category_id: testCategory.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject create task if user is unauthenticated', async () => {
    const testCategory = await getTestCategory();

    const result = await supertest(web).
        post('/api/tasks').
        set('Authorization', 'salah').
        send({
          title: 'test',
          description: 'test description',
          deadline: '2025-03-07T07:02:49.341Z',
          priority: 1,
          category_id: testCategory.id,
        });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/tasks/:taskId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestCategory();
    await createTestTask();
  });

  afterEach(async () => {
    await removeTestTasks();
    await removeTestCategories();
    await removeTestUser();
  });

  it('should get detail task', async () => {
    const testTask = await getTestTask();

    logger.info(testTask);

    const result = await supertest(web).
        get('/api/tasks/' + testTask.id).
        set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testTask.id);
    expect(result.body.data.title).toBe(testTask.title);
    expect(result.body.data.description).toBe(testTask.description);
    expect(result.body.data.deadline).toBe(testTask.deadline.toISOString());
    expect(result.body.data.priority).toBe(testTask.priority);
    expect(result.body.data.category_id).toBe(testTask.category_id);
  });

  it('should reject if task is not found', async () => {
    const testTask = await getTestTask();

    const result = await supertest(web).
        get('/api/tasks/' + (testTask.id + 1)).
        set('Authorization', 'test');

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PUT /api/tasks/:taskId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestCategory();
    await createTestTask();
  });

  afterEach(async () => {
    await removeTestTasks();
    await removeTestCategories();
    await removeTestUser();
  });

  it('should update existing task', async () => {
    const testTask = await getTestTask();

    const result = await supertest(web).
        put('/api/tasks/' + testTask.id).
        set('Authorization', 'test').
        send({
          title: 'task title',
          description: 'task description',
          deadline: '2025-03-10T07:02:49.341Z',
          priority: 5,
          category_id: testTask.category_id,
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testTask.id);
    expect(result.body.data.title).toBe('task title');
    expect(result.body.data.description).toBe('task description');
    expect(result.body.data.deadline).toBe('2025-03-10T07:02:49.341Z');
    expect(result.body.data.priority).toBe(5);
    expect(result.body.data.category_id).toBe(testTask.category_id);
  });

  it('should reject update if request is invalid',async () => {
    const testTask = await getTestTask();

    const result = await supertest(web).
        put('/api/tasks/' + testTask.id).
        set('Authorization', 'test').
        send({
          title: 'task title',
          description: '',
          deadline: '2025-03-10T07:02:49.341Z',
          priority: 5,
          category_id: '',
        });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject update if task is not found',async () => {
    const testTask = await getTestTask();

    const result = await supertest(web).
        put('/api/tasks/' + (testTask.id + 1)).
        set('Authorization', 'test').
        send({
          title: 'task title',
          description: 'task description',
          deadline: '2025-03-10T07:02:49.341Z',
          priority: 5,
          category_id: testTask.category_id,
        });

    logger.info(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});