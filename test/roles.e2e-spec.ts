import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Roles and permissions API (e2e)', () => {
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
    await cleanDatabase();
  }, 20_000);

  afterEach(cleanDatabase);

  afterAll(async () => {
    await app?.close();
  });

  it('creates access-control records and assigns them through both join tables', async () => {
    const role = await request(app.getHttpServer())
      .post('/roles')
      .send({ name: 'Administrator', description: 'Full CRM access' })
      .expect(201);

    const permission = await request(app.getHttpServer())
      .post('/permissions')
      .send({ name: 'users.read', module: 'users', description: 'Read users' })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/roles/${role.body.id}/permissions/${permission.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/roles/${role.body.id}/permissions`)
      .expect(200)
      .expect(({ body }) =>
        expect(body).toEqual([
          expect.objectContaining({
            id: permission.body.id,
            module: 'users',
            name: 'users.read',
          }),
        ]),
      );

    const user = await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'a-secure-password',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/users/${user.body.id}/roles/${role.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/users/${user.body.id}/roles`)
      .expect(200)
      .expect(({ body }) =>
        expect(body).toEqual([
          expect.objectContaining({ id: role.body.id, name: 'Administrator' }),
        ]),
      );

    await expect(
      dataSource.query(
        'SELECT role_id, permission_id FROM role_permissions WHERE role_id = $1',
        [role.body.id],
      ),
    ).resolves.toHaveLength(1);
    await expect(
      dataSource.query(
        'SELECT user_id, role_id FROM user_roles WHERE user_id = $1',
        [user.body.id],
      ),
    ).resolves.toHaveLength(1);
  });

  async function cleanDatabase(): Promise<void> {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE users, roles, permissions CASCADE');
    }
  }
});
