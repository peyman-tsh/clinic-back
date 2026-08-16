export class ServiceCategoryNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Service category with identifier "${identifier}" was not found`);
    this.name = 'ServiceCategoryNotFoundError';
  }
}

export class ServiceCategorySlugAlreadyInUseError extends Error {
  constructor(slug: string, clinicId: string) {
    super(`Service category slug "${slug}" is already in use for clinic "${clinicId}"`);
    this.name = 'ServiceCategorySlugAlreadyInUseError';
  }
}

export class InvalidServiceCategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidServiceCategoryError';
  }
}
