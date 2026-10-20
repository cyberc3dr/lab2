import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';
import LinkCard from '../components/LinkCard';
import { useApi } from '../useApi';
import { useToast } from '../toast';
import { copyToClipboard } from '../utils';
import type { LinkResponse } from '../types';

export default function LinksPage() {
  const showToast = useToast();
  const runApi = useApi();
  const [allLinks, setAllLinks] = useState<LinkResponse[]>([]);
  const [query, setQuery] = useState('');

  const loadLinks = useCallback(async () => {
    const result = await runApi(() => apiRequest<LinkResponse[]>(''));
    if (result.ok && result.data) setAllLinks(result.data);
    else if (result.ok) setAllLinks([]);
  }, [runApi]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const q = query.trim().toLowerCase();
  const filtered = allLinks.filter((link) =>
    !q
    || link.title.toLowerCase().includes(q)
    || (link.description || '').toLowerCase().includes(q)
    || link.url.toLowerCase().includes(q),
  );

  const handleCopy = async (url: string) => {
    try {
      await copyToClipboard(url);
      showToast('Ссылка скопирована в буфер обмена', 'success');
    } catch {
      showToast('Не удалось скопировать ссылку', 'error');
    }
  };

  return (
    <>
      <section className="toolbar">
        <h1>Полезные ссылки</h1>
        <div className="toolbar-actions">
          <input
            type="search"
            className="input"
            placeholder="Поиск по названию или URL…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              showToast('Список обновлён');
              loadLinks();
            }}
          >
            Обновить
          </button>
        </div>
      </section>

      <p className="muted small">Показано: {filtered.length} из {allLinks.length}</p>

      <div className="cards">
        {filtered.map((link) => (
          <LinkCard key={link.id} link={link} showDate>
            <a className="btn btn-primary" href={link.url} target="_blank" rel="noopener noreferrer">
              Перейти ↗
            </a>
            <button type="button" className="btn btn-secondary" onClick={() => handleCopy(link.url)}>
              Скопировать
            </button>
          </LinkCard>
        ))}
      </div>

      <div className={'empty' + (filtered.length > 0 ? ' hidden' : '')}>
        <p>Ссылок пока нет или ничего не найдено по запросу.</p>
        <Link to="/manage" className="btn btn-primary">Добавить первую ссылку</Link>
      </div>
    </>
  );
}
