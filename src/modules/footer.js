// Footer: the large wordmark rises letter by letter as the page ends.
import { gsap, SplitText } from './gsap.js';

export function initFooter() {
  const word = document.querySelector('[data-footer-word]');
  if (!word) return;

  const split = SplitText.create(word, { type: 'chars', mask: 'chars' });
  gsap.from(split.chars, {
    yPercent: 100,
    ease: 'none',
    stagger: 0.05,
    scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
  });
}
