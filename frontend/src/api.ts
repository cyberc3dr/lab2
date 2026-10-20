import type { AuthUser } from './types';

const API_BASE = '/api/links';
const AUTH_BASE = '/api/auth';
const TOKEN_KEY = 'links_token';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface JwtPayload {
  sub: string;
  uid: number;
  role: AuthUser['role'];
  exp?: number;
  iat?: number;
}

export function decodeUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadPart = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadPart.padEnd(payloadPart.length + ((4 - (payloadPart.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded)) as JwtPayload;
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearToken();
      return null;
    }
    return { id: payload.uid, username: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: 'Bearer ' + token } : {};
}

async function requestJson<T = unknown>(url: string, options: RequestInit = {}): Promise<T | null> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  if (res.status === 204) return null;
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* тело не JSON — оставляем сообщение по умолчанию */
  }
  if (!res.ok) {
    throw new ApiError(res.status, body?.message || `Ошибка ${res.status}`);
  }
  return body as T;
}

export function apiRequest<T = unknown>(path = '', options: RequestInit = {}): Promise<T | null> {
  return requestJson<T>(API_BASE + path, options);
}

export function authRequest<T = unknown>(path = '', options: RequestInit = {}): Promise<T | null> {
  return requestJson<T>(AUTH_BASE + path, options);
}
