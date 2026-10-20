import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Toast } from './types';

type ToastType = Toast['type'];
type ShowToast = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = useCallback<ShowToast>((message, type = 'info') => {
    setToast({ message, type });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const className = [
    'toast',
    toast ? 'visible' : '',
    toast?.type === 'success' ? 'toast-success' : '',
    toast?.type === 'error' ? 'toast-error' : '',
  ].filter(Boolean).join(' ');

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={className} role="status">
        {toast?.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
