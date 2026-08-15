export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');

export interface TokenGenerator {
  signAccessToken(payload: {
    sub: string;
    email: string;
    roles: string[];
  }): Promise<string>;

  signRefreshToken(payload: { sub: string; jti: string }): Promise<string>;
  verifyAccessToken(token: string): Promise<{
    sub: string;
    email: string;
    roles: string[];
  }>;
  verifyRefreshToken(token: string): Promise<{ sub: string; jti: string }>;
}