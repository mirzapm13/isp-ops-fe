import { apiFetch } from "@/api/client";
import type { Router } from "@/types/router";

export function fetchRouters() {
  return apiFetch<Router[]>(`/api/v1/routers`);
}
