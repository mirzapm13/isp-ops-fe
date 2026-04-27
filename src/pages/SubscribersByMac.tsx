import { useState } from "react";
import { MacLookupForm } from "@/components/pppoe/MacLookupForm";
import { MacRouterTable } from "@/components/pppoe/MacRouterTable";
import { useSubscriberLookupByMac } from "@/hooks/useSubscriberLookupByMac";

export default function SubscribersByMac() {
  const [address, setAddress] = useState("");
  const { data, error, isLoading, isFetching, refetch } =
    useSubscriberLookupByMac(address);

  const handleSearch = (value: string) => {
    if (value === address) {
      refetch();
    } else {
      setAddress(value);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">PPPoE MAC Lookup</h1>

      <MacLookupForm onSearch={handleSearch} isLoading={isFetching} />

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-destructive">MAC address not found</p>}

      {data && !error && (
        <MacRouterTable matches={data.matches} macAddress={data.mac_address} />
      )}
    </div>
  );
}
