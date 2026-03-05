import { apiUrl } from './apiUrl';

export default async (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/api') ? apiUrl(input) : input;
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
};
