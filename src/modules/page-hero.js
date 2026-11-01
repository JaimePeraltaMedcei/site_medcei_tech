// Inner page headers: the title rises letter by letter, the picture grows in and
// the rest fades up. The picture then drifts slowly with the scroll.
import { gsap, SplitText } from './gsap.js';

let intro;

export function initPageHero() {
  const hero = document.querySelector('[data-page-hero]');
  if (!hero) return;

  const title = hero.querySelector('[data-hero-split]');
  const media = hero.querySelector('[data-hero-media]');
  const rest = [...hero.querySelectorAll('.crumbs, [class$="__kind"], [class$="__lead"], .status, [class$="__actions"], .contact__lead, .contact__phone, .contact__small, .contact__mail, .form, .pricing__plan, .pricing__price, .pricing__terms, .pricing__main .checklist, .pricing__main > .btn, .notfound__title, .notfound__lead')];

  intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  if (title) {
    const split = SplitText.create(title, { type: 'words,chars', mask: 'words' });
    intro.from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.018 }, 0);
  }
  if (media) intro.from(media, { scale: 0.85, autoAlpha: 0, duration: 1.6 }, 0.1);
  if (rest.length) intro.from(rest, { y: 30, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.35);

  if (media) {
    gsap.to(media, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

export function playPageHero() {
  intro?.play();
}
