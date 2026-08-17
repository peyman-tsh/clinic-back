export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  avatar?: string | null;
  timezone?: string;
  language?: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthTokensOutput {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface LoginOutput {
  accessToken: AuthTokensOutput;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}
