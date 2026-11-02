// A small "Marcar demonstração" bar appears once the visitor scrolls past the
// first screen, and steps aside over the closing call to action, the footer
// and the contact page, where the same action is already on screen.
import { ScrollTrigger } from './gsap.js';

export function initStickyCta() {
  const bar = document.querySelector('[data-sticky-cta]');
  if (!bar) return;
  if (document.body.dataset.page === 'contactos') {
    bar.remove();
    return;
  }

  let past = false;
  let covered = false;
  const render = () => {
    const on = past && !covered;
    bar.classList.toggle('is-on', on);
    bar.inert = !on;
  };

  ScrollTrigger.create({
    start: () => window.innerHeight * 0.9,
    end: 'max',
    onToggle: (self) => { past = self.isActive; render(); },
  });

  document.querySelectorAll('.cta-band, .footer').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { covered = self.isActive; render(); },
    });
  });

  render();
}
