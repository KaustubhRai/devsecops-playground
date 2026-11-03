import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/database/db';

beforeAll(async () => {
  await db.init();
});

describe('Auth & Items API', () => {
  let token: string;

  it('registers a user', async () => {
    const res = await request(app).post('/auth/register').send({ username: 'alice', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('alice');
  });

  it('logs in', async () => {
    const res = await request(app).post('/auth/login').send({ username: 'alice', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(401);
  });

  it('creates an item', async () => {
    const res = await request(app).post('/items').set('Authorization', `Bearer ${token}`).send({ name: 'Item 1', description: 'desc' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Item 1');
  });

  it('lists items', async () => {
    const res = await request(app).get('/items').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
