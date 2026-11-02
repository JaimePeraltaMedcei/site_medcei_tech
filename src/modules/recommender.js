// "Por onde começar": the visitor ticks what they want to solve and gets the
// product or plan that covers it, with the module behind each goal. The demo
// link carries the choice so the contact form arrives filled in.
import { gsap, prefersReducedMotion } from './gsap.js';

const PLAN_NAMES = {
  crm: 'CRM',
  rh: 'Recrutamento',
  app: 'App para famílias',
  completa: 'Plataforma completa',
};

// The app needs the CRM, so app goals bring the CRM with them.
function planFor(products) {
  if (products.has('app')) products.add('crm');
  if (products.size >= 2) return 'completa';
  return [...products][0] ?? null;
}

export function initRecommender() {
  const root = document.querySelector('[data-reco]');
  if (!root) return;

  const goals = [...root.querySelectorAll('input[type="checkbox"]')];
  const result = root.querySelector('[data-reco-result]');
  const planEl = result.querySelector('[data-reco-plan]');
  const whyEl = result.querySelector('[data-reco-why]');
  const emptyEl = result.querySelector('[data-reco-empty]');
  const cta = result.querySelector('[data-reco-cta]');
  const reduced = prefersReducedMotion();

  const update = () => {
    const chosen = goals.filter((g) => g.checked);
    const products = new Set(chosen.map((g) => g.dataset.product));
    const plan = planFor(products);

    emptyEl.hidden = Boolean(plan);
    whyEl.hidden = !plan;
    planEl.textContent = plan ? PLAN_NAMES[plan] : 'Ainda nada escolhido';

    whyEl.replaceChildren(
      ...chosen.map((g) => {
        const li = document.createElement('li');
        const b = document.createElement('b');
        b.textContent = g.value;
        li.append(b, g.dataset.module);
        return li;
      }),
    );

    const params = new URLSearchParams();
    params.set('interesse', plan ? PLAN_NAMES[plan] : 'Plataforma completa');
    if (chosen.length) params.set('objetivos', chosen.map((g) => g.value).join('; '));
    cta.href = `/contactos/?${params}`;

    if (!reduced) gsap.fromTo(planEl, { y: 10, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', overwrite: true });
  };

  goals.forEach((g) => g.addEventListener('change', update));
  update();
}
