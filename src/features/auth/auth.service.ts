import { apiGet, apiPost } from "@/lib/api";
import type { LoginPayload, LoginResponse, User } from "./auth.types";

export const authService = {
  login(payload: LoginPayload) {
    return apiPost<LoginResponse>("/auth/login", payload);
  },

  refresh(refreshToken: string) {
    return apiPost<{ access_token: string; token_type: string }>(
      "/auth/refresh",
      { refresh_token: refreshToken },
    );
  },

  me() {
    return apiGet<User>("/auth/me");
  },
};
