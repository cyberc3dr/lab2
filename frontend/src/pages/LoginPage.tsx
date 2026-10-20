import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authRequest } from '../api';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import type { AuthResponse } from '../types';

export default function LoginPage() {
  const { login, user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registering = mode === 'register';

  useEffect(() => {
    if (searchParams.get('expired')) {
      showToast('Сессия истекла — войдите заново', 'error');
    }
    // показываем уведомление один раз при заходе на страницу
  }, []);

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) {
      showToast('Введите логин', 'error');
      return;
    }
    if (!password) {
      showToast('Введите пароль', 'error');
      return;
    }
    if (registering && password.length < 6) {
      showToast('Пароль — минимум 6 символов', 'error');
      return;
    }

    try {
      const data = await authRequest<AuthResponse>('/' + (registering ? 'register' : 'login'), {
        method: 'POST',
        body: JSON.stringify({ username: u, password }),
      });
      if (data && data.token) {
        login(data.token);
        showToast(registering ? 'Регистрация успешна' : 'Вход выполнен', 'success');
        const next = searchParams.get('next');
        setTimeout(() => navigate(next || '/', { replace: true }), 400);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message, 'error');
      } else {
        showToast('Ошибка', 'error');
      }
    }
  };

  return (
    <>
      <h1>{registering ? 'Регистрация' : 'Вход в аккаунт'}</h1>
      {user && (
        <p className="muted small" style={{ marginBottom: 12 }}>
          Вы уже вошли как <strong>{user.username}</strong>. Повторный вход заменит текущую сессию.
        </p>
      )}
      <section className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Логин *</label>
            <input
              id="username"
              className="input"
              required
              maxLength={50}
              autoComplete="username"
              placeholder="Например: user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="password">Пароль *</label>
            <input
              id="password"
              className="input"
              type="password"
              required
              maxLength={100}
              autoComplete={registering ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {registering ? 'Зарегистрироваться' : 'Войти'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={switchMode}>
              {registering ? 'Уже есть аккаунт — войти' : 'Регистрация'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
