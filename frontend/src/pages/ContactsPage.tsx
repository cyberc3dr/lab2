import { useToast } from '../toast';
import { copyToClipboard } from '../utils';

export default function ContactsPage() {
  const showToast = useToast();

  const handleCopy = async (value: string) => {
    try {
      await copyToClipboard(value);
      showToast('Скопировано: ' + value, 'success');
    } catch {
      showToast('Не удалось скопировать', 'error');
    }
  };

  return (
    <>
      <h1>Контакты предприятия</h1>
      <div className="contact-grid">
        <div className="contact-card">
          <h2>Адрес</h2>
          <p>ООО «Цифровые Решения»</p>
          <p>г. Нижний Новгород, пр. Гагарина, д. 10</p>
          <p>
            <a
              href="https://yandex.ru/maps/?text=Нижний Новгород, пр. Гагарина, д. 10"
              target="_blank"
              rel="noopener noreferrer"
            >
              Показать на карте ↗
            </a>
          </p>
        </div>
        <div className="contact-card">
          <h2>Связь</h2>
          <div className="contact-row">
            <span>📞 +7 (831) 123-45-67</span>
            <button type="button" className="btn btn-secondary" onClick={() => handleCopy('+78311234567')}>
              Копировать
            </button>
          </div>
          <div className="contact-row">
            <span>✉️ info@example.com</span>
            <button type="button" className="btn btn-secondary" onClick={() => handleCopy('info@example.com')}>
              Копировать
            </button>
          </div>
        </div>
        <div className="contact-card">
          <h2>Часы работы</h2>
          <p>Пн–Пт: 09:00 — 18:00</p>
          <p>Сб–Вс: выходной</p>
        </div>
      </div>
    </>
  );
}
