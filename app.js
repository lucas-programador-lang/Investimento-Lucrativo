const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const planData = {
  daily: { rate: .025, label: '2,50% ao ciclo', days: 1, date: 'Amanhã' },
  quarterly: { rate: .04, label: '4,00% ao ciclo', days: 90, date: 'Em 3 meses' }
};

const amountInput = document.querySelector('#amount');
const simulationForm = document.querySelector('#simulation-form');

function parseCurrencyValue(value) { 
    return Number(value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0; 
}

function getSelectedPlan() { 
    return document.querySelector('input[name="plan"]:checked').value; 
}

function updateSimulation() {
  const currentAmount = parseCurrencyValue(amountInput.value);
  const activePlan = planData[getSelectedPlan()];
  
  document.querySelector('#rate').textContent = activePlan.label;
  document.querySelector('#earnings').textContent = currencyFormatter.format(currentAmount * activePlan.rate);
  document.querySelector('#total').textContent = currencyFormatter.format(currentAmount * (1 + activePlan.rate));
  document.querySelector('#maturity').textContent = activePlan.date;
}

amountInput.addEventListener('input', updateSimulation);
amountInput.addEventListener('blur', () => { 
    amountInput.value = currencyFormatter.format(parseCurrencyValue(amountInput.value)).replace('R$', '').trim(); 
    updateSimulation(); 
});

document.querySelectorAll('input[name="plan"]').forEach(element => element.addEventListener('change', updateSimulation));

document.querySelectorAll('.choose-plan').forEach(button => button.addEventListener('click', () => { 
    document.querySelector(`input[value="${button.dataset.plan}"]`).checked = true; 
    updateSimulation(); 
    document.querySelector('#simulador').scrollIntoView({ behavior: 'smooth' }); 
}));

function showToast(message) { 
    const toastElement = document.querySelector('#toast'); 
    toastElement.textContent = message; 
    toastElement.classList.add('show'); 
    setTimeout(() => toastElement.classList.remove('show'), 3600); 
}

simulationForm.addEventListener('submit', event => { 
    event.preventDefault(); 
    const inputValue = parseCurrencyValue(amountInput.value); 
    if(inputValue < 50) return showToast('Informe um aporte de referência a partir de R$ 50,00.'); 
    showToast('Fluxo demonstrativo: conecte este botão ao seu provedor de autenticação.'); 
});

document.querySelectorAll('[data-whatsapp]').forEach(link => link.addEventListener('click', event => { 
    event.preventDefault(); 
    showToast('Configure o link do WhatsApp no painel administrativo.'); 
}));

document.querySelector('.menu').addEventListener('click', () => showToast('Em telas menores, navegue pelas seções rolando a página.'));

updateSimulation();
