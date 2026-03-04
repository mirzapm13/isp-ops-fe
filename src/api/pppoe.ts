import { apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  CreatePPPoESecretPayload,
  CreatePPPoESecretResponse,
  PPPoEResponse,
  ProfileResponse,
} from "@/types/pppoe";

export function fetchSubscriber(username: string) {
  return apiGet<PPPoEResponse>(`/pppoe/${username}`);
}

export function fetchProfiles(router_id: string) {
  return apiGet<ProfileResponse[]>(`/pppoe/profile/${router_id}`);
}

export function patchProfile(
  username: string,
  routerId: string,
  profile: string,
) {
  console.log(profile);
  return apiPatch(`/pppoe/${username}`, {
    router_id: routerId,
    profile: profile,
  });
}

export function deactivatePPPoE(username: string, router_id: string) {
  return apiPost(`/pppoe/${username}/deactivate`, { router_id });
}

export function disableSecret(username: string, router_id: string) {
  return apiPost(`/pppoe/${username}/disable`, { router_id });
}

export function enableSecret(username: string, router_id: string) {
  return apiPost(`/pppoe/${username}/enable`, { router_id });
}

export function deleteSecret(username: string, router_id: string) {
  return apiPost(`/pppoe/${username}/delete`, { router_id });
}

export function createPPPoESecret(payload: CreatePPPoESecretPayload) {
  return apiPost<CreatePPPoESecretResponse>("/pppoe/secret", payload);
}
