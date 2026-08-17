export const SERVICE_CATEGORY_ID_GENERATOR = Symbol(
  'SERVICE_CATEGORY_ID_GENERATOR',
);

export interface ServiceCategoryIdGenerator {
  generate(): string;
}
