import { type ReactNode } from 'react';
import { formatDate } from '../utils';
import type { LinkResponse } from '../types';

interface LinkCardProps {
  link: LinkResponse;
  badge?: boolean;
  showDate?: boolean;
  children?: ReactNode;
}

export default function LinkCard({ link, badge = false, showDate = false, children }: LinkCardProps) {
  return (
    <article className="card">
      <div className="card-body">
        <h2 className="card-title">
          {link.title}
          {badge && link.userId === null ? ' · публичная' : ''}
        </h2>
        <a className="card-url" href={link.url} target="_blank" rel="noopener noreferrer">
          {link.url}
        </a>
        {link.description ? <p className="card-desc">{link.description}</p> : null}
        {showDate ? <p className="muted small">Добавлена: {formatDate(link.createdAt)}</p> : null}
      </div>
      {children ? <div className="card-actions">{children}</div> : null}
    </article>
  );
}
