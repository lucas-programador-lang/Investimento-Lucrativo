document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Check
    const userAuthToken = localStorage.getItem('userAuthToken');
    if (!userAuthToken) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Load User Data (Mock for frontend)
    const storedUserName = localStorage.getItem('userName') || 'Investidor';
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) greetingElement.textContent = `Olá, ${storedUserName}`;

    const financialFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    // Mock Backend Data
    const accountData = {
        availableBalance: 1250.00,
        investedBalance: 10000.00,
        totalEarnings: 2480.00,
        totalDeposited: 10000.00,
        totalWithdrawn: 0.00,
        activePlanAmount: 10000.00,
        transactions: [
            { date: '15/09/2026', type: 'Rendimento Diário', amount: 250.00, status: 'Concluído', isPositive: true },
            { date: '14/09/2026', type: 'Aporte via Pix', amount: 10000.00, status: 'Concluído', isPositive: true }
        ]
    };

    // Update UI Balances
    function splitCurrency(value) {
        const formatted = financialFormatter.format(value).split(',');
        return `${formatted[0]}<span>,${formatted[1]}</span>`;
    }

    document.getElementById('available-balance').innerHTML = splitCurrency(accountData.availableBalance);
    document.getElementById('invested-balance').innerHTML = splitCurrency(accountData.investedBalance);
    document.getElementById('total-earnings').textContent = `+ ${financialFormatter.format(accountData.totalEarnings)}`;
    document.getElementById('total-deposited').textContent = financialFormatter.format(accountData.totalDeposited);
    document.getElementById('total-withdrawn').textContent = financialFormatter.format(accountData.totalWithdrawn);
    document.getElementById('active-plan-amount').textContent = financialFormatter.format(accountData.activePlanAmount);

    // Populate Transactions Table
    const transactionsTableBody = document.getElementById('transactions-list');
    accountData.transactions.forEach(transaction => {
        const amountColor = transaction.isPositive ? '#10b981' : 'var(--ink)';
        const amountPrefix = transaction.isPositive ? '+' : '-';
        
        transactionsTableBody.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px;">${transaction.date}</td>
                <td style="padding: 15px;">${transaction.type}</td>
                <td style="padding: 15px; color: ${amountColor}; font-weight: 700;">
                    ${amountPrefix} ${financialFormatter.format(transaction.amount)}
                </td>
                <td style="padding: 15px; color: var(--muted);">${transaction.status}</td>
            </tr>
        `;
    });

    // 3. Simulator Logic (Integrated into Dashboard)
    const amountInput = document.querySelector('#amount');
    const planRadios = document.querySelectorAll('input[name="plan"]');
    
    const investmentPlans = {
        daily: { rate: .025, days: 1, date: 'Amanhã (24h)' },
        quarterly: { rate: .04, days: 90, date: 'Em 3 meses' }
    };

    function parseCurrencyValue(value) { 
        return Number(value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0; 
    }

    function updateSimulation() {
        if(!amountInput) return;
        const currentAmount = parseCurrencyValue(amountInput.value);
        const selectedPlanKey = document.querySelector('input[name="plan"]:checked').value;
        const activePlan = investmentPlans[selectedPlanKey];
        
        document.querySelector('#earnings').textContent = financialFormatter.format(currentAmount * activePlan.rate);
        document.querySelector('#total').textContent = financialFormatter.format(currentAmount * (1 + activePlan.rate));
        document.querySelector('#maturity').textContent = activePlan.date;
    }

    if(amountInput) {
        amountInput.addEventListener('input', updateSimulation);
        amountInput.addEventListener('blur', () => { 
            amountInput.value = financialFormatter.format(parseCurrencyValue(amountInput.value)).replace('R$', '').trim(); 
            updateSimulation(); 
        });
        planRadios.forEach(element => element.addEventListener('change', updateSimulation));
        updateSimulation();
    }

    // 4. Utils (Logout and Toasts)
    const toastElement = document.getElementById('toast');
    function showToast(message) {
        toastElement.textContent = message;
        toastElement.classList.add('show');
        setTimeout(() => toastElement.classList.remove('show'), 3600);
    }

    document.querySelectorAll('[data-whatsapp]').forEach(link => {
        link.addEventListener('click', event => { 
            event.preventDefault(); 
            showToast('O link do grupo será configurado via painel Admin.'); 
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userAuthToken');
        window.location.href = 'login.html';
    });
});
