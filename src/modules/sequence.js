// "Como funciona" on product pages: the section stays on screen while the four
// steps light up one by one and their notifications pile up beside the product.
import { gsap } from './gsap.js';

export function initSequence() {
  const section = document.querySelector('[data-sequence]');
  if (!section) return;

  const steps = [...section.querySelectorAll('.sequence__steps > li')];
  const chips = [...section.querySelectorAll('.sequence__chips > li')];
  const visual = section.querySelector('.sequence__img, .sequence__photo, .sequence__device');

  const show = (index) => {
    steps.forEach((li, i) => li.classList.toggle('is-active', i === index));
    steps.forEach((li, i) => li.classList.toggle('is-done', i < index));
    chips.forEach((li, i) => li.classList.toggle('is-on', i <= index));
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    show(0);
    let current = 0;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=' + steps.length * 70 + '%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (i !== current) { current = i; show(i); }
        },
      },
    });
    if (visual) tl.fromTo(visual, { rotation: -6, scale: 0.94 }, { rotation: 4, scale: 1.02, ease: 'none' });
    return () => show(steps.length - 1);
  });

  mm.add('(max-width: 900px)', () => show(steps.length - 1));
}
