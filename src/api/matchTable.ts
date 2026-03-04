import { apiGet } from "@/lib/api";
import type { MatchResponse } from "@/types/matchingTable";

export function fetchMatchData() {
  return apiGet<MatchResponse>(`/match-table`);
}
