import { apiPost } from "@/lib/api";

export interface PingRequest {
  pppoeName: string;
  router_id: string;
  count: number;
}

export interface PingDetail {
  seq: number;
  host: string;
  size: number;
  ttl: number;
  time: string;
  sent: number;
  received: number;
  "packet-loss": number;
  "min-rtt": string;
  "avg-rtt": string;
  "max-rtt": string;
}

export interface PingResponse {
  router: {
    id: string;
    name: string;
  };
  target: string;
  results: {
    sent: number;
    received: number;
    loss_percent: number;
    avg_ms: number;
    details: PingDetail[];
  };
}

// export async function pingPPPoE({ pppoeName, router_id, count }: PingRequest) {
//   const res = await fetch(
//     `${import.meta.env.VITE_API_BASE_URL}/api/v1/pppoe/${pppoeName}/ping`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ router_id, count }),
//     }
//   );

//   if (!res.ok) {
//     const err = await res.json().catch(() => null);
//     throw err ?? { message: "Ping failed" };
//   }

//   return res.json() as Promise<PingResponse>;
// }

export async function pingPPPoE({
  pppoeName,
  router_id,
  count,
}: PingRequest): Promise<PingResponse> {
  return apiPost(`/pppoe/${pppoeName}/ping`, { router_id, count });
}
