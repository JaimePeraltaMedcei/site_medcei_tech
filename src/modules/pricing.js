// Pricing: the monthly price counts up when it comes into view.
import { gsap } from './gsap.js';

export function initPricing() {
  const el = document.querySelector('[data-price]');
  if (!el) return;

  const end = parseFloat(el.textContent.replace(',', '.'));
  const state = { v: 0 };
  const format = (v) => v.toFixed(2).replace('.', ',');

  el.textContent = format(0);
  gsap.to(state, {
    v: end,
    duration: 1.6,
    ease: 'expo.out',
    onUpdate: () => { el.textContent = format(state.v); },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
}
