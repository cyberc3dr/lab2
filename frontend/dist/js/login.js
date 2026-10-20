const form        = document.getElementById('auth-form');
const usernameEl  = document.getElementById('username');
const passwordEl  = document.getElementById('password');
const submitBtn   = document.getElementById('submit-btn');
const switchBtn   = document.getElementById('switch-btn');
const pageTitleEl = document.getElementById('auth-title');

let mode = 'login';

function setMode(next) {
    mode = next;
    const registering = mode === 'register';
    pageTitleEl.textContent = registering ? 'Регистрация' : 'Вход в аккаунт';
    submitBtn.textContent = registering ? 'Зарегистрироваться' : 'Войти';
    switchBtn.textContent = registering ? 'Уже есть аккаунт — войти' : 'Регистрация';
    passwordEl.autocomplete = registering ? 'new-password' : 'current-password';
    usernameEl.focus();
}

switchBtn.addEventListener('click', () => setMode(mode === 'login' ? 'register' : 'login'));

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameEl.value.trim();
    const password = passwordEl.value;
    if (!username) return showToast('Введите логин', 'error');
    if (!password) return showToast('Введите пароль', 'error');
    if (mode === 'register' && password.length < 6) return showToast('Пароль — минимум 6 символов', 'error');

    try {
        const data = await authRequest('/' + (mode === 'register' ? 'register' : 'login'), {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        setToken(data.token);
        updateAuthNav();
        showToast(mode === 'register' ? 'Регистрация успешна' : 'Вход выполнен', 'success');
        const next = new URLSearchParams(location.search).get('next');
        setTimeout(() => { location.href = next || 'index.html'; }, 400);
    } catch (err) {
        showToast(err.message, 'error');
    }
});

if (getAuthUser()) {
    updateAuthNav();
}

if (new URLSearchParams(location.search).get('expired')) {
    showToast('Сессия истекла — войдите заново', 'error');
}
