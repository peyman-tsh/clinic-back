import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Services API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let clinicId: string;
  let categoryId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-services-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics, service_categories, services CASCADE');
    }

    const clinicRes = await request(app.getHttpServer())
      .post('/clinics')
      .send({ name: 'Glow Beauty Clinic E2E' })
      .expect(201);

    clinicId = clinicRes.body.id;

    const categoryRes = await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId,
        name: 'Injectables',
      })
      .expect(201);

    categoryId = categoryRes.body.id;
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE services CASCADE');
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics, service_categories, services CASCADE');
    }
    if (app) {
      await app.close();
    }
  });

  it('POST /services creates a new service with calculated total occupied time', async () => {
    const response = await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId,
        categoryId,
        name: 'Botox Treatment',
        durationMinutes: 30,
        bufferBeforeMinutes: 5,
        bufferAfterMinutes: 10,
        price: 180.0,
        depositAmount: 50.0,
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.clinicId).toBe(clinicId);
    expect(response.body.categoryId).toBe(categoryId);
    expect(response.body.name).toBe('Botox Treatment');
    expect(response.body.slug).toBe('botox-treatment');
    expect(response.body.durationMinutes).toBe(30);
    expect(response.body.totalOccupiedMinutes).toBe(45);
    expect(response.body.price).toBe(180);
    expect(response.body.depositAmount).toBe(50);
  });

  it('GET /clinics/:clinicId/services retrieves services for a clinic', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId,
        categoryId,
        name: 'Lip Filler',
        durationMinutes: 45,
        price: 220.0,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/clinics/${clinicId}/services`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].clinicId).toBe(clinicId);
  });

  it('GET /service-categories/:categoryId/services retrieves services for a category', async () => {
    await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId,
        categoryId,
        name: 'Cheek Filler',
        durationMinutes: 45,
        price: 250.0,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/service-categories/${categoryId}/services`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].categoryId).toBe(categoryId);
  });

  it('PATCH /services/:id updates a service', async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId,
        categoryId,
        name: 'Jawline Filler',
        durationMinutes: 30,
        price: 200.0,
      })
      .expect(201);

    const serviceId = created.body.id;

    const updated = await request(app.getHttpServer())
      .patch(`/services/${serviceId}`)
      .send({ name: 'Jawline Contour Filler', price: 230.0 })
      .expect(200);

    expect(updated.body.name).toBe('Jawline Contour Filler');
    expect(updated.body.slug).toBe('jawline-contour-filler');
    expect(updated.body.price).toBe(230);
  });

  it('DELETE /services/:id soft-deletes a service', async () => {
    const created = await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId,
        categoryId,
        name: 'Facial Microneedling',
        durationMinutes: 60,
        price: 150.0,
      })
      .expect(201);

    const serviceId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/services/${serviceId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/services/${serviceId}`)
      .expect(404);
  });
});
