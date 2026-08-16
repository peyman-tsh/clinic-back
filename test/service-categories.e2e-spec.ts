import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Service Categories API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let clinicId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-service-categories-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics, service_categories CASCADE');
    }

    const clinicRes = await request(app.getHttpServer())
      .post('/clinics')
      .send({ name: 'Glow Beauty Clinic E2E' })
      .expect(201);

    clinicId = clinicRes.body.id;
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE service_categories CASCADE');
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics, service_categories CASCADE');
    }
    if (app) {
      await app.close();
    }
  });

  it('POST /service-categories creates a new category with auto-generated slug', async () => {
    const response = await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId,
        name: 'Injectables & Fillers',
        description: 'Botox and fillers',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.clinicId).toBe(clinicId);
    expect(response.body.name).toBe('Injectables & Fillers');
    expect(response.body.slug).toBe('injectables-fillers');
    expect(response.body.sortOrder).toBe(0);
    expect(response.body.isActive).toBe(true);
  });

  it('GET /clinics/:clinicId/service-categories retrieves categories for a clinic', async () => {
    await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId,
        name: 'Laser Treatments',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/clinics/${clinicId}/service-categories`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].clinicId).toBe(clinicId);
  });

  it('PATCH /service-categories/:id updates a category', async () => {
    const created = await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId,
        name: 'Skin Care',
      })
      .expect(201);

    const categoryId = created.body.id;

    const updated = await request(app.getHttpServer())
      .patch(`/service-categories/${categoryId}`)
      .send({ name: 'Advanced Skin Care', sortOrder: 5 })
      .expect(200);

    expect(updated.body.name).toBe('Advanced Skin Care');
    expect(updated.body.slug).toBe('advanced-skin-care');
    expect(updated.body.sortOrder).toBe(5);
  });

  it('DELETE /service-categories/:id soft-deletes a category', async () => {
    const created = await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId,
        name: 'Body Contouring',
      })
      .expect(201);

    const categoryId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/service-categories/${categoryId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/service-categories/${categoryId}`)
      .expect(404);
  });
});
