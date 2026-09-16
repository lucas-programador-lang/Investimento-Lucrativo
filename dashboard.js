document.addEventListener('DOMContentLoaded', () => {
    const userAuthToken = localStorage.getItem('userAuthToken');
    if (!userAuthToken) { window.location.href = 'login.html'; return; }

    const storedUserName = localStorage.getItem('userName') || 'Investidor';
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) greetingElement.textContent = `Olá, ${storedUserName}`;

    const financialFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const accountData = {
        availableBalance: 1250.00, investedBalance: 10000.00, totalEarnings: 2480.00, activePlanAmount: 10000.00,
        transactions: [
            { date: '15/09/2026', type: 'Rendimento Diário', amount: 250.00, status: 'Concluído', isPositive: true },
            { date: '14/09/2026', type: 'Aporte via Pix', amount: 10000.00, status: 'Concluído', isPositive: true }
        ]
    };

    function splitCurrency(value) { const formatted = financialFormatter.format(value).split(','); return `${formatted[0]}<span>,${formatted[1]}</span>`; }

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
        accountData.transactions.forEach(transaction => {
            const amountColor = transaction.isPositive ? '#10b981' : 'var(--ink)';
            const amountPrefix = transaction.isPositive ? '+' : '-';
            transactionsTableBody.innerHTML += `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 15px;">${transaction.date}</td><td style="padding: 15px;">${transaction.type}</td><td style="padding: 15px; color: ${amountColor}; font-weight: 700;">${amountPrefix} ${financialFormatter.format(transaction.amount)}</td><td style="padding: 15px; color: var(--muted);">${transaction.status}</td></tr>`;
        });
    }

    // Função de Toast profissional e elegante
    function showToast(message) { 
        const toastElement = document.querySelector('#toast'); 
        if(!toastElement) return;
        toastElement.textContent = message; 
        toastElement.classList.add('show'); 
        setTimeout(() => toastElement.classList.remove('show'), 3600); 
    }

    // Ações dos botões Aportar e Sacar com o Toast
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

    // Botão Sair redirecionando para index.html
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
