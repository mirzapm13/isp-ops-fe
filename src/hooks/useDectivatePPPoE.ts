import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivatePPPoE } from "@/api/pppoe";
import { toast } from "sonner";

export function useDeactivatePPPoE(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (router_id: string) => deactivatePPPoE(username, router_id),

    onSuccess: () => {
      // 👇 THIS IS THE KEY PART
      queryClient.invalidateQueries({
        queryKey: ["subscriber", username],
      });

      toast.success("PPPoE disconnected", {
        description: "Active session has been terminated successfully.",
      });
    },

    onError: (error: { message?: string }) => {
      toast.error("Failed to deactivate PPPoE", {
        description: error?.message ?? "Unable to terminate PPPoE session.",
      });
    },
  });
}
