import supertest from 'supertest';
import {web} from '../src/application/web.js';
import {removeTestUser} from './test-util.js';
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