// Hero: an intro timeline after the loader, a pinned scroll scene in which the
// headline parts and the green disc grows to fill the screen, and a pointer tilt
// on the SafeMove patch.
import { gsap, SplitText } from './gsap.js';

let intro;

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const lines = hero.querySelectorAll('[data-hero-line]');
  const disc = hero.querySelector('[data-hero-disc]');
  const discFill = disc.querySelector('span');
  const product = hero.querySelector('[data-hero-product]');
  const productImg = product.querySelector('img');
  const foot = hero.querySelector('[data-hero-foot]');

  const split = SplitText.create(lines, { type: 'chars', mask: 'chars' });

  // Intro, played once the loader lifts.
  intro = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.025 })
    .from(discFill, { scale: 0, duration: 1.6 }, 0.1)
    .from(productImg, { scale: 0.6, rotation: -30, autoAlpha: 0, duration: 1.6 }, 0.25)
    .from(foot.children, { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.7)
    .from('.hero__scroll', { autoAlpha: 0, duration: 0.6 }, 1.2)
    .from('[data-nav]', { yPercent: -150, duration: 1 }, 0.6);

  // Gentle idle float.
  gsap.to(product, { y: -14, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // Scale the disc so it covers the whole viewport.
  const coverScale = () => {
    const d = Math.hypot(window.innerWidth, window.innerHeight);
    return (d / disc.offsetWidth) * 1.08;
  };

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    .to(lines[0], { xPercent: -60, autoAlpha: 0 }, 0)
    .to(lines[1], { xPercent: 60, autoAlpha: 0 }, 0)
    .to(foot, { y: -60, autoAlpha: 0, duration: 0.4 }, 0)
    .to('.hero__scroll', { autoAlpha: 0, duration: 0.2 }, 0)
    .to(product, { scale: 1.9, rotation: 18, duration: 0.8 }, 0)
    .to(product, { autoAlpha: 0, yPercent: -40, duration: 0.3 }, 0.6)
    .to(disc, { scale: coverScale, duration: 1 }, 0.05);

  // Pointer tilt, desktop only.
  if (window.matchMedia('(hover: hover)').matches) {
    const rx = gsap.quickTo(productImg, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(productImg, 'rotationY', { duration: 0.8, ease: 'power3' });
    gsap.set(product, { transformPerspective: 900 });
    hero.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      ry(x * 22);
      rx(-y * 22);
    });
  }
}

export function playHeroIntro() {
  intro?.play();
}
