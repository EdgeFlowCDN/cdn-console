import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const client = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;

// Auth
export const login = (username: string, password: string) =>
  client.post('/auth/login', { username, password });

// Domains
export const getDomains = () => client.get('/domains');
export const getDomain = (id: number) => client.get(`/domains/${id}`);
export const createDomain = (domain: string) => client.post('/domains', { domain });
export const updateDomain = (id: number, data: { status?: string; cname?: string }) =>
  client.put(`/domains/${id}`, data);
export const deleteDomain = (id: number) => client.delete(`/domains/${id}`);

// Origins
export const getOrigins = (domainId: number) => client.get(`/domains/${domainId}/origins`);
export const createOrigin = (domainId: number, data: { addr: string; weight?: number; priority?: number }) =>
  client.post(`/domains/${domainId}/origins`, data);
export const deleteOrigin = (domainId: number, originId: number) =>
  client.delete(`/domains/${domainId}/origins/${originId}`);

// Cache Rules
export const getCacheRules = (domainId: number) => client.get(`/domains/${domainId}/cache-rules`);
export const createCacheRule = (domainId: number, data: { path_pattern: string; ttl: number; ignore_query?: boolean }) =>
  client.post(`/domains/${domainId}/cache-rules`, data);
export const deleteCacheRule = (domainId: number, ruleId: number) =>
  client.delete(`/domains/${domainId}/cache-rules/${ruleId}`);

// Purge
export const purgeURL = (targets: string[], domain: string) =>
  client.post('/purge/url', { targets, domain });
export const purgeDir = (targets: string[], domain: string) =>
  client.post('/purge/dir', { targets, domain });
export const purgeAll = (domain: string) =>
  client.post('/purge/all', { targets: ['*'], domain });
export const getPurgeTask = (id: number) => client.get(`/purge/tasks/${id}`);

// Certificates
export const getCertificates = () => client.get('/certs');
export const uploadCert = (domainId: number, data: { cert_pem: string; key_pem: string }) =>
  client.post(`/domains/${domainId}/certs`, data);
export const deleteCert = (certId: number) => client.delete(`/certs/${certId}`);

// Nodes
export const getNodes = () => client.get('/nodes');
export const getNode = (id: number) => client.get(`/nodes/${id}`);
export const updateNodeStatus = (id: number, status: string) =>
  client.put(`/nodes/${id}/status`, { status });
