import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Auth API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  const testUser = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    password: 'a-secure-password',
  };

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-auth-e2e';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    await dataSource.query('TRUNCATE TABLE users CASCADE');
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE users CASCADE');
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('logs in with valid credentials and returns tokens', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(loginResponse.body.accessToken).toBeDefined();
    expect(loginResponse.body.accessToken.accessToken).toBeDefined();
    expect(loginResponse.body.accessToken.refreshToken).toBeDefined();
    expect(loginResponse.body.user).toMatchObject({
      email: testUser.email,
      id: expect.any(String),
    });
  });

  it('returns 401 for invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrong-password' })
      .expect(401);
  });

  it('returns 401 for missing token on protected route', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('returns current user for a valid access token', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    const accessToken = loginResponse.body.accessToken.accessToken;

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) =>
        expect(body).toMatchObject({
          email: testUser.email,
          id: expect.any(String),
        }),
      );
  });

  it('returns 401 for an invalid/expired token', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('refreshes tokens with a valid refresh token', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    const refreshToken = loginResponse.body.accessToken.refreshToken;

    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(refreshResponse.body.accessToken).toBeDefined();
    expect(refreshResponse.body.refreshToken).toBeDefined();
  });

  it('signs up a new user and returns tokens', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        password: 'SecurePass123',
      })
      .expect(201);

    expect(signupResponse.body.accessToken.accessToken).toBeDefined();
    expect(signupResponse.body.accessToken.refreshToken).toBeDefined();
    expect(signupResponse.body.user).toMatchObject({
      email: 'grace@example.com',
      id: expect.any(String),
    });
  });

  it('returns 409 for a duplicate email on signup', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        password: 'SecurePass123',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        password: 'SecurePass123',
      })
      .expect(409);
  });

  it('returns 400 for invalid signup input', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        firstName: '',
        lastName: '',
        email: 'not-an-email',
        password: 'short',
      })
      .expect(400);
  });
});
