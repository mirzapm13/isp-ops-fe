import { apiFetch, apiPatch, apiPost } from "./client";
import type {
  CreatePPPoESecretPayload,
  CreatePPPoESecretResponse,
  PPPoEResponse,
  ProfileResponse,
} from "@/types/pppoe";

export function fetchSubscriber(username: string) {
  return apiFetch<PPPoEResponse>(`/api/v1/pppoe/${username}`);
}

export function fetchProfiles(router_id: string) {
  return apiFetch<ProfileResponse[]>(`/api/v1/pppoe/profile/${router_id}`);
}

export function patchProfile(
  username: string,
  routerId: string,
  profile: string,
) {
  console.log(profile);
  return apiPatch(`/api/v1/pppoe/${username}`, {
    router_id: routerId,
    profile: profile,
  });
}

export function deactivatePPPoE(username: string, router_id: string) {
  return apiPost(`/api/v1/pppoe/${username}/deactivate`, { router_id });
}

export function disableSecret(username: string, router_id: string) {
  return apiPost(`/api/v1/pppoe/${username}/disable`, { router_id });
}

export function enableSecret(username: string, router_id: string) {
  return apiPost(`/api/v1/pppoe/${username}/enable`, { router_id });
}

export function deleteSecret(username: string, router_id: string) {
  return apiPost(`/api/v1/pppoe/${username}/delete`, { router_id });
}

export function createPPPoESecret(payload: CreatePPPoESecretPayload) {
  return apiPost<CreatePPPoESecretResponse>("/api/v1/pppoe/secret", payload);
}
