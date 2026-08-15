import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Users API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';

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

  it('creates, reads, and deletes a persisted user', async () => {
    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'a-secure-password',
      })
      .expect(201);

    expect(created.body).toMatchObject({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      status: 'active',
    });
    expect(created.body.passwordHash).toBeUndefined();

    await request(app.getHttpServer())
      .get(`/users/${created.body.id}`)
      .expect(200)
      .expect(({ body }) => expect(body.email).toBe('ada@example.com'));

    await request(app.getHttpServer())
      .delete(`/users/${created.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/users/${created.body.id}`)
      .expect(404);
  });

  it('returns a conflict for a duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'a-secure-password',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Ada',
        lastName: 'Byron',
        email: 'ADA@example.com',
        password: 'another-secure-password',
      })
      .expect(409)
      .expect(({ body }) =>
        expect(body).toMatchObject({ code: 'EmailAlreadyInUseError' }),
      );
  });

  it('updates and lists persisted users', async () => {
    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'a-secure-password',
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/users/${created.body.id}`)
      .send({
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        phone: '+12025550123',
        timezone: 'America/New_York',
      })
      .expect(200)
      .expect(({ body }) =>
        expect(body).toMatchObject({
          id: created.body.id,
          firstName: 'Grace',
          lastName: 'Hopper',
          email: 'grace@example.com',
          phone: '+12025550123',
        }),
      );

    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: created.body.id,
              email: 'grace@example.com',
            }),
          ]),
        ),
      );
  });

  it('rejects an invalid request body', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: '',
        lastName: '',
        email: 'not-an-email',
        password: 'short',
        unknown: true,
      })
      .expect(400);
  });
});
