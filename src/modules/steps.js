// "Como começar": sticky cards that stack; each card shrinks and dims as the
// next one slides over it.
import { gsap } from './gsap.js';

export function initSteps() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const cards = gsap.utils.toArray('[data-steps] .step');
    cards.slice(0, -1).forEach((card, i) => {
      gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
        scale: 0.92 + i * 0.02,
        filter: 'brightness(0.86)',
        ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 30%', scrub: true },
      });
    });
  });
}
