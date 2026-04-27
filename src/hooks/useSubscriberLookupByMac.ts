import { useQuery } from "@tanstack/react-query";
import { fetchSubscriberByMac } from "@/api/pppoe";

export function useSubscriberLookupByMac(address: string) {
  return useQuery({
    queryKey: ["subscriber-mac", address],
    queryFn: () => fetchSubscriberByMac(address),
    enabled: !!address,
    retry: false,
  });
}
