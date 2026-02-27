import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPPPoESecret, fetchProfiles, patchProfile } from "@/api/pppoe";
import { toast } from "sonner";
import type { CreatePPPoESecretPayload } from "@/types/pppoe";

export function useFetchProfile(routerId: string) {
  return useQuery({
    queryKey: [routerId],
    queryFn: () => fetchProfiles(routerId),
    enabled: !!routerId,
    retry: false,
  });
}

export function useCreateSecret() {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePPPoESecretPayload) =>
      createPPPoESecret(payload),

    onSuccess: (data) => {
      console.log(data.status);

      switch (data.status) {
        case "success":
          toast.success("PPPoE Secret Created");
          break;

        case "warning":
          toast.warning("Sebagian gagal, check details");
          break;

        case "failed":
          toast.error("Failed to create PPPoE secret");
          break;

        default:
          toast.error("Internal Server Error");
          break;
      }

      toast("You submitted the following values:", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(data.result, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });

      // optional: invalidate list if you have one
      // queryClient.invalidateQueries({
      //   queryKey: ["pppoe-secrets"],
      // });
    },

    onError: (error: { message?: string }) => {
      toast.error("Failed to create PPPoE Secret", {
        description: error?.message ?? "Unknown error",
      });
    },
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
