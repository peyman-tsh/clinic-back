export class StaffServiceNotFoundError extends Error {
  constructor(identifier: string) {
    super(
      `Staff service assignment with identifier "${identifier}" was not found`,
    );
    this.name = 'StaffServiceNotFoundError';
  }
}

export class StaffServiceAlreadyExistsError extends Error {
  constructor(staffId: string, serviceId: string) {
    super(`Staff "${staffId}" is already assigned to service "${serviceId}"`);
    this.name = 'StaffServiceAlreadyExistsError';
  }
}

export class StaffServiceClinicMismatchError extends Error {
  constructor(staffClinicId: string, serviceClinicId: string) {
    super(
      `Staff clinic "${staffClinicId}" does not match service clinic "${serviceClinicId}"`,
    );
    this.name = 'StaffServiceClinicMismatchError';
  }
}

export class InvalidStaffServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStaffServiceError';
  }
}
