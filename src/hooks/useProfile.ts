import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfiles, patchProfile } from "@/api/pppoe";
import { toast } from "sonner";

export function useFetchProfile(routerId: string) {
  return useQuery({
    queryKey: [routerId],
    queryFn: () => fetchProfiles(routerId),
    enabled: !!routerId,
    retry: false,
  });
}

export function usePatchProfile(username: string, routerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: string) => patchProfile(username, routerId, profile),
    onSuccess: () => {
      // 👇 THIS IS THE KEY PART
      queryClient.invalidateQueries({
        queryKey: ["subscriber", username],
      });

      toast.success("PPPoE Profile Updated", {
        description: "PPPoE profile has been updated successfully.",
      });
    },

    onError: (error: { message?: string }) => {
      toast.error("Failed to update PPPoE Profile", {
        description: error?.message ?? "Unable to update PPPoE profile.",
      });
    },
  });
}
