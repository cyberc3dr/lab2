const API_BASE = '/api/links';

async function apiRequest(path = '', options = {}) {
    const res = await fetch(API_BASE + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!res.ok) {
        let message = `Ошибка ${res.status}`;
        try {
            const body = await res.json();
            if (body.message) message = body.message;
        } catch (_) { /* тело не JSON — оставляем текст по умолчанию */ }
        throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
}

let toastTimer;
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast visible ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function formatDate(iso) {
    return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
}