import { Branch, BranchStatus } from './branch';
import { InvalidBranchError } from '../errors/branch.errors';

describe('Branch Entity', () => {
  const validBaseInput = {
    id: 'branch-uuid-1',
    clinicId: 'clinic-uuid-1',
    name: 'Frankfurt Central Branch',
    addressLine1: 'Kaiserstraße 12',
    city: 'Frankfurt',
    countryCode: 'DE',
  };

  it('creates a valid branch entity with default values', () => {
    const branch = Branch.create(validBaseInput);

    expect(branch.id).toBe('branch-uuid-1');
    expect(branch.clinicId).toBe('clinic-uuid-1');
    expect(branch.name).toBe('Frankfurt Central Branch');
    expect(branch.countryCode).toBe('DE');
    expect(branch.status).toBe(BranchStatus.ACTIVE);
    expect(branch.timezone).toBeNull();
    expect(branch.createdAt).toBeInstanceOf(Date);
  });

  it('resolves effective timezone using fallback if branch timezone is null', () => {
    const branchWithoutTz = Branch.create(validBaseInput);
    expect(branchWithoutTz.getEffectiveTimezone('Europe/Berlin')).toBe('Europe/Berlin');

    const branchWithTz = Branch.create({
      ...validBaseInput,
      timezone: 'Europe/London',
    });
    expect(branchWithTz.getEffectiveTimezone('Europe/Berlin')).toBe('Europe/London');
  });

  it('throws an error if countryCode is invalid', () => {
    expect(() =>
      Branch.create({
        ...validBaseInput,
        countryCode: 'GERMANY',
      }),
    ).toThrow(InvalidBranchError);
  });

  it('throws an error if latitude is out of bounds', () => {
    expect(() =>
      Branch.create({
        ...validBaseInput,
        latitude: 100,
      }),
    ).toThrow(InvalidBranchError);
  });

  it('updates branch properties successfully', () => {
    const branch = Branch.create(validBaseInput);
    branch.update({
      name: 'Frankfurt West Branch',
      status: BranchStatus.INACTIVE,
    });

    expect(branch.name).toBe('Frankfurt West Branch');
    expect(branch.status).toBe(BranchStatus.INACTIVE);
  });
});
