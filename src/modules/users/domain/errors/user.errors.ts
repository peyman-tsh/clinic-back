export class InvalidUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserError';
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class UsernameAlreadyInUseError extends Error {
  constructor(username: string) {
    super(`A user with username "${username}" already exists`);
    this.name = 'UsernameAlreadyInUseError';
  }
}

export class EmployeeCodeAlreadyInUseError extends Error {
  constructor(code: string) {
    super(`A user with employee code "${code}" already exists`);
    this.name = 'EmployeeCodeAlreadyInUseError';
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with ID "${id}" was not found`);
    this.name = 'UserNotFoundError';
  }
}
