export const ROLE_ID_GENERATOR = Symbol('ROLE_ID_GENERATOR');

export interface RoleIdGenerator {
  generate(): string;
}
