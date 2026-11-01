// Contact form: takes presets from the address (?para=organizacao&interesse=SmartDose),
// validates, then opens the visitor's email with the request ready.
const EMAIL = 'geral@medcei.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContact() {
  const form = document.querySelector('[data-contact]');
  if (!form) return;

  const { elements } = form;
  const error = form.querySelector('[data-form-error]');
  const orgOnly = form.querySelectorAll('[data-org-only]');

  const syncAudience = () => {
    const forOrg = elements.para.value === 'organizacao';
    orgOnly.forEach((el) => { el.hidden = !forOrg; });
  };

  const params = new URLSearchParams(location.search);
  if (params.get('para') === 'organizacao') elements.para.value = 'organizacao';
  const interest = params.get('interesse');
  if (interest && [...elements.interesse.options].some((o) => o.value === interest)) {
    elements.interesse.value = interest;
  }
  syncAudience();
  form.addEventListener('change', (e) => e.target.name === 'para' && syncAudience());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = (name) => elements[name]?.value.trim() ?? '';

    const checks = [
      [elements.nome, value('nome') !== '', 'o seu nome'],
      [elements.email, EMAIL_RE.test(value('email')), 'um email válido'],
    ];
    checks.forEach(([field, ok]) => field.setAttribute('aria-invalid', String(!ok)));
    const missing = checks.filter(([, ok]) => !ok);
    if (missing.length) {
      error.textContent = `Falta ${missing.map(([, , label]) => label).join(' e ')}.`;
      missing[0][0].focus();
      return;
    }
    error.textContent = '';

    const forOrg = elements.para.value === 'organizacao';
    const product = value('interesse');
    const subject = forOrg ? `Proposta para organização: ${product}` : `Pedido de informação: ${product}`;
    const body = [
      'Olá Medcei,',
      '',
      forOrg
        ? `Represento uma organização de saúde e gostaria de receber uma proposta para ${product}.`
        : `Gostaria de saber mais sobre ${product} para a minha família.`,
      value('mensagem') ? `\n${value('mensagem')}` : null,
      '',
      `Nome: ${value('nome')}`,
      forOrg && value('organizacao') ? `Organização: ${value('organizacao')}` : null,
      `Email: ${value('email')}`,
      value('telefone') ? `Telefone: ${value('telefone')}` : null,
    ].filter((line) => line !== null).join('\n');

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
