import supertest from 'supertest';
import {web} from '../src/application/web.js';
import {createTestUser, getTestUser, removeTestUser} from './test-util.js';
import {logger} from '../src/application/logging.js';
import bcrypt from 'bcrypt';

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

  it('should get current user', async () => {
    const result = await supertest(web).
        get('/api/users/current').
        set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
  });

  it('should reject if token is invalid', async () => {
    const result = await supertest(web).
        get('/api/users/current').
        set('Authorization', 'salah');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should update user', async () => {
    const result = await supertest(web).
        patch('/api/users/current').
        set('Authorization', 'test').
        send({
          name: 'Chuluq',
          password: 'rahasiagaksih',
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('Chuluq');

    const user = await getTestUser();
    expect(await bcrypt.compare('rahasiagaksih', user.password)).toBe(true);
  });

  it('should update user name', async () => {
    const result = await supertest(web).
        patch('/api/users/current').
        set('Authorization', 'test').
        send({
          name: 'Chuluq',
        });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('Chuluq');
  });

  it('should update user password', async () => {
    const result = await supertest(web).
        patch('/api/users/current').
        set('Authorization', 'test').
        send({
          password: 'rahasiagaksih',
        });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');

    const user = await getTestUser();
    expect(await bcrypt.compare('rahasiagaksih', user.password)).toBe(true);
  });

  it('should reject update user if request is invalid', async () => {
    const result = await supertest(web).
        patch('/api/users/current').
        set('Authorization', 'salah').
        send({});

    expect(result.status).toBe(401);
  });
});

describe('DELETE /api/users/logout', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should logout user', async () => {
    const result = await supertest(web).
        delete('/api/users/logout').
        set('Authorization', 'test');
    expect(result.status).toBe(204);
    expect(result.body.data).toBeUndefined();

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it('should reject logout if request is invalid', async () => {
    const result = await supertest(web).
        delete('/api/users/logout').
        set('Authorization', 'salah');
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});