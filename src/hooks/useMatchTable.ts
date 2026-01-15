import { useQuery } from "@tanstack/react-query";
import { fetchMatchData } from "@/api/matchTable";

export function useMatchTable() {
  return useQuery({
    queryKey: ["matchTable"],
    queryFn: () => fetchMatchData(),
  });
}
