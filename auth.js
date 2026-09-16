const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const loginBtn = document.getElementById('login-btn');
        loginBtn.innerText = 'Entrando...';
        loginBtn.disabled = true;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Salva o ID real do usuário que veio do banco Neon
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userName', data.user.name || 'Investidor');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Erro ao fazer login.');
                loginBtn.innerText = 'Entrar na Plataforma';
                loginBtn.disabled = false;
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
            loginBtn.innerText = 'Entrar na Plataforma';
            loginBtn.disabled = false;
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Ajuste os IDs abaixo conforme o seu formulário de cadastro (ex: name, email, password)
        const name = document.getElementById('name') ? document.getElementById('name').value : 'Novo Investidor';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const registerBtn = document.getElementById('register-btn');
        registerBtn.innerText = 'Criando conta...';
        registerBtn.disabled = true;
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Conta criada com sucesso! Faça login.');
                window.location.href = 'login.html';
            } else {
                alert(data.error || 'Erro ao cadastrar.');
                registerBtn.innerText = 'Criar Conta';
                registerBtn.disabled = false;
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
            registerBtn.innerText = 'Criar Conta';
            registerBtn.disabled = false;
        }
    });
}
