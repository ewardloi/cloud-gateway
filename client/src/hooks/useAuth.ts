import { useState, useCallback } from "react";
import { authApi } from "../api/index.ts";
import {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "../api/client.ts";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!getAccessToken(),
  );

  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (user: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokens = await authApi.login(user, password);

      setTokens(tokens.accessToken, tokens.refreshToken);
      setIsAuthenticated(true);
      setUsername(user);

      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");

      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) await authApi.logout(refreshToken).catch(() => {});

    clearTokens();
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return { isAuthenticated, username, isLoading, error, login, logout };
}
