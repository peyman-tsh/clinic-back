import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Clinics API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  const testClinic = {
    name: 'Valley Care Clinic',
    description: 'General medical practice',
    logoUrl: 'https://example.com/logo.png',
    email: 'contact@valleycare.com',
    phone: '+15551234567',
    website: 'https://valleycare.com',
    timezone: 'UTC',
    currency: 'USD',
  };

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-clinics-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics CASCADE');
    }
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics CASCADE');
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /clinics creates a new clinic', async () => {
    const response = await request(app.getHttpServer())
      .post('/clinics')
      .send(testClinic)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(testClinic.name);
    expect(response.body.slug).toBe('valley-care-clinic');
    expect(response.body.email).toBe(testClinic.email);
    expect(response.body.status).toBe('active');
  });

  it('GET /clinics retrieves all clinics', async () => {
    await request(app.getHttpServer())
      .post('/clinics')
      .send(testClinic)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/clinics')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /clinics/:id retrieves a clinic by ID', async () => {
    const created = await request(app.getHttpServer())
      .post('/clinics')
      .send(testClinic)
      .expect(201);

    const clinicId = created.body.id;

    const response = await request(app.getHttpServer())
      .get(`/clinics/${clinicId}`)
      .expect(200);

    expect(response.body.id).toBe(clinicId);
    expect(response.body.name).toBe(testClinic.name);
  });

  it('PATCH /clinics/:id updates a clinic', async () => {
    const created = await request(app.getHttpServer())
      .post('/clinics')
      .send(testClinic)
      .expect(201);

    const clinicId = created.body.id;

    const updated = await request(app.getHttpServer())
      .patch(`/clinics/${clinicId}`)
      .send({ name: 'Valley Care Medical Center', currency: 'EUR' })
      .expect(200);

    expect(updated.body.name).toBe('Valley Care Medical Center');
    expect(updated.body.currency).toBe('EUR');
  });

  it('DELETE /clinics/:id soft-deletes a clinic', async () => {
    const created = await request(app.getHttpServer())
      .post('/clinics')
      .send(testClinic)
      .expect(201);

    const clinicId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/clinics/${clinicId}`)
      .expect(204);

    await request(app.getHttpServer()).get(`/clinics/${clinicId}`).expect(404);
  });
});
