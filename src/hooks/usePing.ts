import { useMutation } from "@tanstack/react-query";
import { pingPPPoE, type PingRequest } from "@/api/network";

export function usePing() {
  return useMutation({
    mutationFn: (payload: PingRequest) => pingPPPoE(payload),
  });
}
