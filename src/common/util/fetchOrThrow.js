import { apiUrl } from './apiUrl';
import { DEFAULT_TENANT_SLUG } from './constants';

const getTenantSlug = () => localStorage.getItem('tenantSlug') || DEFAULT_TENANT_SLUG;
const getTraccarEmail = () => localStorage.getItem('traccarEmail') || '';

export default async (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/api') ? apiUrl(input) : input;
  
  const headers = {
    ...(init?.headers || {}),
    'x-tenant-slug': getTenantSlug(),
    'x-traccar-email': getTraccarEmail(),
  };

  // Add Content-Type for POST/PUT/PATCH if body is URLSearchParams
  if (init?.body instanceof URLSearchParams && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    if (response.status === 401) {
      // Session expired — redirect to login with friendly message
      const loginPath = '/login';
      if (window.location.pathname !== loginPath) {
        window.sessionStorage.setItem('sessionExpired', 'true');
        window.location.href = loginPath;
      }
      throw new Error('Session expired');
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Unexpected server response. Please check your connection.');
    }
    throw new Error(await response.text());
  }
  return response;
};
