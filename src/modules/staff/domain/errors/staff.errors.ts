export class StaffNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Staff member with identifier "${identifier}" was not found`);
    this.name = 'StaffNotFoundError';
  }
}

export class UserAlreadyHasStaffProfileError extends Error {
  constructor(userId: string) {
    super(`User "${userId}" already has an associated Staff profile`);
    this.name = 'UserAlreadyHasStaffProfileError';
  }
}

export class StaffBranchAlreadyAssignedError extends Error {
  constructor(staffId: string, branchId: string) {
    super(`Staff "${staffId}" is already assigned to branch "${branchId}"`);
    this.name = 'StaffBranchAlreadyAssignedError';
  }
}

export class InvalidStaffError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStaffError';
  }
}
