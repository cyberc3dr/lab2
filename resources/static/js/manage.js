const form        = document.getElementById('link-form');
const idInput     = document.getElementById('link-id');
const titleInput  = document.getElementById('title');
const urlInput    = document.getElementById('url');
const descInput   = document.getElementById('description');
const submitBtn   = document.getElementById('submit-btn');
const cancelBtn   = document.getElementById('cancel-btn');
const formTitleEl = document.getElementById('form-title');
const listEl      = document.getElementById('manage-list');
const emptyEl     = document.getElementById('manage-empty');
const counterEl   = document.getElementById('manage-counter');

let allLinksCache = [];
let editingId = null;

function startEdit(link) {
    editingId = link.id;
    idInput.value = link.id;
    titleInput.value = link.title;
    urlInput.value = link.url;
    descInput.value = link.description || '';
    formTitleEl.textContent = `Редактирование ссылки #${link.id}`;
    submitBtn.textContent = 'Сохранить изменения';
    cancelBtn.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    titleInput.focus();
}

function resetForm() {
    editingId = null;
    form.reset();
    idInput.value = '';
    formTitleEl.textContent = 'Новая ссылка';
    submitBtn.textContent = 'Добавить ссылку';
    cancelBtn.classList.add('hidden');
}

async function loadLinks() {
    try {
        allLinksCache = await apiRequest('');
        counterEl.textContent = `Записей в хранилище: ${allLinksCache.length} / 50`;
        emptyEl.classList.toggle('hidden', allLinksCache.length > 0);
        listEl.innerHTML = allLinksCache.map(link => `
            <article class="card">
                <div class="card-body">
                    <h2 class="card-title">${escapeHtml(link.title)}</h2>
                    <a class="card-url" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.url)}</a>
                    ${link.description ? `<p class="card-desc">${escapeHtml(link.description)}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn--secondary" data-action="edit" data-id="${link.id}">Изменить</button>
                    <button class="btn btn--danger" data-action="delete" data-id="${link.id}" data-title="${escapeHtml(link.title)}">Удалить</button>
                </div>
            </article>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!titleInput.value.trim()) return showToast('Введите название ссылки', 'error');
    if (!/^https?:\/\/.+/.test(urlInput.value.trim())) return showToast('URL должен начинаться с http:// или https://', 'error');

    const payload = {
        title: titleInput.value,
        url: urlInput.value,
        description: descInput.value
    };
    try {
        if (editingId === null) {
            await apiRequest('', { method: 'POST', body: JSON.stringify(payload) });
            showToast('Ссылка добавлена', 'success');
        } else {
            await apiRequest('/' + editingId, { method: 'PUT', body: JSON.stringify(payload) });
            showToast('Изменения сохранены', 'success');
        }
        resetForm();
        await loadLinks();
    } catch (err) {
        showToast(err.message, 'error'); // сюда прилетит и «хранилище заполнено» (409)
    }
});

cancelBtn.addEventListener('click', resetForm);

listEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);

    if (btn.dataset.action === 'edit') {
        const link = allLinksCache.find(l => l.id === id);
        if (link) startEdit(link);
    }

    if (btn.dataset.action === 'delete') {
        if (!confirm(`Удалить ссылку «${btn.dataset.title}»?`)) return;
        try {
            await apiRequest('/' + id, { method: 'DELETE' });
            showToast('Ссылка удалена', 'success');
            if (editingId === id) resetForm();
            await loadLinks();
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
});

loadLinks();