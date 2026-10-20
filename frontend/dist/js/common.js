const API_BASE = '/api/links';
const AUTH_BASE = '/api/auth';
const TOKEN_KEY = 'links_token';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function getAuthUser() {
    const token = getToken();
    if (!token) return null;
    try {
        const payloadPart = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(payloadPart));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            clearToken();
            return null;
        }
        return { id: payload.uid, username: payload.sub, role: payload.role };
    } catch (_) {
        return null;
    }
}

function authHeaders() {
    const token = getToken();
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function updateAuthNav() {
    const link = document.getElementById('auth-link');
    if (!link) return;
    const user = getAuthUser();
    if (user) {
        link.textContent = 'Выйти (' + user.username + ')';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            clearToken();
            location.href = 'index.html';
        });
    } else {
        link.textContent = 'Войти';
        link.href = 'login.html';
    }
}

async function requestJson(url, options = {}, redirectOn401 = false) {
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(options.headers || {}) }
    });
    if (res.status === 401 && redirectOn401) {
        clearToken();
        updateAuthNav();
        if (!location.pathname.endsWith('login.html')) location.href = 'login.html?expired=1';
        throw new Error('Сессия истекла — войдите заново');
    }
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

function apiRequest(path = '', options = {}) {
    return requestJson(API_BASE + path, options, true);
}

function authRequest(path = '', options = {}) {
    return requestJson(AUTH_BASE + path, options, false);
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

updateAuthNav();
