
document.getElementById('login-link').addEventListener('click', function() {
    document.getElementById('auth-modal').style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('auth-modal').style.display = 'none';
});
