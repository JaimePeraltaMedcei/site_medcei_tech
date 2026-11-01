// Page transitions: a curtain covers the screen before leaving a page and lifts
// when the next one is ready. The first visit of a session shows the loader instead.
import { gsap } from './gsap.js';

const VISITED = 'mt-visited';

export function markVisited() {
  try { sessionStorage.setItem(VISITED, '1'); } catch { /* storage blocked */ }
}

export function isReturning() {
  return document.documentElement.classList.contains('is-returning');
}

// Lifts the curtain that covers a returning visitor's page on load.
export function revealPage() {
  const curtain = document.querySelector('[data-curtain]');
  if (!curtain) return Promise.resolve();
  return new Promise((resolve) => {
    gsap.timeline({ onComplete: () => { document.documentElement.classList.remove('is-returning'); gsap.set(curtain, { clearProps: 'all' }); } })
      .to(curtain.firstElementChild, { autoAlpha: 0, duration: 0.25 })
      .to(curtain, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
      .add(resolve, '-=0.55');
  });
}

function isPageLink(a, e) {
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.search === location.search) return false; // same page, maybe a hash
  return true;
}

export function initTransitions({ reduced }) {
  const curtain = document.querySelector('[data-curtain]');
  if (!curtain || reduced) return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!isPageLink(a, e)) return;
    e.preventDefault();
    markVisited();
    gsap.timeline({ onComplete: () => { window.location.href = a.href; } })
      .fromTo(curtain, { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
      .fromTo(curtain.firstElementChild, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.25');
  });

  // Coming back through the history cache: make sure the curtain is gone.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) gsap.set(curtain, { clearProps: 'all' });
  });
}
