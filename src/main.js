import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import './styles/main.css';

import { ScrollTrigger, prefersReducedMotion } from './modules/gsap.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import { runLoader } from './modules/loader.js';
import { initTransitions } from './modules/transitions.js';
import { initNav } from './modules/nav.js';
import { initHero, playHeroIntro } from './modules/hero.js';
import { initPageHero, playPageHero } from './modules/page-hero.js';
import { initManifesto } from './modules/manifesto.js';
import { initReveals, initSplitTitles, initCounters } from './modules/reveal.js';
import { initProducts } from './modules/products.js';
import { initSequence } from './modules/sequence.js';
import { initDay } from './modules/day.js';
import { initCatalog } from './modules/catalog.js';
import { initOrgs } from './modules/orgs.js';
import { initSteps } from './modules/steps.js';
import { initPricing } from './modules/pricing.js';
import { initFaq } from './modules/faq.js';
import { initContact } from './modules/contact.js';
import { initFooter } from './modules/footer.js';
import { initMagnetic } from './modules/magnetic.js';
import { initUiFragments } from './modules/ui-fragments.js';
import { initRoles } from './modules/roles.js';
import { initRecommender } from './modules/recommender.js';
import { initStickyCta } from './modules/sticky-cta.js';

// Every page loads this file; each module returns early when its section is absent.
const reduced = prefersReducedMotion();
const lenis = reduced ? null : initSmoothScroll();

initContact();
initFaq();
initRoles();
initRecommender();
initUiFragments({ reduced });
initTransitions({ reduced });

if (reduced) {
  initDay(); // shows the whole day without motion
} else {
  // ScrollTriggers are created in page order so pinned sections measure correctly.
  initHero();
  initPageHero();
  initManifesto();
  initCounters();
  initProducts();
  initSequence();
  initDay();
  initCatalog();
  initSplitTitles();
  initOrgs();
  initSteps();
  initPricing();
  initFooter();
  initReveals();
  initMagnetic();
}

// Created last: their triggers must measure the pinned layout above.
initNav();
initStickyCta();

runLoader({ reduced, lenis }).then(() => {
  if (!reduced) {
    playHeroIntro();
    playPageHero();
  }
  ScrollTrigger.refresh();
});

window.addEventListener('load', () => ScrollTrigger.refresh());
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
