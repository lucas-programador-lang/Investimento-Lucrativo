document.addEventListener('DOMContentLoaded', () => {
    const userAuthToken = localStorage.getItem('userAuthToken');
    
    // Proteção de rota: Se não tiver token, volta pro login sem dar F5
    if (!userAuthToken) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados simulados do usuário
    const storedName = localStorage.getItem('userName') || 'Usuário';
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) greetingElement.textContent = `Olá, ${storedName}`;

    // Mock de dados financeiros vindos da API
    const userFinancialData = {
        availableBalance: 1250.00,
        investedBalance: 5000.00,
        currencyFormatter: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    };

    // Atualizar UI
    const availableBalanceEl = document.getElementById('available-balance');
    const investedBalanceEl = document.getElementById('invested-balance');

    if (availableBalanceEl) {
        const formattedAvailable = userFinancialData.currencyFormatter.format(userFinancialData.availableBalance).split(',');
        availableBalanceEl.innerHTML = `${formattedAvailable[0]}<span>,${formattedAvailable[1]}</span>`;
    }

    if (investedBalanceEl) {
        const formattedInvested = userFinancialData.currencyFormatter.format(userFinancialData.investedBalance).split(',');
        investedBalanceEl.innerHTML = `${formattedInvested[0]}<span>,${formattedInvested[1]}</span>`;
    }

    // Função de Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userAuthToken');
            window.location.href = 'login.html';
        });
    }
});
