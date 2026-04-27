import { enableSecret } from "@/api/pppoe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useEnableSecret(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (router_id: string) => enableSecret(username, router_id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriber", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriber-mac"],
      });

      toast.success("PPPoE secret enabled", {
        description: "PPPoE secret has been enabled successfully.",
      });
    },

    onError: (error: { message?: string }) => {
      toast.error("Failed to enable PPPoE Secret", {
        description: error?.message ?? "Unable to enable PPPoE secret.",
      });
    },
  });
}
