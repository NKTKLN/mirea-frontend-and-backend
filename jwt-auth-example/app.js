let token = null;

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    document.getElementById('registerMessage').textContent = result.message || 'Ошибка регистрации';
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        token = result.token;
        document.getElementById('loginMessage').textContent = 'Вход выполнен успешно';
    } else {
        document.getElementById('loginMessage').textContent = result.message || 'Ошибка входа';
    }
});

document.getElementById('fetchProtectedData').addEventListener('click', async () => {
    if (!token) {
        document.getElementById('protectedData').textContent = 'Сначала войдите в систему';
        return;
    }

    const response = await fetch('http://localhost:3000/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    if (response.ok) {
        document.getElementById('protectedData').textContent = JSON.stringify(result);
    } else {
        document.getElementById('protectedData').textContent = 'Доступ запрещен';
    }
});
