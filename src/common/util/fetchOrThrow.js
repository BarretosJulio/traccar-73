import { apiUrl } from './apiUrl';

const getTenantSlug = () => localStorage.getItem('tenantSlug') || 'mabtracker';
const getTraccarEmail = () => localStorage.getItem('traccarEmail') || '';

export default async (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/api') ? apiUrl(input) : input;
  
  const headers = {
    ...(init?.headers || {}),
    'x-tenant-slug': getTenantSlug(),
    'x-traccar-email': getTraccarEmail(),
  };

  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
};
