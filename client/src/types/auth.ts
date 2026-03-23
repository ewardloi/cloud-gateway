export type LoginRequest = {
  username: string;
  password: string;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}
