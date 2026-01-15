import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPPPoESecret } from "@/api/pppoe";
import { toast } from "sonner";

export function useCreatePPPoESecret(username?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPPPoESecret,

    onSuccess: () => {
      toast.success("PPPoE secret created");

      if (username) {
        queryClient.invalidateQueries({
          queryKey: ["subscriber", username],
        });
      }
    },

    onError: (error) => {
      toast.error("Failed to create PPPoE secret", {
        description: error?.message ?? "Unknown error",
      });
    },
  });
}
