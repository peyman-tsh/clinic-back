export const USER_PASSWORD_HASHER = Symbol('USER_PASSWORD_HASHER');

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
