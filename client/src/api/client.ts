const BASE_URL = "/api";

let accessToken: string | null = localStorage.getItem("accessToken");
let refreshToken: string | null = localStorage.getItem("refreshToken");
let isRefreshing = false;

function waitRefreshToken(): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        clearInterval(interval);
        resolve();
      }
    });
  });
}

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

async function doRefresh(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry && refreshToken) {
    if (isRefreshing) {
      await waitRefreshToken();

      return request<T>(path, options, false);
    }

    isRefreshing = true;

    try {
      await doRefresh();

      return request<T>(path, options, false);
    } finally {
      isRefreshing = false;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export function get<T>(path: string) {
  return request<T>(path);
}

export function post<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function put<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export function del<T>(path: string) {
  return request<T>(path, { method: "DELETE" });
}
