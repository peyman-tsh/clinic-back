import { Clinic, ClinicStatus } from './clinic';
import { InvalidClinicError } from '../errors/clinic.errors';

describe('Clinic Entity', () => {
  it('creates a valid clinic with default values', () => {
    const clinic = Clinic.create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Downtown Dental Clinic',
    });

    expect(clinic.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(clinic.name).toBe('Downtown Dental Clinic');
    expect(clinic.slug).toBe('downtown-dental-clinic');
    expect(clinic.status).toBe(ClinicStatus.Active);
    expect(clinic.timezone).toBe('UTC');
    expect(clinic.currency).toBe('USD');
    expect(clinic.createdAt).toBeInstanceOf(Date);
    expect(clinic.updatedAt).toBeInstanceOf(Date);
    expect(clinic.deletedAt).toBeNull();
  });

  it('throws an error if clinic name is empty', () => {
    expect(() =>
      Clinic.create({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: '   ',
      }),
    ).toThrow(InvalidClinicError);
  });

  it('validates custom slug formatting', () => {
    expect(() =>
      Clinic.create({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Valid Name',
        slug: 'Invalid Slug!',
      }),
    ).toThrow(InvalidClinicError);
  });

  it('updates clinic properties correctly', () => {
    const clinic = Clinic.create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Old Name',
    });

    clinic.update({
      name: 'New Name',
      currency: 'EUR',
      status: ClinicStatus.Inactive,
    });

    expect(clinic.name).toBe('New Name');
    expect(clinic.currency).toBe('EUR');
    expect(clinic.status).toBe(ClinicStatus.Inactive);
  });
});
