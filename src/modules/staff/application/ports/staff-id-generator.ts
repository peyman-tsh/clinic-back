export const STAFF_ID_GENERATOR = Symbol('STAFF_ID_GENERATOR');

export interface StaffIdGenerator {
  generate(): string;
}
