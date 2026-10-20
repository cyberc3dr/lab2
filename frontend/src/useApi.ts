import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from './api';
import { useAuth } from './auth';
import { useToast } from './toast';

// Обёртка над apiRequest/authRequest: централизованно обрабатывает ошибки.
// При 401 — чистит токен и редиректит на /login?expired=1
export function useApi() {
  const showToast = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(async <T,>(fn: () => Promise<T | null>): Promise<{ ok: true; data: T | null } | { ok: false }> => {
    try {
      const data = await fn();
      return { ok: true, data };
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        navigate('/login?expired=1', { replace: true });
        showToast('Сессия истекла — войдите заново', 'error');
      } else if (err instanceof Error) {
        showToast(err.message, 'error');
      } else {
        showToast('Ошибка', 'error');
      }
      return { ok: false };
    }
  }, [showToast, logout, navigate]);
}
