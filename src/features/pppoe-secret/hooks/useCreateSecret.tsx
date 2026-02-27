import { useQuery } from "@tanstack/react-query";
import { fetchRouters } from "../pppoeSecret.queries";

export function useFetchRouters() {
  return useQuery({
    queryKey: ["routers"],
    queryFn: () => fetchRouters(),
    retry: false,
  });
}
