export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
};

export type User = {
  id: number;
  username: string;
  roles: string[];
  permissions: string[];
};
