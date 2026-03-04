import { apiGet } from "@/lib/api";
import type { BillingResponse } from "@/types/billing";

export function fetchBillingCustomer(ipSecret: string) {
  return apiGet<BillingResponse>(`/billing/customers/${ipSecret}`);
}

export async function uploadBillingFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/billing/import`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error ?? { message: "Import failed" };
  }

  return res.json();
}

export async function uploadIsolirFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/billing/isolir`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error ?? { message: "Isolir failed" };
  }

  return res.json();
}
