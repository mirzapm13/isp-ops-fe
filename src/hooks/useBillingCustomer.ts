import { useQuery } from "@tanstack/react-query";
import { fetchBillingCustomer } from "@/api/billing";

export function useBillingCustomer(ipSecret: string) {
  return useQuery({
    queryKey: ["billing", ipSecret],
    queryFn: () => fetchBillingCustomer(ipSecret),
    enabled: !!ipSecret,
    retry: false,
  });
}
