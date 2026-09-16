document.addEventListener('DOMContentLoaded', () => {
    // 1. Formatting Utility
    const financialFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    // 2. Mock Admin Data (Follows Item 7 specifications)
    const adminDashboardData = {
        totalDepositsAmount: 185400.00,
        pendingWithdrawalsCount: 3,
        activeUsersCount: 142,
        pendingWithdrawalRequests: [
            { id: 'wd-101', userName: 'Carlos Almeida', amount: 550.00, pixKey: '123.456.789-00', requestDate: 'Hoje, 09:15' },
            { id: 'wd-102', userName: 'Marina Souza', amount: 1200.00, pixKey: 'marina@email.com', requestDate: 'Hoje, 10:30' },
            { id: 'wd-103', userName: 'Roberto Justos', amount: 50.00, pixKey: '+5511999999999', requestDate: 'Hoje, 11:45' }
        ]
    };

    // 3. Populate Dashboard Stats
    const totalDepositsEl = document.getElementById('admin-total-deposits');
    const pendingWithdrawalsEl = document.getElementById('admin-pending-withdrawals');
    const activeUsersEl = document.getElementById('admin-active-users');

    if (totalDepositsEl) totalDepositsEl.textContent = financialFormatter.format(adminDashboardData.totalDepositsAmount);
    if (pendingWithdrawalsEl) pendingWithdrawalsEl.textContent = adminDashboardData.pendingWithdrawalsCount;
    if (activeUsersEl) activeUsersEl.textContent = adminDashboardData.activeUsersCount;

    // 4. Populate Withdrawals Table
    const withdrawalsTableBody = document.getElementById('admin-withdrawals-list');
    if (withdrawalsTableBody) {
        adminDashboardData.pendingWithdrawalRequests.forEach(request => {
            withdrawalsTableBody.innerHTML += `
                <tr style="border-bottom: 1px solid var(--line);" id="row-${request.id}">
                    <td style="padding: 15px; font-weight: 700;">${request.userName}</td>
                    <td style="padding: 15px; color: var(--ink); font-weight: 700;">${financialFormatter.format(request.amount)}</td>
                    <td style="padding: 15px; font-family: monospace;">${request.pixKey}</td>
                    <td style="padding: 15px; color: var(--muted);">${request.requestDate}</td>
                    <td style="padding: 15px; text-align: right;">
                        <button onclick="approveWithdrawal('${request.id}')" style="background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px; font-weight: 600;">Aprovar Pix</button>
                        <button onclick="rejectWithdrawal('${request.id}')" style="background: white; border: 1px solid #ef4444; color: #ef4444; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: 600;">Rejeitar</button>
                    </td>
                </tr>
            `;
        });
    }

    // 5. Actions & Toasts
    const toastElement = document.getElementById('toast');
    function showAdminToast(message) {
        if(!toastElement) return;
        toastElement.textContent = message;
        toastElement.classList.add('show');
        setTimeout(() => toastElement.classList.remove('show'), 3600);
    }

    window.approveWithdrawal = function(requestId) {
        const row = document.getElementById(`row-${requestId}`);
        if(row) row.style.display = 'none';
        
        const count = parseInt(pendingWithdrawalsEl.textContent) - 1;
        pendingWithdrawalsEl.textContent = Math.max(0, count);
        
        showAdminToast(`Aprovado! Pagamento Pix em processamento.`);
    };

    window.rejectWithdrawal = function(requestId) {
        const row = document.getElementById(`row-${requestId}`);
        if(row) row.style.display = 'none';
        
        const count = parseInt(pendingWithdrawalsEl.textContent) - 1;
        pendingWithdrawalsEl.textContent = Math.max(0, count);
        
        showAdminToast(`Rejeitado! O valor retornou ao saldo do usuário.`);
    };

    // 6. Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
