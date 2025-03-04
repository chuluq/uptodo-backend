import supertest from 'supertest';
import {web} from '../src/application/web.js';
import {createTestUser, removeTestUser} from './test-util.js';
import {logger} from '../src/application/logging.js';

describe('POST /api/users', () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it('should register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'test',
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.password).toBeUndefined();
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: '',
      name: '',
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if user exists', async () => {
    let result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'test',
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'test',
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should login user', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'rahasia',
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe('test');
  });

  it('should reject user if request is invalid', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: '',
      password: '',
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject user if password is wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'salah',
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject user if username is wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'salah',
      password: 'rahasia',
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should get current user',async () => {
    const result = await supertest(web).get('/api/users/current').set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
  });

  it('should reject if token is invalid',async () => {
    const result = await supertest(web).get('/api/users/current').set('Authorization', 'salah');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});