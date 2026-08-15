import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Branches API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let clinicId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-branches-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics, branches CASCADE');
    }

    const clinicRes = await request(app.getHttpServer())
      .post('/clinics')
      .send({
        name: 'Glow Beauty Clinic',
      })
      .expect(201);

    clinicId = clinicRes.body.id;
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE branches CASCADE');
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE clinics, branches CASCADE');
    }
    if (app) {
      await app.close();
    }
  });

  it('POST /branches creates a new branch', async () => {
    const response = await request(app.getHttpServer())
      .post('/branches')
      .send({
        clinicId,
        name: 'Frankfurt Branch',
        code: 'FRA-01',
        email: 'frankfurt@glow.com',
        phone: '+496912345',
        addressLine1: 'Mainzer Landstraße 50',
        city: 'Frankfurt',
        countryCode: 'DE',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.clinicId).toBe(clinicId);
    expect(response.body.name).toBe('Frankfurt Branch');
    expect(response.body.code).toBe('FRA-01');
    expect(response.body.countryCode).toBe('DE');
  });

  it('GET /clinics/:clinicId/branches retrieves branches by clinic ID', async () => {
    await request(app.getHttpServer())
      .post('/branches')
      .send({
        clinicId,
        name: 'Berlin Branch',
        code: 'BER-01',
        addressLine1: 'Alexanderplatz 1',
        city: 'Berlin',
        countryCode: 'DE',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/clinics/${clinicId}/branches`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].clinicId).toBe(clinicId);
  });

  it('GET /branches/:id retrieves a branch by ID', async () => {
    const created = await request(app.getHttpServer())
      .post('/branches')
      .send({
        clinicId,
        name: 'Hamburg Branch',
        addressLine1: 'Mönckebergstraße 5',
        city: 'Hamburg',
        countryCode: 'DE',
      })
      .expect(201);

    const branchId = created.body.id;

    const response = await request(app.getHttpServer())
      .get(`/branches/${branchId}`)
      .expect(200);

    expect(response.body.id).toBe(branchId);
    expect(response.body.name).toBe('Hamburg Branch');
  });

  it('PATCH /branches/:id updates a branch', async () => {
    const created = await request(app.getHttpServer())
      .post('/branches')
      .send({
        clinicId,
        name: 'Munich Branch',
        addressLine1: 'Marienplatz 1',
        city: 'Munich',
        countryCode: 'DE',
      })
      .expect(201);

    const branchId = created.body.id;

    const updated = await request(app.getHttpServer())
      .patch(`/branches/${branchId}`)
      .send({ name: 'Munich Central Branch', status: 'inactive' })
      .expect(200);

    expect(updated.body.name).toBe('Munich Central Branch');
    expect(updated.body.status).toBe('inactive');
  });

  it('DELETE /branches/:id soft-deletes a branch', async () => {
    const created = await request(app.getHttpServer())
      .post('/branches')
      .send({
        clinicId,
        name: 'Stuttgart Branch',
        addressLine1: 'Königstraße 10',
        city: 'Stuttgart',
        countryCode: 'DE',
      })
      .expect(201);

    const branchId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/branches/${branchId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/branches/${branchId}`)
      .expect(404);
  });
});
