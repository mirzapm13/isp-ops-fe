import { apiGet } from "@/lib/api";
import type { BillingResponse, BillingPaginatedResponse } from "@/types/billing";

export function fetchBillingCustomer(ipSecret: string) {
  return apiGet<BillingResponse>(`/billing/customers/${ipSecret}`);
}

export function fetchBillingCustomersPaginated(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const queryString = query.toString();
  return apiGet<BillingPaginatedResponse>(
    `/billing/customers${queryString ? `?${queryString}` : ""}`
  );
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
