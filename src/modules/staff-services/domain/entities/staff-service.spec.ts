import { StaffService } from './staff-service';
import { InvalidStaffServiceError } from '../errors/staff-service.errors';

describe('StaffService Domain Entity', () => {
  const validProps = {
    id: '11111111-1111-4111-a111-111111111111',
    staffId: '22222222-2222-4222-a222-222222222222',
    serviceId: '33333333-3333-4333-a333-333333333333',
    priceOverride: 200,
    durationOverrideMinutes: 45,
    depositOverride: 50,
    isActive: true,
  };

  it('creates a valid StaffService entity', () => {
    const staffService = StaffService.create(validProps);

    expect(staffService.id).toBe(validProps.id);
    expect(staffService.staffId).toBe(validProps.staffId);
    expect(staffService.serviceId).toBe(validProps.serviceId);
    expect(staffService.priceOverride).toBe(200);
    expect(staffService.durationOverrideMinutes).toBe(45);
    expect(staffService.depositOverride).toBe(50);
    expect(staffService.isActive).toBe(true);
    expect(staffService.createdAt).toBeInstanceOf(Date);
    expect(staffService.updatedAt).toBeInstanceOf(Date);
  });

  it('allows null overrides', () => {
    const staffService = StaffService.create({
      id: validProps.id,
      staffId: validProps.staffId,
      serviceId: validProps.serviceId,
    });

    expect(staffService.priceOverride).toBeNull();
    expect(staffService.durationOverrideMinutes).toBeNull();
    expect(staffService.depositOverride).toBeNull();
    expect(staffService.isActive).toBe(true);
  });

  it('correctly resolves fallback values when overrides are missing', () => {
    const staffService = StaffService.create({
      id: validProps.id,
      staffId: validProps.staffId,
      serviceId: validProps.serviceId,
    });

    expect(staffService.resolvePrice(180)).toBe(180);
    expect(staffService.resolveDuration(30)).toBe(30);
    expect(staffService.resolveDeposit(40)).toBe(40);
  });

  it('correctly resolves overridden values when overrides are set', () => {
    const staffService = StaffService.create(validProps);

    expect(staffService.resolvePrice(180)).toBe(200);
    expect(staffService.resolveDuration(30)).toBe(45);
    expect(staffService.resolveDeposit(40)).toBe(50);
  });

  it('throws error when staffId or serviceId is missing', () => {
    expect(() =>
      StaffService.create({
        ...validProps,
        staffId: '',
      }),
    ).toThrow(InvalidStaffServiceError);

    expect(() =>
      StaffService.create({
        ...validProps,
        serviceId: '   ',
      }),
    ).toThrow(InvalidStaffServiceError);
  });

  it('throws error when priceOverride is negative', () => {
    expect(() =>
      StaffService.create({
        ...validProps,
        priceOverride: -10,
      }),
    ).toThrow(InvalidStaffServiceError);
  });

  it('throws error when durationOverrideMinutes is zero or negative', () => {
    expect(() =>
      StaffService.create({
        ...validProps,
        durationOverrideMinutes: 0,
      }),
    ).toThrow(InvalidStaffServiceError);

    expect(() =>
      StaffService.create({
        ...validProps,
        durationOverrideMinutes: -15,
      }),
    ).toThrow(InvalidStaffServiceError);
  });

  it('throws error when depositOverride is negative or exceeds priceOverride', () => {
    expect(() =>
      StaffService.create({
        ...validProps,
        depositOverride: -5,
      }),
    ).toThrow(InvalidStaffServiceError);

    expect(() =>
      StaffService.create({
        ...validProps,
        priceOverride: 100,
        depositOverride: 150,
      }),
    ).toThrow(InvalidStaffServiceError);
  });

  it('updates overrides and active status correctly', () => {
    const staffService = StaffService.create(validProps);

    staffService.update({
      priceOverride: 220,
      durationOverrideMinutes: 50,
      depositOverride: 60,
      isActive: false,
    });

    expect(staffService.priceOverride).toBe(220);
    expect(staffService.durationOverrideMinutes).toBe(50);
    expect(staffService.depositOverride).toBe(60);
    expect(staffService.isActive).toBe(false);
  });
});
