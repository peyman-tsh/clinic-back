export class BranchNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Branch with identifier "${identifier}" was not found`);
    this.name = 'BranchNotFoundError';
  }
}

export class BranchCodeAlreadyInUseError extends Error {
  constructor(code: string, clinicId: string) {
    super(`Branch code "${code}" is already in use for clinic "${clinicId}"`);
    this.name = 'BranchCodeAlreadyInUseError';
  }
}

export class InvalidBranchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBranchError';
  }
}
