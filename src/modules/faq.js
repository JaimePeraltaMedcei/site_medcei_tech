// FAQ: native <details> with an animated height. Only one answer stays open.
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap.js';

export function initFaq() {
  const items = document.querySelectorAll('[data-faq] details');
  const reduced = prefersReducedMotion();

  items.forEach((details) => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.faq__a');

    summary.addEventListener('click', (e) => {
      if (reduced) return;
      e.preventDefault();

      if (details.open) {
        gsap.to(answer, {
          height: 0,
          duration: 0.4,
          ease: 'power3.inOut',
          onComplete: () => { details.open = false; gsap.set(answer, { clearProps: 'height' }); ScrollTrigger.refresh(); },
        });
        return;
      }

      items.forEach((other) => other !== details && other.open && other.querySelector('summary').click());
      details.open = true;
      gsap.from(answer, {
        height: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => { gsap.set(answer, { clearProps: 'height' }); ScrollTrigger.refresh(); },
      });
    });
  });
}
