import { apiGet, apiPost } from "@/lib/api";
import type { PppoeSecretCreateForm } from "./pppoeSecret.schema";

export const pppoeSecretService = {
  create(data: PppoeSecretCreateForm) {
    return apiPost("/api/v1/pppoe/secrets", data);
  },

  getProfiles() {
    return apiGet("/api/v1/pppoe/profiles");
  },

  getRouters() {
    return apiGet("/api/v1/routers");
  },
};
