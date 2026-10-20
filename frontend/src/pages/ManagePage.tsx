import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../auth';
import LinkCard from '../components/LinkCard';
import { useApi } from '../useApi';
import { useToast } from '../toast';
import type { LinkRequest, LinkResponse } from '../types';

interface FormState {
  title: string;
  url: string;
  description: string;
  isPublic: boolean;
}

const EMPTY_FORM: FormState = { title: '', url: '', description: '', isPublic: false };

export default function ManagePage() {
  const { user } = useAuth();
  const showToast = useToast();
  const runApi = useApi();

  const [links, setLinks] = useState<LinkResponse[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const isAdmin = user?.role === 'ADMIN';

  const loadLinks = useCallback(async () => {
    const result = await runApi(() => apiRequest<LinkResponse[]>(''));
    if (result.ok && result.data) setLinks(result.data);
    else if (result.ok) setLinks([]);
  }, [runApi]);

  useEffect(() => {
    if (user) loadLinks();
  }, [user, loadLinks]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const startEdit = (link: LinkResponse) => {
    setEditingId(link.id);
    setForm({
      title: link.title,
      url: link.url,
      description: link.description || '',
      isPublic: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setField = <K extends keyof FormState>(name: K, value: FormState[K]) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Введите название ссылки', 'error');
      return;
    }
    if (!/^https?:\/\/.+/.test(form.url.trim())) {
      showToast('URL должен начинаться с http:// или https://', 'error');
      return;
    }

    const payload: LinkRequest = {
      title: form.title,
      url: form.url,
      description: form.description || null,
    };
    if (editingId === null && isAdmin) {
      payload.isPublic = form.isPublic;
    }

    if (editingId === null) {
      const result = await runApi(() => apiRequest<LinkResponse>('', { method: 'POST', body: JSON.stringify(payload) }));
      if (result.ok) {
        showToast('Ссылка добавлена', 'success');
        resetForm();
        loadLinks();
      }
    } else {
      const result = await runApi(() => apiRequest<LinkResponse>('/' + editingId, { method: 'PUT', body: JSON.stringify(payload) }));
      if (result.ok) {
        showToast('Изменения сохранены', 'success');
        resetForm();
        loadLinks();
      }
    }
  };

  const handleDelete = async (link: LinkResponse) => {
    if (!window.confirm(`Удалить ссылку «${link.title}»?`)) return;
    const result = await runApi(() => apiRequest<null>('/' + link.id, { method: 'DELETE' }));
    if (result.ok) {
      showToast('Ссылка удалена', 'success');
      if (editingId === link.id) resetForm();
      loadLinks();
    }
  };

  if (!user) {
    return (
      <>
        <h1>Управление ссылками</h1>
        <section className="form-card">
          <h2>Требуется вход</h2>
          <p>Добавлять, изменять и удалять ссылки можно только после входа в аккаунт.</p>
          <div className="form-actions">
            <Link to="/login?next=/manage" className="btn btn-primary">Войти</Link>
            <Link to="/" className="btn btn-secondary">К просмотру ссылок</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <h1>Управление ссылками</h1>

      <section className="form-card">
        <h2>{editingId === null ? 'Новая ссылка' : `Редактирование ссылки #${editingId}`}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="title">Название *</label>
            <input
              id="title"
              className="input"
              required
              maxLength={100}
              placeholder="Например: Документация Kotlin"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="url">URL *</label>
            <input
              id="url"
              className="input"
              required
              placeholder="https://kotlinlang.org"
              value={form.url}
              onChange={(e) => setField('url', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              className="textarea"
              rows={2}
              maxLength={300}
              placeholder="Необязательное описание"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
          {editingId === null && (
            <div className="field">
              <label>
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  disabled={!isAdmin}
                  onChange={(e) => setField('isPublic', e.target.checked)}
                />
                {' '}Публичная ссылка — видна всем без входа (создаёт только админ)
              </label>
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId === null ? 'Добавить ссылку' : 'Сохранить изменения'}
            </button>
            {editingId !== null && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </section>

      <p className="muted small">Записей в хранилище: {links.length}</p>

      <div className="cards">
        {links.map((link) => {
          const canModify = isAdmin || link.userId === user.id;
          return (
            <LinkCard key={link.id} link={link} badge>
              {canModify && (
                <>
                  <button type="button" className="btn btn-secondary" onClick={() => startEdit(link)}>
                    Изменить
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(link)}>
                    Удалить
                  </button>
                </>
              )}
            </LinkCard>
          );
        })}
      </div>

      <div className={'empty' + (links.length > 0 ? ' hidden' : '')}>
        <p>Хранилище пусто. Добавьте первую ссылку через форму выше.</p>
      </div>
    </>
  );
}
