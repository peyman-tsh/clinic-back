export const SERVICE_ID_GENERATOR = Symbol('SERVICE_ID_GENERATOR');

export interface ServiceIdGenerator {
  generate(): string;
}
