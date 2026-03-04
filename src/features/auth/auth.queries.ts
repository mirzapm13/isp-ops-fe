import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "./auth.service";
import type { LoginPayload } from "./auth.types";

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  });

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
    enabled: false, // manual trigger
  });
