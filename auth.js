const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toastElement = document.getElementById('toast');

function showToastMessage(message) {
    if (!toastElement) return;
    toastElement.textContent = message;
    toastElement.classList.add('show');
    setTimeout(() => toastElement.classList.remove('show'), 3600);
}

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('password').value;
        
        // Simulando a comunicação com a futura API Backend
        showToastMessage('Autenticando...');
        
        setTimeout(() => {
            if (userEmail && userPassword) {
                localStorage.setItem('userAuthToken', 'fake-jwt-token-12345');
                localStorage.setItem('userName', 'Investidor');
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showToastMessage('Criando conta...');
        
        setTimeout(() => {
            localStorage.setItem('userAuthToken', 'fake-jwt-token-12345');
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}
