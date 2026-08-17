export const STAFF_SERVICE_ID_GENERATOR = Symbol('STAFF_SERVICE_ID_GENERATOR');

export interface StaffServiceIdGenerator {
  generate(): string;
}
