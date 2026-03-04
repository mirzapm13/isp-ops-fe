import { apiGet } from "@/lib/api";
import type { Router } from "@/types/router";

export function fetchRouters() {
  return apiGet<Router[]>(`/routers`);
}
