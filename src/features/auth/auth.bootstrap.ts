import { authService } from "./auth.service";
import { setAccessToken } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function bootstrapAuth(setAuth: any, clearAuth: any) {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    clearAuth();
    return;
  }

  try {
    const tokenRes = await authService.refresh(refreshToken);

    setAccessToken(tokenRes.access_token);

    const user = await authService.me();

    setAuth(user, tokenRes.access_token);
  } catch {
    clearAuth();
  }
}
