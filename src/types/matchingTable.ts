import type { BillingRow } from "./billing";

export type MatchRow = BillingRow & {
  router_id: string;
  router_name: string;
  name: string;
  uptime: string;
  ip: string;
  profile: string;
  comment: string;
};

export type MatchResponse = {
  active_no_billing: {
    count: number;
    data: MatchRow[];
  };
  billing_no_active: {
    count: number;
    data: MatchRow[];
  };
  double_ip: {
    count: number;
    data: MatchRow[];
  };
  double_active: {
    count: number;
    data: MatchRow[];
  };
  static_ip: {
    count: number;
    data: MatchRow[];
  };
};
