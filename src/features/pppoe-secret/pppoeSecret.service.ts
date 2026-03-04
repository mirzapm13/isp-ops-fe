import { apiGet, apiPost } from "@/lib/api";
import type { PppoeSecretCreateForm } from "./pppoeSecret.schema";

export const pppoeSecretService = {
  create(data: PppoeSecretCreateForm) {
    return apiPost("/pppoe/secrets", data);
  },

  getProfiles() {
    return apiGet("/pppoe/profiles");
  },

  getRouters() {
    return apiGet("/routers");
  },
};
