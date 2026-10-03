let allLinks = [];
let query = '';

const listEl   = document.getElementById('links-list');
const emptyEl  = document.getElementById('empty');
const counterEl = document.getElementById('counter');
const searchEl = document.getElementById('search');

async function loadLinks() {
    try {
        allLinks = await apiRequest('');
        applyFilter();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function applyFilter() {
    const q = query.trim().toLowerCase();
    const filtered = allLinks.filter(link =>
        !q ||
        link.title.toLowerCase().includes(q) ||
        (link.description || '').toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q)
    );
    render(filtered);
}

function render(links) {
    counterEl.textContent = `Показано: ${links.length} из ${allLinks.length}`;
    emptyEl.classList.toggle('hidden', links.length > 0);
    listEl.innerHTML = links.map(link => `
        <article class="card">
            <div class="card-body">
                <h2 class="card-title">${escapeHtml(link.title)}</h2>
                <a class="card-url" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.url)}</a>
                ${link.description ? `<p class="card-desc">${escapeHtml(link.description)}</p>` : ''}
                <p class="muted small">Добавлена: ${formatDate(link.createdAt)}</p>
            </div>
            <div class="card-actions">
                <a class="btn btn--primary" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">Перейти ↗</a>
                <button class="btn btn--secondary" data-action="copy" data-url="${escapeHtml(link.url)}">Скопировать</button>
            </div>
        </article>
    `).join('');
}

listEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="copy"]');
    if (!btn) return;
    navigator.clipboard.writeText(btn.dataset.url)
        .then(() => showToast('Ссылка скопирована в буфер обмена', 'success'))
        .catch(() => showToast('Не удалось скопировать ссылку', 'error'));
});

searchEl.addEventListener('input', () => { query = searchEl.value; applyFilter(); });
document.getElementById('refresh').addEventListener('click', () => {
    showToast('Список обновлён');
    loadLinks();
});

loadLinks();