export interface RouterInfo {
  id: string;
  name: string;
}

export interface ConnectionInfo {
  ip: string;
  uptime: string;
}

export interface PPPoEMatch {
  name: string;
  password: string;
  comment?: string;
  router: RouterInfo;
  secret: boolean;
  status: "ACTIVE" | "INACTIVE";
  profile: string;
  connection: ConnectionInfo | null;
  matched_mac?: string;
  matched_by?: "caller-id" | "last-caller-id";
}

export interface PPPoEResponse {
  username: string;
  matches: PPPoEMatch[];
}

export interface PPPoEMacResponse {
  mac_address: string;
  matches: PPPoEMatch[];
}

export interface ProfileResponse {
  id: string;
  name: string;
}

export interface CreatePPPoESecretPayload {
  router: string;
  name: string;
  password: string;
  profile: string;
  service: "pppoe";
  disabled: "yes" | "no";
  comment?: string;
}

export interface CreatePPPoESecretResponse {
  result: {
    status: string;
    router_id: string;
    error?: string;
  };
  status: string;
}

export interface RemoteResponse {
  updated: boolean;
  ip: string;
}
