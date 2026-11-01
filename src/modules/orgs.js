// Organisations: rows slide in, and on desktop a picture follows the pointer
// over the list. The partnership photo drifts slowly with the scroll.
import { gsap } from './gsap.js';

export function initOrgs() {
  const section = document.querySelector('[data-orgs]');
  if (!section) return;

  const rows = gsap.utils.toArray('.orgs__row', section);
  rows.forEach((row) => {
    gsap.from(row.children, {
      y: 40,
      autoAlpha: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: row, start: 'top 90%', once: true },
    });
  });

  const drift = section.querySelector('[data-drift]');
  if (drift) {
    gsap.fromTo(drift, { yPercent: -6 }, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: drift.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  // Pointer-following picture.
  const cursor = section.querySelector('[data-orgs-cursor]');
  const list = section.querySelector('[data-orgs-list]');
  if (!cursor || !window.matchMedia('(hover: hover)').matches) return;

  const img = cursor.querySelector('img');
  const x = gsap.quickTo(cursor, 'x', { duration: 0.6, ease: 'power3' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.6, ease: 'power3' });
  const r = gsap.quickTo(cursor, 'rotation', { duration: 0.8, ease: 'power3' });
  let lastX = 0;

  list.addEventListener('pointerenter', () => gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' }));
  list.addEventListener('pointerleave', () => gsap.to(cursor, { autoAlpha: 0, scale: 0.6, duration: 0.4 }));
  list.addEventListener('pointermove', (e) => {
    x(e.clientX + 24);
    y(e.clientY - cursor.offsetHeight / 2);
    r(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  });
  rows.forEach((row) =>
    row.addEventListener('pointerenter', () => {
      if (img.getAttribute('src') !== row.dataset.img) img.src = row.dataset.img;
    }),
  );
}
