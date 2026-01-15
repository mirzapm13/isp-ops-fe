import { useState } from "react";
import { LookupForm } from "@/components/pppoe/LookupForm";
import { RouterTable } from "@/components/pppoe/RouterTable";
import { useSubscriberLookup } from "@/hooks/useSubscriberLookup";
import { BillingTable } from "@/components/billing/BillingTable";
import { useBillingCustomer } from "@/hooks/useBillingCustomer";

export default function Subscribers() {
  const [username, setUsername] = useState("");
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

      <LookupForm onSearch={handleSearch} isLoading={isFetching} />

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-destructive">User not found</p>}

      {data && <RouterTable matches={data.matches} username={data.username} />}

      {billingLoading && <p>Loading billing data…</p>}

      {billingError && (
        <p className="text-muted-foreground">Billing data not found</p>
      )}

      {billingData && <BillingTable rows={billingData.data} />}
    </div>
  );
}
