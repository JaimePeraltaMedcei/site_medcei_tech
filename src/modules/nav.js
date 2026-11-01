// Navigation: marks the current page, opens the products menu, hides on the way
// down and returns on the way up, turns dark over dark sections and drives the
// phone menu. Same-page anchors scroll smoothly.
import { ScrollTrigger } from './gsap.js';
import { scrollToTarget, getLenis } from './smooth-scroll.js';

const DARK_SECTIONS = '.day, .contact, .cta-band, .footer, .p-hero--superapp, .sequence:not(.sequence--light)';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!nav) return;

  markCurrentPage(nav, menu);
  initMega(nav);

  // Hide on scroll down, show on scroll up.
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && menu.hidden && !nav.matches(':focus-within'));
    lastY = y;
  }, { passive: true });

  // Dark style over dark sections. A pinned section scrolls for as long as its
  // pin spacer, so that is what gets measured.
  const span = (el) => (el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el);
  document.querySelectorAll(DARK_SECTIONS).forEach((el) => {
    ScrollTrigger.create({
      trigger: span(el),
      start: 'top 40px',
      end: 'bottom 40px',
      onToggle: (self) => nav.classList.toggle('is-dark', self.isActive),
    });
  });

  // Same-page anchors.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.closest('[data-products-index]')) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || url.hash.length < 2) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
  });

  // Phone menu.
  const openMenu = () => {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    getLenis()?.stop();
  };
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    getLenis()?.start();
  }
  toggle.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
}

// aria-current on the links that lead to the page we are on (or its section).
function markCurrentPage(...roots) {
  const path = location.pathname.replace(/index\.html$/, '');
  roots.forEach((root) =>
    root.querySelectorAll('a[href^="/"]').forEach((a) => {
      const href = a.getAttribute('href').split(/[?#]/)[0];
      if (href === '/') return;
      if (path === href) a.setAttribute('aria-current', 'page');
      else if (path.startsWith(href)) a.classList.add('is-section');
    }),
  );
}

// Products menu: opens on hover and keyboard focus, and on tap for touch screens.
function initMega(nav) {
  const root = nav.querySelector('[data-mega-root]');
  if (!root) return;
  const trigger = root.querySelector('[data-mega-trigger]');
  let closeTimer;

  const open = () => { clearTimeout(closeTimer); root.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); };
  const close = () => { root.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); };

  root.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && open());
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') closeTimer = setTimeout(close, 180); });
  root.addEventListener('focusin', open);
  root.addEventListener('focusout', (e) => !root.contains(e.relatedTarget) && close());
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); trigger.focus(); } });
  trigger.addEventListener('click', (e) => {
    if (window.matchMedia('(hover: none)').matches && !root.classList.contains('is-open')) {
      e.preventDefault();
      open();
    }
  });
}
