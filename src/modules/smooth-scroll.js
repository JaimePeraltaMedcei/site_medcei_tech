// Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync.
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

let lenis = null;

export function initSmoothScroll() {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export const getLenis = () => lenis;

// Scrolls to an element, a selector or a pixel offset.
export function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
    return;
  }
  if (typeof target === 'number') window.scrollTo(0, target);
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView();
}
