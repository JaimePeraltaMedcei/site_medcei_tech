// Brings the product interface fragments to life when they come into view:
// chart bars grow, lines draw, scores count up, progress bars fill and the
// interview waveform is drawn. Without motion, everything shows at rest.
import { gsap, ScrollTrigger } from './gsap.js';

// Deterministic waveform so every visit draws the same recording.
function fillWaves() {
  document.querySelectorAll('[data-ui-wave]').forEach((wave) => {
    if (wave.childElementCount) return;
    for (let i = 0; i < 64; i++) {
      const h = 20 + Math.abs(Math.sin(i * 0.55) * 55 + Math.sin(i * 1.7) * 25);
      const bar = document.createElement('i');
      bar.style.setProperty('--h', Math.min(100, Math.round(h)));
      wave.append(bar);
    }
  });
}

export function initUiFragments({ reduced }) {
  fillWaves();
  if (reduced) return;

  const onEnter = (el, animate) =>
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: animate });

  document.querySelectorAll('[data-ui-bars]').forEach((bars) => {
    const cols = bars.querySelectorAll('span');
    gsap.set(cols, { scaleY: 0 });
    onEnter(bars, () => gsap.to(cols, { scaleY: 1, duration: 1.1, ease: 'expo.out', stagger: 0.04 }));
  });

  document.querySelectorAll('[data-ui-draw]').forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    onEnter(path, () => gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }));
  });

  document.querySelectorAll('[data-ui-grow]').forEach((bar) => {
    gsap.set(bar, { scaleX: 0 });
    onEnter(bar, () => gsap.to(bar, { scaleX: 1, duration: 1.4, ease: 'expo.out' }));
  });

  document.querySelectorAll('[data-ui-score]').forEach((ring) => {
    const end = Number(getComputedStyle(ring).getPropertyValue('--v')) || 0;
    const label = ring.querySelector('b');
    const state = { v: 0 };
    ring.style.setProperty('--v', 0);
    label.textContent = '0';
    onEnter(ring, () =>
      gsap.to(state, {
        v: end,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          ring.style.setProperty('--v', state.v.toFixed(1));
          label.textContent = Math.round(state.v);
        },
      }),
    );
  });

  document.querySelectorAll('[data-ui-wave]').forEach((wave) => {
    const bars = wave.children;
    gsap.set(bars, { scaleY: 0.1 });
    onEnter(wave, () => gsap.to(bars, { scaleY: 1, duration: 0.8, ease: 'back.out(2)', stagger: { each: 0.012, from: 'start' } }));
  });

  // The card being dragged in each kanban drifts back and forth.
  document.querySelectorAll('.ui-kcard.is-moving').forEach((card) => {
    gsap.to(card, { x: 10, y: -4, rotation: -3, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });
}
