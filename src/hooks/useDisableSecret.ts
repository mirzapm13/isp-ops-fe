import { disableSecret } from "@/api/pppoe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDisableSecret(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (router_id: string) => disableSecret(username, router_id),

    onSuccess: () => {
      // 👇 THIS IS THE KEY PART
      queryClient.invalidateQueries({
        queryKey: ["subscriber", username],
      });

      toast.success("PPPoE secret disabled", {
        description: "PPPoE secret has been disabled successfully.",
      });
    },

    onError: (error: { message?: string }) => {
      toast.error("Failed to disable PPPoE Secret", {
        description: error?.message ?? "Unable to disable PPPoE secret.",
      });
    },
  });
}
