const API_BASE = import.meta.env.VITE_API_BASE_URL;

let accessToken: string | null = null;
let logoutHandler: (() => void) | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function registerLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

async function getRefreshedAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw { status: 401, message: "Session expired" };
  }

  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
    .then(async (refreshRes) => {
      if (!refreshRes.ok) {
        throw { status: refreshRes.status, message: "Session expired" };
      }

      const data = (await refreshRes.json()) as { access_token: string };
      setAccessToken(data.access_token);
      return data.access_token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
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

  // Access tokens expire normally. Refresh once, then retry the request.
  if (res.status === 401 && retry) {
    try {
      await getRefreshedAccessToken();
      return fetchWithAuth(path, options, false);
    } catch {
      if (logoutHandler) logoutHandler();
      throw { status: 401, message: "Session expired" };
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw {
      status: res.status,
      message: errorData?.detail || errorData?.message || "Request failed",
    };
  }

  return res;
}

export async function apiGet<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";

  const res = await fetchWithAuth(url + query, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
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
