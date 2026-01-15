export interface RouterInfo {
  id: string;
  name: string;
}

export interface ConnectionInfo {
  ip: string;
  uptime: string;
}

export interface PPPoEMatch {
  router: RouterInfo;
  secret: boolean;
  status: "ACTIVE" | "INACTIVE";
  profile: string;
  connection: ConnectionInfo | null;
}

export interface PPPoEResponse {
  username: string;
  matches: PPPoEMatch[];
}

export interface ProfileResponse {
  id: string;
  name: string;
}

export interface CreatePPPoESecretPayload {
  router_id: string;
  name: string;
  password: string;
  profile: string;
  service: "pppoe";
  disabled: boolean;
  comment?: string;
}
