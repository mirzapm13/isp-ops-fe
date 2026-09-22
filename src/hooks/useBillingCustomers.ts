import { useQuery } from "@tanstack/react-query";
import { fetchBillingCustomersPaginated } from "@/api/billing";

export function useBillingCustomers(params: {
  search?: string;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["billing-customers-list", params.search, params.page, params.limit],
    queryFn: () => fetchBillingCustomersPaginated(params),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
