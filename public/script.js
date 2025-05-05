
document.getElementById('login-link').addEventListener('click', function() {
    document.getElementById('auth-modal').style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('auth-modal').style.display = 'none';
});
// Получаем элемент для переключения темы
const themeToggle = document.getElementById('theme-toggle');

// Проверяем, сохранена ли тема в localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.classList.add('dark');
}

// Переключаем тему
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.classList.toggle('dark');

    // Сохраняем выбранную тему
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
