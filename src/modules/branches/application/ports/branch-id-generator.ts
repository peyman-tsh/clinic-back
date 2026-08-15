export const BRANCH_ID_GENERATOR = Symbol('BRANCH_ID_GENERATOR');

export interface BranchIdGenerator {
  generate(): string;
}
