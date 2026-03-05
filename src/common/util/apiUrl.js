const getApiBase = () => {
  // In development with proxy, use relative URLs
  if (import.meta.env.DEV) {
    return '';
  }
  // In production, point to the actual Traccar server
  return 'https://web.mabtracker.com.br';
};

export const API_BASE = getApiBase();

export const apiUrl = (path) => `${API_BASE}${path}`;
