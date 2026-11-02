// Demo request form: takes the product from the address (?interesse=CRM),
// validates, then opens the visitor's email with the request ready.
const EMAIL = 'geral@medcei.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContact() {
  const form = document.querySelector('[data-contact]');
  if (!form) return;

  const { elements } = form;
  const error = form.querySelector('[data-form-error]');

  const params = new URLSearchParams(location.search);
  const interest = params.get('interesse');
  if (interest && [...elements.interesse.options].some((o) => o.value === interest)) {
    elements.interesse.value = interest;
  }
  // Goals chosen in "Por onde começar" arrive as the start of the message.
  const goals = params.get('objetivos');
  if (goals && elements.mensagem && !elements.mensagem.value) {
    elements.mensagem.value = `Quero resolver: ${goals.split('; ').join(', ').toLowerCase()}.`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = (name) => elements[name]?.value.trim() ?? '';

    const checks = [
      [elements.nome, value('nome') !== '', 'o seu nome'],
      [elements.empresa, value('empresa') !== '', 'o nome da empresa'],
      [elements.email, EMAIL_RE.test(value('email')), 'um email válido'],
    ];
    checks.forEach(([field, ok]) => field.setAttribute('aria-invalid', String(!ok)));
    const missing = checks.filter(([, ok]) => !ok);
    if (missing.length) {
      const labels = missing.map(([, , label]) => label);
      error.textContent = `Falta ${labels.length > 1 ? `${labels.slice(0, -1).join(', ')} e ${labels.at(-1)}` : labels[0]}.`;
      missing[0][0].focus();
      return;
    }
    error.textContent = '';

    const product = value('interesse');
    const subject = `Pedido de demonstração: ${product} (${value('empresa')})`;
    const body = [
      'Olá Medcei Tech,',
      '',
      `Gostaria de marcar uma demonstração de: ${product}.`,
      value('mensagem') ? `\n${value('mensagem')}` : null,
      '',
      `Nome: ${value('nome')}`,
      `Empresa: ${value('empresa')}`,
      `Tamanho da equipa: ${value('equipa')}`,
      `Melhor altura: ${elements.altura?.value || 'Indiferente'}`,
      `Email: ${value('email')}`,
      value('telefone') ? `Telefone: ${value('telefone')}` : null,
    ].filter((line) => line !== null).join('\n');

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
