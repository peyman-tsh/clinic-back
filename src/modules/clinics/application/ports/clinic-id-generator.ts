export const CLINIC_ID_GENERATOR = Symbol('CLINIC_ID_GENERATOR');

export interface ClinicIdGenerator {
  generate(): string;
}
