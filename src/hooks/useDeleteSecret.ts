import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSecret } from "@/api/pppoe";
import { toast } from "sonner";

export function useDeleteSecret(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (router_id: string) => deleteSecret(username, router_id),

    onSuccess: () => {
      // 👇 THIS IS THE KEY PART
      queryClient.invalidateQueries({
        queryKey: ["subscriber", username],
      });

      toast.success("PPPoE deleted", {
        description: "PPPoE secret has been deleted successfully.",
      });
    },

    onError: (error: { message?: string }) => {
      toast.error("Failed to delete PPPoE secret", {
        description: error?.message ?? "Unable to delete PPPoE secret.",
      });
    },
  });
}
