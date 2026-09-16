const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const data = {
  daily: { rate: .025, label: '2,50% ao ciclo', days: 1, date: 'Amanhã' },
  quarterly: { rate: .04, label: '4,00% ao ciclo', days: 90, date: 'Em 3 meses' }
};
const amountInput = document.querySelector('#amount');
const form = document.querySelector('#simulation-form');
function parseBRL(value) { return Number(value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0; }
function selectedPlan() { return document.querySelector('input[name="plan"]:checked').value; }
function updateSimulation() {
  const amount = parseBRL(amountInput.value), plan = data[selectedPlan()];
  document.querySelector('#rate').textContent = plan.label;
  document.querySelector('#earnings').textContent = money.format(amount * plan.rate);
  document.querySelector('#total').textContent = money.format(amount * (1 + plan.rate));
  document.querySelector('#maturity').textContent = plan.date;
}
amountInput.addEventListener('input', updateSimulation);
amountInput.addEventListener('blur', () => { amountInput.value = money.format(parseBRL(amountInput.value)).replace('R$', '').trim(); updateSimulation(); });
document.querySelectorAll('input[name="plan"]').forEach(el => el.addEventListener('change', updateSimulation));
document.querySelectorAll('.choose-plan').forEach(btn => btn.addEventListener('click', () => { document.querySelector(`input[value="${btn.dataset.plan}"]`).checked = true; updateSimulation(); document.querySelector('#simulador').scrollIntoView({ behavior: 'smooth' }); }));
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 3600); }
form.addEventListener('submit', event => { event.preventDefault(); const value = parseBRL(amountInput.value); if(value < 50) return toast('Informe um aporte de referência a partir de R$ 50,00.'); toast('Fluxo demonstrativo: conecte este botão ao seu provedor de autenticação.'); });
document.querySelectorAll('[data-whatsapp]').forEach(a => a.addEventListener('click', event => { event.preventDefault(); toast('Configure o link do WhatsApp no painel administrativo.'); }));
document.querySelector('.menu').addEventListener('click', () => toast('Em telas menores, navegue pelas seções rolando a página.'));
updateSimulation();
