const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// 1. Lógica de Login Real conectada ao Banco de Dados (Neon)
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const passwordHash = document.getElementById('password').value; // Senha digitada
        
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.innerText = 'Autenticando...';
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, passwordHash })
            });

            const data = await response.json();

            if (response.ok) {
                // Salvamos os dados reais do usuário retornados pelo PostgreSQL
                localStorage.setItem('userAuthToken', data.user.id);
                localStorage.setItem('userName', data.user.fullName);
                localStorage.setItem('userSession', JSON.stringify(data.user));
                
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'E-mail ou senha incorretos.');
                if (loginBtn) loginBtn.innerText = 'Entrar';
            }
        } catch (error) {
            console.error('Erro na requisição de login:', error);
            alert('Erro ao conectar com o servidor.');
            if (loginBtn) loginBtn.innerText = 'Entrar';
        }
    });
}

// 2. Lógica de Cadastro Real conectada ao Banco de Dados (Neon)
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const fullName = document.getElementById('fullName')?.value || 'Investidor';
        const cpf = document.getElementById('cpf')?.value || '';
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone')?.value || '';
        const passwordHash = document.getElementById('password').value;

        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) registerBtn.innerText = 'Criando conta...';
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, cpf, email, phone, passwordHash })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Conta criada com sucesso! Faça seu login.');
                window.location.href = 'login.html';
            } else {
                alert(data.error || 'Erro ao criar conta.');
                if (registerBtn) registerBtn.innerText = 'Cadastrar';
            }
        } catch (error) {
            console.error('Erro na requisição de cadastro:', error);
            alert('Erro ao conectar com o servidor.');
            if (registerBtn) registerBtn.innerText = 'Cadastrar';
        }
    });
}
