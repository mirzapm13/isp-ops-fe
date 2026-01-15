import { useQuery } from "@tanstack/react-query";
import { fetchSubscriber } from "@/api/pppoe";

export function useSubscriberLookup(username: string) {
  return useQuery({
    queryKey: ["subscriber", username],
    queryFn: () => fetchSubscriber(username),
    enabled: !!username,
    retry: false,
  });
}
