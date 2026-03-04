const API_BASE = import.meta.env.VITE_API_BASE_URL;

let accessToken: string | null = null;
let logoutHandler: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function registerLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
  });

  // 🔁 If access token expired → try refresh
  if (res.status === 401 && retry) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw { message: "Session expired" };
    }

    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!refreshRes.ok) {
      if (logoutHandler) logoutHandler();
      throw { message: "Session expired" };
    }

    const data = await refreshRes.json();

    setAccessToken(data.access_token);

    // 🔁 Retry original request once
    return fetchWithAuth(path, options, false);
  }
  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithAuth(path);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw err ?? { message: "Request failed" };
  }

  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  console.log("running");
  const res = await fetchWithAuth(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw err ?? { message: "Request failed" };
  }

  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithAuth(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw err ?? { message: "Request failed" };
  }

  return res.json();
}
