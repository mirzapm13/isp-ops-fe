import type { MatchResponse } from "@/types/matchingTable";
import { apiFetch } from "./client";

export function fetchMatchData() {
  return apiFetch<MatchResponse>(`/api/v1/match-table`);
}
