import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.service";
import type { LoginPayload } from "./auth.types";

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onError: (res) => {
      console.log(res);
    },
  });

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
    enabled: false, // manual trigger
  });

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => authService.logout(),

    onSuccess: () => {
      // clear all cached data (important)
      queryClient.clear();

      // optional: redirect
      window.location.href = "/login";
    },
  });
};
