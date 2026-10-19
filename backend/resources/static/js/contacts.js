document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy)
            .then(() => showToast('Скопировано: ' + btn.dataset.copy, 'success'))
            .catch(() => showToast('Не удалось скопировать', 'error'));
    });
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (name.length < 2)      return showToast('Введите имя (минимум 2 символа)', 'error');
    if (!/^\S+@\S+\.\S+$/.test(email)) return showToast('Введите корректный email', 'error');
    if (message.length < 10)  return showToast('Сообщение слишком короткое (минимум 10 символов)', 'error');

    showToast(`Спасибо, ${name}! Сообщение отправлено (демо-режим).`, 'success');
    e.target.reset();
});