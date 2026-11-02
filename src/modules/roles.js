// "Para cada pessoa da equipa": accessible tabs, one panel per role. Without
// script every panel stays visible, stacked.
import { gsap, prefersReducedMotion } from './gsap.js';

export function initRoles() {
  document.querySelectorAll('[data-roles]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const reduced = prefersReducedMotion();

    const select = (index, focus = false) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
      if (!reduced) {
        const panel = panels[index];
        gsap.fromTo(panel.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.08, overwrite: true });
      }
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) {
          e.preventDefault();
          select((i + keys[e.key] + tabs.length) % tabs.length, true);
        } else if (e.key === 'Home') {
          e.preventDefault();
          select(0, true);
        } else if (e.key === 'End') {
          e.preventDefault();
          select(tabs.length - 1, true);
        }
      });
    });

    select(0);
  });
}
