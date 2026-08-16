import { ServiceCategory } from './service-category';
import { InvalidServiceCategoryError } from '../errors/service-category.errors';

describe('ServiceCategory Entity', () => {
  const validBaseInput = {
    id: 'category-uuid-1',
    clinicId: 'clinic-uuid-1',
    name: 'Injectables & Fillers',
  };

  it('creates a valid service category with default values and auto-generated slug', () => {
    const category = ServiceCategory.create(validBaseInput);

    expect(category.id).toBe('category-uuid-1');
    expect(category.clinicId).toBe('clinic-uuid-1');
    expect(category.name).toBe('Injectables & Fillers');
    expect(category.slug).toBe('injectables-fillers');
    expect(category.sortOrder).toBe(0);
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it('customizes slug correctly when explicitly provided', () => {
    const category = ServiceCategory.create({
      ...validBaseInput,
      slug: 'custom-injectables-slug',
    });

    expect(category.slug).toBe('custom-injectables-slug');
  });

  it('throws an error if name is empty', () => {
    expect(() =>
      ServiceCategory.create({
        ...validBaseInput,
        name: '   ',
      }),
    ).toThrow(InvalidServiceCategoryError);
  });

  it('updates category properties and regenerates slug if needed', () => {
    const category = ServiceCategory.create(validBaseInput);

    category.update({
      name: 'Laser Treatments',
      sortOrder: 5,
      isActive: false,
    });

    expect(category.name).toBe('Laser Treatments');
    expect(category.slug).toBe('laser-treatments');
    expect(category.sortOrder).toBe(5);
    expect(category.isActive).toBe(false);
  });
});
