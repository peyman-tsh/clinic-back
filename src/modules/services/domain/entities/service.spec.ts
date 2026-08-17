import { Service } from './service';
import { InvalidServiceError } from '../errors/service.errors';

describe('Service Entity', () => {
  const validBaseInput = {
    id: 'service-uuid-1',
    clinicId: 'clinic-uuid-1',
    categoryId: 'category-uuid-1',
    name: 'Botox Treatment',
    durationMinutes: 30,
    bufferBeforeMinutes: 5,
    bufferAfterMinutes: 10,
    price: 180,
    depositAmount: 50,
  };

  it('creates a valid service entity with auto-generated slug and calculates total occupied time', () => {
    const service = Service.create(validBaseInput);

    expect(service.id).toBe('service-uuid-1');
    expect(service.name).toBe('Botox Treatment');
    expect(service.slug).toBe('botox-treatment');
    expect(service.durationMinutes).toBe(30);
    expect(service.bufferBeforeMinutes).toBe(5);
    expect(service.bufferAfterMinutes).toBe(10);
    expect(service.totalOccupiedMinutes).toBe(45);
    expect(service.price).toBe(180);
    expect(service.depositAmount).toBe(50);
    expect(service.isActive).toBe(true);
    expect(service.createdAt).toBeInstanceOf(Date);
  });

  it('throws an error if duration is <= 0', () => {
    expect(() =>
      Service.create({
        ...validBaseInput,
        durationMinutes: 0,
      }),
    ).toThrow(InvalidServiceError);
  });

  it('throws an error if deposit amount is greater than price', () => {
    expect(() =>
      Service.create({
        ...validBaseInput,
        price: 100,
        depositAmount: 150,
      }),
    ).toThrow(InvalidServiceError);
  });

  it('updates service properties and validates deposit bound against new price', () => {
    const service = Service.create(validBaseInput);

    service.update({
      price: 200,
      depositAmount: 60,
      durationMinutes: 45,
    });

    expect(service.price).toBe(200);
    expect(service.depositAmount).toBe(60);
    expect(service.durationMinutes).toBe(45);
    expect(service.totalOccupiedMinutes).toBe(60);
  });
});
