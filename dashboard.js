document.addEventListener('DOMContentLoaded', async () => {
    const userAuthToken = localStorage.getItem('userAuthToken');
    if (!userAuthToken) { window.location.href = 'login.html'; return; }

    const storedUserName = localStorage.getItem('userName') || 'Investidor';
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) greetingElement.textContent = `Olá, ${storedUserName}`;

    const financialFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    // Estrutura padrão inicial enquanto buscamos do banco
    let accountData = {
        availableBalance: 0.00, 
        investedBalance: 0.00, 
        totalEarnings: 0.00, 
        activePlanAmount: 0.00,
        transactions: []
    };

    // Buscando os dados reais do usuário logado na nossa API do Next.js / PostgreSQL
    try {
        const response = await fetch(`/api/user?id=${userAuthToken}`);
        if (response.ok) {
            const data = await response.json();
            if (data.user && data.user.balance) {
                accountData.availableBalance = Number(data.user.balance.availableAmount) || 0;
                accountData.investedBalance = Number(data.user.balance.investedAmount) || 0;
                accountData.totalEarnings = Number(data.user.balance.totalEarned) || 0;
            }
            if (data.transactions) {
                accountData.transactions = data.transactions;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados do painel:', error);
    }

    function splitCurrency(value) { 
        const formatted = financialFormatter.format(value).split(','); 
        return `${formatted[0]}<span>,${formatted[1]}</span>`; 
    }

    const availEl = document.getElementById('available-balance');
    const invEl = document.getElementById('invested-balance');
    const earnEl = document.getElementById('total-earnings');
    const activePlanEl = document.getElementById('active-plan-amount');

    if(availEl) availEl.innerHTML = splitCurrency(accountData.availableBalance);
    if(invEl) invEl.innerHTML = splitCurrency(accountData.investedBalance);
    if(earnEl) earnEl.textContent = `+ ${financialFormatter.format(accountData.totalEarnings)}`;
    if(activePlanEl) activePlanEl.textContent = financialFormatter.format(accountData.activePlanAmount);

    const transactionsTableBody = document.getElementById('transactions-list');
    if (transactionsTableBody) {
        if (accountData.transactions.length === 0) {
            transactionsTableBody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--muted);">Nenhuma transação recente encontrada.</td></tr>`;
        } else {
            transactionsTableBody.innerHTML = '';
            accountData.transactions.forEach(transaction => {
                const amountColor = transaction.isPositive ? '#10b981' : 'var(--ink)';
                const amountPrefix = transaction.isPositive ? '+' : '-';
                transactionsTableBody.innerHTML += `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 15px;">${transaction.date}</td><td style="padding: 15px;">${transaction.type}</td><td style="padding: 15px; color: ${amountColor}; font-weight: 700;">${amountPrefix} ${financialFormatter.format(transaction.amount)}</td><td style="padding: 15px; color: var(--muted);">${transaction.status}</td></tr>`;
            });
        }
    }

    // Função de Toast profissional e elegante
    function showToast(message) {  
        const toastElement = document.querySelector('#toast');  
        if(!toastElement) return;
        toastElement.textContent = message;  
        toastElement.classList.add('show');  
        setTimeout(() => toastElement.classList.remove('show'), 3600);  
    }

    const btnAportar = document.getElementById('btn-aportar');
    const btnSacar = document.getElementById('btn-sacar');

    if (btnAportar) {
        btnAportar.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Sistema Pix em breve');
        });
    }

    if (btnSacar) {
        btnSacar.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Saque Mín. R$ 50');
        });
    }

    const amountInput = document.querySelector('#amount');
    const planRadios = document.querySelectorAll('input[name="plan"]');
    const investmentPlans = { daily: { rate: .025, date: 'Amanhã (24h)' }, quarterly: { rate: .04, date: 'Em 3 meses' } };

    function parseCurrencyValue(value) { return Number(value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0; }
    function updateSimulation() {
        if(!amountInput) return;
        const currentAmount = parseCurrencyValue(amountInput.value);
        const selectedPlanElement = document.querySelector('input[name="plan"]:checked');
        if(!selectedPlanElement) return;
        const selectedPlanKey = selectedPlanElement.value;
        const activePlan = investmentPlans[selectedPlanKey];
        
        const earningsEl = document.querySelector('#earnings');
        const totalEl = document.querySelector('#total');
        const maturityEl = document.querySelector('#maturity');
        
        if(earningsEl) earningsEl.textContent = financialFormatter.format(currentAmount * activePlan.rate);
        if(totalEl) totalEl.textContent = financialFormatter.format(currentAmount * (1 + activePlan.rate));
        if(maturityEl) maturityEl.textContent = activePlan.date;
    }

    if(amountInput) {
        amountInput.addEventListener('input', updateSimulation);
        amountInput.addEventListener('blur', () => { amountInput.value = financialFormatter.format(parseCurrencyValue(amountInput.value)).replace('R$', '').trim(); updateSimulation(); });
        planRadios.forEach(element => element.addEventListener('change', updateSimulation));
        updateSimulation();
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {  
            event.preventDefault();
            localStorage.removeItem('userAuthToken');  
            localStorage.removeItem('userName');  
            window.location.href = 'index.html';  
        });
    }
});
