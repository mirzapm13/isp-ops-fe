import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LookupForm } from "@/components/pppoe/LookupForm";
import { RouterTable } from "@/components/pppoe/RouterTable";
import { useSubscriberLookup } from "@/hooks/useSubscriberLookup";
import { BillingTable } from "@/components/billing/BillingTable";
import { useBillingCustomer } from "@/hooks/useBillingCustomer";

export default function Subscribers() {
  const [searchParams] = useSearchParams();
  const queryParam =
    searchParams.get("query") || searchParams.get("username") || "";

  const [username, setUsername] = useState(queryParam);

  useEffect(() => {
    const q = searchParams.get("query") || searchParams.get("username") || "";
    if (q) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(q);
    }
  }, [searchParams]);

  const { data, error, isLoading, refetch, isFetching } =
    useSubscriberLookup(username);
  const {
    data: billingData,
    isLoading: billingLoading,
    error: billingError,
    refetch: billingRefetch,
  } = useBillingCustomer(username);

  const handleSearch = (value: string) => {
    if (value === username) {
      refetch();
      billingRefetch();
    } else {
      setUsername(value);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">PPPoE Lookup</h1>

      <LookupForm
        onSearch={handleSearch}
        isLoading={isFetching}
        initialValue={username}
      />

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-destructive">User not found</p>}

      {data && !error && (
        <RouterTable matches={data.matches} username={data.username} />
      )}

      {billingLoading && <p>Loading billing data…</p>}

      {billingError && (
        <p className="text-muted-foreground">Billing data not found</p>
      )}

      {billingData && <BillingTable rows={billingData.data} />}
    </div>
  );
}
