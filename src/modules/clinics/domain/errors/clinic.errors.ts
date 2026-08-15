export class ClinicNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Clinic with identifier "${identifier}" was not found`);
    this.name = 'ClinicNotFoundError';
  }
}

export class ClinicSlugAlreadyInUseError extends Error {
  constructor(slug: string) {
    super(`Clinic slug "${slug}" is already in use`);
    this.name = 'ClinicSlugAlreadyInUseError';
  }
}

export class InvalidClinicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidClinicError';
  }
}
