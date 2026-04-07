import { useMutation } from "@tanstack/react-query";
import { remoteClient } from "@/api/pppoe";

export function useRemoteClient() {
  return useMutation({
    mutationFn: ({ ip, router_id }: { ip: string; router_id: string }) =>
      remoteClient(ip, router_id),
  });
}
