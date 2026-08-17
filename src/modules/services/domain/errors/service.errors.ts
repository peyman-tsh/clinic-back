export class ServiceNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Service with identifier "${identifier}" was not found`);
    this.name = 'ServiceNotFoundError';
  }
}

export class ServiceSlugAlreadyInUseError extends Error {
  constructor(slug: string, clinicId: string) {
    super(`Service slug "${slug}" is already in use for clinic "${clinicId}"`);
    this.name = 'ServiceSlugAlreadyInUseError';
  }
}

export class CategoryDoesNotBelongToClinicError extends Error {
  constructor(categoryId: string, clinicId: string) {
    super(`Category "${categoryId}" does not belong to clinic "${clinicId}"`);
    this.name = 'CategoryDoesNotBelongToClinicError';
  }
}

export class InvalidServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidServiceError';
  }
}
