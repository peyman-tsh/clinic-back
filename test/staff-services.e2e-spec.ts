import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { AppModule } from './../src/app.module';

describe('StaffServices API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  let clinicId: string;
  let foreignClinicId: string;
  let userId: string;
  let staffId: string;
  let categoryId: string;
  let serviceId: string;
  let foreignServiceId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      process.env.TEST_DATABASE_URL ??
      'postgresql://crm:local-dev-password@127.0.0.1:5433/crm_back_test';
    process.env.JWT_SECRET = 'test-secret-key-for-staff-services-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    if (dataSource?.isInitialized) {
      await dataSource.query(
        'TRUNCATE TABLE users, clinics, branches, staff, staff_branches, service_categories, services, staff_services CASCADE',
      );
    }

    // 1. Create Main Clinic
    const clinicRes = await request(app.getHttpServer())
      .post('/clinics')
      .send({ name: 'Aesthetic Clinic A E2E' })
      .expect(201);
    clinicId = clinicRes.body.id;

    // 2. Create Foreign Clinic (to test clinic mismatch validation)
    const foreignClinicRes = await request(app.getHttpServer())
      .post('/clinics')
      .send({ name: 'Aesthetic Clinic B E2E' })
      .expect(201);
    foreignClinicId = foreignClinicRes.body.id;

    // 3. Create User & Staff in Clinic A
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'dr_smith_staff_service',
        email: 'dr_smith_ss@clinic.de',
        password: 'Password123!',
      })
      .expect(201);
    userId = signupRes.body.user.id;

    const staffRes = await request(app.getHttpServer())
      .post('/staff')
      .send({
        userId,
        clinicId,
        jobTitle: 'Lead Practitioner',
      })
      .expect(201);
    staffId = staffRes.body.id;

    // 4. Create Category & Service in Clinic A
    const categoryRes = await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId,
        name: 'Facial Treatments',
      })
      .expect(201);
    categoryId = categoryRes.body.id;

    const serviceRes = await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId,
        categoryId,
        name: 'Botox Anti-Wrinkle',
        durationMinutes: 30,
        price: 180.0,
        depositAmount: 50.0,
      })
      .expect(201);
    serviceId = serviceRes.body.id;

    // 5. Create Category & Service in Foreign Clinic B
    const foreignCategoryRes = await request(app.getHttpServer())
      .post('/service-categories')
      .send({
        clinicId: foreignClinicId,
        name: 'Laser Treatments Clinic B',
      })
      .expect(201);

    const foreignServiceRes = await request(app.getHttpServer())
      .post('/services')
      .send({
        clinicId: foreignClinicId,
        categoryId: foreignCategoryRes.body.id,
        name: 'Foreign Laser Hair Removal',
        durationMinutes: 45,
        price: 250.0,
      })
      .expect(201);
    foreignServiceId = foreignServiceRes.body.id;
  }, 20_000);

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('TRUNCATE TABLE staff_services CASCADE');
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query(
        'TRUNCATE TABLE users, clinics, branches, staff, staff_branches, service_categories, services, staff_services CASCADE',
      );
    }
    if (app) {
      await app.close();
    }
  });

  it('POST /staff-services assigns service to staff with overrides', async () => {
    const response = await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
        priceOverride: 200.0,
        durationOverrideMinutes: 40,
        depositOverride: 60.0,
        isActive: true,
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.staffId).toBe(staffId);
    expect(response.body.serviceId).toBe(serviceId);
    expect(response.body.priceOverride).toBe(200);
    expect(response.body.durationOverrideMinutes).toBe(40);
    expect(response.body.depositOverride).toBe(60);
    expect(response.body.isActive).toBe(true);
  });

  it('POST /staff-services returns 409 Conflict when assignment already exists', async () => {
    await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
      })
      .expect(201);

    const duplicateResponse = await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
      })
      .expect(409);

    expect(duplicateResponse.body.statusCode).toBe(409);
    expect(duplicateResponse.body.error).toBe('StaffServiceAlreadyExistsError');
  });

  it('POST /staff-services returns 400 Bad Request when staff and service belong to different clinics', async () => {
    const mismatchResponse = await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId: foreignServiceId, // From Clinic B
      })
      .expect(400);

    expect(mismatchResponse.body.statusCode).toBe(400);
    expect(mismatchResponse.body.error).toBe('StaffServiceClinicMismatchError');
  });

  it('GET /staff-services finds assignments with query filters', async () => {
    await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
        priceOverride: 210.0,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/staff-services?staffId=${staffId}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].staffId).toBe(staffId);
    expect(res.body[0].serviceId).toBe(serviceId);
  });

  it('GET /staff/:staffId/services retrieves services assigned to a staff member', async () => {
    await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/staff/${staffId}/services`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].staffId).toBe(staffId);
  });

  it('GET /services/:serviceId/staff retrieves staff assigned to a service', async () => {
    await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/services/${serviceId}/staff`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].serviceId).toBe(serviceId);
  });

  it('PATCH /staff-services/:id updates price, duration and deposit overrides', async () => {
    const created = await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
        priceOverride: 190.0,
      })
      .expect(201);

    const assignmentId = created.body.id;

    const updated = await request(app.getHttpServer())
      .patch(`/staff-services/${assignmentId}`)
      .send({
        priceOverride: 230.0,
        durationOverrideMinutes: 50,
        depositOverride: 70.0,
        isActive: false,
      })
      .expect(200);

    expect(updated.body.priceOverride).toBe(230);
    expect(updated.body.durationOverrideMinutes).toBe(50);
    expect(updated.body.depositOverride).toBe(70);
    expect(updated.body.isActive).toBe(false);
  });

  it('DELETE /staff-services/:id removes the assignment', async () => {
    const created = await request(app.getHttpServer())
      .post('/staff-services')
      .send({
        staffId,
        serviceId,
      })
      .expect(201);

    const assignmentId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/staff-services/${assignmentId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/staff-services/${assignmentId}`)
      .expect(404);
  });
});
