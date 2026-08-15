import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('Staff API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let userId: string;
  let clinicId: string;
  let branchId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-staff-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE users, clinics, branches, staff, staff_branches CASCADE');
    }

    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'dr_smith_e2e',
        email: 'dr_smith@glowclinic.de',
        password: 'Password123!',
      })
      .expect(201);

    userId = signupRes.body.user.id;

    const clinicRes = await request(app.getHttpServer())
      .post('/clinics')
      .send({ name: 'Glow Beauty Clinic E2E' })
      .expect(201);

    clinicId = clinicRes.body.id;

    const branchRes = await request(app.getHttpServer())
      .post('/branches')
      .send({
        clinicId,
        name: 'Frankfurt Branch E2E',
        addressLine1: 'Main St 1',
        city: 'Frankfurt',
        countryCode: 'DE',
      })
      .expect(201);

    branchId = branchRes.body.id;
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE staff, staff_branches CASCADE');
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE users, clinics, branches, staff, staff_branches CASCADE');
    }
    if (app) {
      await app.close();
    }
  });

  it('POST /staff creates a new staff profile', async () => {
    const response = await request(app.getHttpServer())
      .post('/staff')
      .send({
        userId,
        clinicId,
        jobTitle: 'Senior Dermatologist',
        bio: 'Specialist in laser therapy',
        licenseNumber: 'LIC-100200',
        color: '#FF5733',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.userId).toBe(userId);
    expect(response.body.clinicId).toBe(clinicId);
    expect(response.body.jobTitle).toBe('Senior Dermatologist');
    expect(response.body.color).toBe('#FF5733');
  });

  it('POST /staff/:id/branches assigns staff to a branch', async () => {
    const createdStaff = await request(app.getHttpServer())
      .post('/staff')
      .send({
        userId,
        clinicId,
        jobTitle: 'Doctor',
      })
      .expect(201);

    const staffId = createdStaff.body.id;

    const assigned = await request(app.getHttpServer())
      .post(`/staff/${staffId}/branches`)
      .send({
        branchId,
        isPrimary: true,
      })
      .expect(200);

    expect(assigned.body.branches).toHaveLength(1);
    expect(assigned.body.branches[0].branchId).toBe(branchId);
    expect(assigned.body.branches[0].isPrimary).toBe(true);
  });

  it('GET /staff retrieves all staff members', async () => {
    await request(app.getHttpServer())
      .post('/staff')
      .send({
        userId,
        clinicId,
        jobTitle: 'Doctor',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/staff')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('PATCH /staff/:id updates a staff profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/staff')
      .send({
        userId,
        clinicId,
        jobTitle: 'Junior Doctor',
      })
      .expect(201);

    const staffId = created.body.id;

    const updated = await request(app.getHttpServer())
      .patch(`/staff/${staffId}`)
      .send({ jobTitle: 'Head of Dermatology', status: 'on_leave' })
      .expect(200);

    expect(updated.body.jobTitle).toBe('Head of Dermatology');
    expect(updated.body.status).toBe('on_leave');
  });

  it('DELETE /staff/:id soft-deletes a staff profile', async () => {
    const created = await request(app.getHttpServer())
      .post('/staff')
      .send({
        userId,
        clinicId,
      })
      .expect(201);

    const staffId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/staff/${staffId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/staff/${staffId}`)
      .expect(404);
  });
});
