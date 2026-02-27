export type PppoeSecretCreateRequest = {
  name: string;
  password: string;
  comment?: string;
  service: "pppoe";
  profile: string;
  router: string; // "all" or routerId
  disabled: "no";
};

export type RouterOption = {
  id: string;
  name: string;
};

export type ProfileOption = {
  name: string;
};
