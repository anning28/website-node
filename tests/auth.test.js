const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/User');

jest.setTimeout(60000);

const credentials = {
  email: 'user@example.com',
  password: 'password123'
};

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '7d';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('auth API', () => {
  test('registers a user, hashes the password, and returns a token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(credentials)
      .expect(201);

    expect(response.body.user).toMatchObject({ email: credentials.email });
    expect(response.body.user.passwordHash).toBeUndefined();
    expect(response.body.token).toEqual(expect.any(String));

    const savedUser = await User.findOne({ email: credentials.email }).select('+passwordHash');
    expect(savedUser.passwordHash).not.toBe(credentials.password);
    expect(savedUser.passwordHash).toMatch(/^\$2[aby]\$/);
  });

  test('rejects duplicate email registration', async () => {
    await request(app).post('/api/auth/register').send(credentials).expect(201);

    const response = await request(app)
      .post('/api/auth/register')
      .send(credentials)
      .expect(409);

    expect(response.body.message).toBe('Email is already registered');
  });

  test('logs in with a valid email and password', async () => {
    const passwordHash = await bcrypt.hash(credentials.password, 12);
    await User.create({ email: credentials.email, passwordHash });

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);

    expect(response.body.user).toMatchObject({ email: credentials.email });
    expect(response.body.user.passwordHash).toBeUndefined();
    expect(response.body.token).toEqual(expect.any(String));
  });

  test('rejects login with an incorrect password', async () => {
    const passwordHash = await bcrypt.hash(credentials.password, 12);
    await User.create({ email: credentials.email, passwordHash });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrongpass123' })
      .expect(401);

    expect(response.body.message).toBe('Email or password is incorrect');
  });

  test('deletes the authenticated account', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(credentials)
      .expect(201);

    await request(app)
      .delete('/api/auth/me')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .expect(204);

    const deletedUser = await User.findOne({ email: credentials.email });
    expect(deletedUser).toBeNull();
  });

  test('rejects account deletion without a valid token', async () => {
    await request(app).delete('/api/auth/me').expect(401);

    await request(app)
      .delete('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});
