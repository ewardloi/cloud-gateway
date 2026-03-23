import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { TokenPair } from "../types/auth.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback-secret-change-me";
const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "fallback-refresh-secret";
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

const refreshTokenStore = new Set<string>();

export async function validateCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME ?? "admin";
  const validHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (username !== validUsername) return false;
  return bcrypt.compare(password, validHash);
}

export function generateTokens(username: string): TokenPair {
  const accessToken = jwt.sign({ sub: username }, JWT_SECRET, {
    expiresIn: ACCESS_TTL,
  });

  const refreshToken = jwt.sign({ sub: username }, REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
  });

  refreshTokenStore.add(refreshToken);
  return { accessToken, refreshToken };
}

export function refreshTokens(refreshToken: string): TokenPair | null {
  if (!refreshTokenStore.has(refreshToken)) return null;
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { sub: string };
    refreshTokenStore.delete(refreshToken);
    return generateTokens(payload.sub);
  } catch {
    refreshTokenStore.delete(refreshToken);
    return null;
  }
}

export function revokeRefreshToken(token: string): void {
  refreshTokenStore.delete(token);
}
