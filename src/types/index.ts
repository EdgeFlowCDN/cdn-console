export interface Domain {
  id: number;
  domain: string;
  cname: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Origin {
  id: number;
  domain_id: number;
  addr: string;
  port: number;
  weight: number;
  priority: number;
  protocol: string;
  created_at: string;
}

export interface CacheRule {
  id: number;
  domain_id: number;
  path_pattern: string;
  ttl: number;
  ignore_query: boolean;
  priority: number;
  created_at: string;
}

export interface Certificate {
  id: number;
  domain_id: number;
  issuer: string;
  not_before: string;
  not_after: string;
  auto_renew: boolean;
  created_at: string;
}

export interface Node {
  id: number;
  name: string;
  ip: string;
  region: string;
  isp: string;
  status: string;
  max_bandwidth: number;
  last_heartbeat: string | null;
  created_at: string;
}

export interface PurgeTask {
  id: number;
  type: string;
  targets: string[];
  domain: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export interface LoginResponse {
  token: string;
}
