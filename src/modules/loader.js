// First visit of the session: counts to 100 while fonts and the first picture load,
// then lifts away. Later pages open with the page-transition curtain instead.
import { gsap } from './gsap.js';
import { isReturning, revealPage, markVisited } from './transitions.js';

const MIN_TIME = 0.9;

export function runLoader({ reduced, lenis }) {
  const loader = document.querySelector('.loader');
  if (!loader) return Promise.resolve();

  markVisited();
  if (reduced) {
    loader.remove();
    return Promise.resolve();
  }
  if (isReturning()) {
    loader.remove();
    return document.fonts.ready.then(revealPage);
  }

  lenis?.stop();
  const count = loader.querySelector('[data-loader-count]');
  const bar = loader.querySelector('.loader__bar span');
  const heroImg = document.querySelector('img[fetchpriority="high"]');

  const ready = Promise.all([
    document.fonts.ready,
    heroImg?.decode?.().catch(() => {}),
  ]);

  const progress = { v: 0 };
  const counting = gsap.to(progress, {
    v: 90,
    duration: MIN_TIME,
    ease: 'power2.out',
    onUpdate: () => {
      count.textContent = Math.round(progress.v);
      gsap.set(bar, { scaleX: progress.v / 100 });
    },
  });

  return Promise.all([ready, counting.then()]).then(
    () =>
      new Promise((resolve) => {
        gsap
          .timeline({ onComplete: () => { loader.remove(); lenis?.start(); } })
          .to(progress, {
            v: 100,
            duration: 0.3,
            ease: 'none',
            onUpdate: () => {
              count.textContent = Math.round(progress.v);
              gsap.set(bar, { scaleX: progress.v / 100 });
            },
          })
          .to('.loader__inner', { y: -30, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
          .add(resolve)
          .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<');
      }),
  );
}
