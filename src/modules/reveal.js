// Generic entrances: fade-up blocks, masked headline lines and counting numbers.
import { gsap, ScrollTrigger, SplitText } from './gsap.js';

export function initReveals() {
  const items = gsap.utils.toArray('[data-reveal]');
  gsap.set(items, { y: 40, autoAlpha: 0 });

  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
}

export function initSplitTitles() {
  gsap.utils.toArray('[data-split]').forEach((title) => {
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.lines, {
      yPercent: 105,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
    });
  });
}

export function initCounters() {
  gsap.utils.toArray('[data-count]').filter((el) => !el.closest('[data-report]')).forEach((el) => {
    const end = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? '';
    const state = { v: 0 };
    el.textContent = prefix + '0';
    gsap.to(state, {
      v: end,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = prefix + Math.round(state.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}
