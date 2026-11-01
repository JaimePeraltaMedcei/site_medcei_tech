// Product list: each product's picture turns and grows a little as it passes.
import { gsap } from './gsap.js';

export function initCatalog() {
  gsap.utils.toArray('[data-item]').forEach((item) => {
    const img = item.querySelector('[data-item-img]');
    gsap.from(item.querySelector('.item__copy').children, {
      y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: item, start: 'top 75%', once: true },
    });
    if (img) {
      gsap.fromTo(img, { rotation: -10, scale: 0.85 }, {
        rotation: 6, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });
}
