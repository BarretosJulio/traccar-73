import { apiUrl } from './apiUrl';
import { DEFAULT_TENANT_SLUG } from './constants';

const getTenantSlug = () => localStorage.getItem('tenantSlug') || DEFAULT_TENANT_SLUG;
const getTraccarEmail = () => localStorage.getItem('traccarEmail') || '';

/**
 * Maps raw technical error messages to user-friendly messages.
 */
const friendlyMessages = {
  'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  'NetworkError': 'Erro de rede. Verifique sua conexão com a internet.',
  'Load failed': 'Falha ao carregar dados. Verifique sua conexão.',
  'Session expired': 'Sessão expirada. Faça login novamente.',
  'Unexpected server response': 'Resposta inesperada do servidor. Tente novamente.',
};

/**
 * Translates technical error messages to user-friendly Portuguese messages.
 */
const translateError = (rawMessage) => {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }

  // Check direct matches
  for (const [key, friendly] of Object.entries(friendlyMessages)) {
    if (rawMessage.includes(key)) return friendly;
  }

  // JSON parse errors
  if (rawMessage.includes('is not valid JSON') || rawMessage.includes('Unexpected token') || rawMessage.includes('JSON.parse')) {
    return 'O servidor retornou uma resposta inválida. Tente novamente mais tarde.';
  }

  // Java/Traccar backend exceptions
  if (rawMessage.includes('NullPointerException')) {
    return 'Erro interno do servidor. Verifique os dados e tente novamente.';
  }
  if (rawMessage.includes('Exception') || rawMessage.includes('java.')) {
    const cleanMsg = rawMessage.replace(/^(?:(?:[\w$.]+\.)*[\w$]+(?:Exception|Error)?:\s*)+/i, '').trim();
    return cleanMsg || 'Erro interno do servidor. Tente novamente.';
  }

  // HTTP status codes
  if (rawMessage.includes('403') || rawMessage.toLowerCase().includes('forbidden')) {
    return 'Você não tem permissão para realizar esta ação.';
  }
  if (rawMessage.includes('404') || rawMessage.toLowerCase().includes('not found')) {
    return 'Recurso não encontrado. Pode ter sido removido.';
  }
  if (rawMessage.includes('409') || rawMessage.toLowerCase().includes('conflict')) {
    return 'Conflito: este registro já existe ou está em uso.';
  }
  if (rawMessage.includes('500') || rawMessage.toLowerCase().includes('internal server error')) {
    return 'Erro interno do servidor. Tente novamente mais tarde.';
  }

  // If message is too technical (contains stack traces, class names, etc.)
  if (rawMessage.length > 200 || /[\w.]+Exception|at\s+[\w.$]+\(/.test(rawMessage)) {
    return 'Erro no servidor. Tente novamente ou contate o suporte.';
  }

  return rawMessage;
};

const fetchOrThrow = async (input, init) => {
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

  let response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (networkError) {
    throw new Error(translateError(networkError.message));
  }

  if (!response.ok) {
    if (response.status === 401) {
      const loginPath = '/login';
      if (window.location.pathname !== loginPath) {
        window.sessionStorage.setItem('sessionExpired', 'true');
        window.location.href = loginPath;
      }
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Resposta inesperada do servidor. Verifique sua conexão.');
    }

    let errorText;
    try {
      errorText = await response.text();
    } catch {
      errorText = `Erro ${response.status}`;
    }

    throw new Error(translateError(errorText));
  }

  // Wrap response with safe .json() method
  const originalJson = response.json.bind(response);
  response.json = async () => {
    try {
      return await originalJson();
    } catch (parseError) {
      throw new Error('O servidor retornou uma resposta inválida. Tente novamente mais tarde.');
    }
  };

  return response;
};

export default fetchOrThrow;
export { translateError };
