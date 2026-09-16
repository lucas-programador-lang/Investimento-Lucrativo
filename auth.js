const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('password').value;
        
        document.getElementById('login-btn').innerText = 'Aguarde...';
        
        setTimeout(() => {
            if (userEmail && userPassword) {
                localStorage.setItem('userAuthToken', 'fake-jwt-token-12345');
                localStorage.setItem('userName', 'Investidor');
                window.location.href = 'dashboard.html';
            }
        }, 800);
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById('register-btn').innerText = 'Criando...';
        
        setTimeout(() => {
            localStorage.setItem('userAuthToken', 'fake-jwt-token-12345');
            window.location.href = 'dashboard.html';
        }, 1000);
    });
}
