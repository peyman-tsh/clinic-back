export class InvalidRoleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRoleError';
  }
}

export class RoleNameAlreadyInUseError extends Error {
  constructor(name: string) {
    super(`A role named "${name}" already exists`);
    this.name = 'RoleNameAlreadyInUseError';
  }
}

export class RoleNotFoundError extends Error {
  constructor(id: string) {
    super(`Role with ID "${id}" was not found`);
    this.name = 'RoleNotFoundError';
  }
}

export class InvalidPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPermissionError';
  }
}

export class PermissionAlreadyInUseError extends Error {
  constructor(module: string, name: string) {
    super(`Permission "${module}:${name}" already exists`);
    this.name = 'PermissionAlreadyInUseError';
  }
}

export class PermissionNotFoundError extends Error {
  constructor(id: string) {
    super(`Permission with ID "${id}" was not found`);
    this.name = 'PermissionNotFoundError';
  }
}

export class RoleUserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with ID "${id}" was not found`);
    this.name = 'RoleUserNotFoundError';
  }
}
