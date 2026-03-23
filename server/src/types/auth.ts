export type LoginRequest = {
  username: string;
  password: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
};
