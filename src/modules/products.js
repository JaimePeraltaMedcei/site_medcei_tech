// Products: on desktop the four panels scroll sideways inside a pinned viewport;
// on phones they stack. The index pill follows the active product.
import { gsap, ScrollTrigger } from './gsap.js';
import { scrollToTarget } from './smooth-scroll.js';

export function initProducts() {
  const section = document.querySelector('[data-products]');
  if (!section) return;

  const viewport = section.querySelector('[data-products-viewport]');
  const track = section.querySelector('[data-products-track]');
  const panels = gsap.utils.toArray('.panel', track);
  const links = gsap.utils.toArray('a', section.querySelector('[data-products-index]'));
  const pill = section.querySelector('.products__progress');

  let current = 0;
  const setActive = (i) => {
    current = i;
    links.forEach((a, n) => a.classList.toggle('is-active', n === i));
    const a = links[i];
    gsap.to(pill, { x: a.offsetLeft - 6, width: a.offsetWidth, duration: 0.5, ease: 'expo.out' });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 901px)', () => {
    setActive(0);
    const distance = () => track.scrollWidth - window.innerWidth;

    const slide = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.round(self.progress * (panels.length - 1));
          if (!links[i].classList.contains('is-active')) setActive(i);
        },
      },
    });

    // Index links jump to the matching point of the horizontal scroll.
    links.forEach((a, i) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const st = slide.scrollTrigger;
        const y = st.start + (st.end - st.start) * (i / (panels.length - 1));
        scrollToTarget(y);
      }),
    );

    // Each panel's picture drifts against the scroll and its copy slides in.
    panels.forEach((panel) => {
      const visual = panel.querySelector('[data-parallax]');
      const copy = panel.querySelector('.panel__copy');
      if (visual) {
        gsap.fromTo(
          visual,
          { xPercent: 18, rotation: visual.tagName === 'IMG' ? 8 : 0 },
          {
            xPercent: -18,
            rotation: visual.tagName === 'IMG' ? -8 : 0,
            ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
          },
        );
      }
      gsap.from(copy.children, {
        x: 80,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left 60%', toggleActions: 'play none none reverse' },
      });
    });

    reportBars({ containerAnimation: slide, start: 'left 50%' });
  });

  mm.add('(max-width: 900px)', () => {
    panels.forEach((panel) => {
      gsap.from(panel.querySelector('.panel__copy').children, {
        y: 40, autoAlpha: 0, stagger: 0.06, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
      });
    });
    reportBars({ start: 'top 75%' });
  });

  function reportBars(trigger) {
    const report = section.querySelector('[data-report]');
    if (!report) return;
    const bars = report.querySelectorAll('.report__bar');
    const delta = report.querySelector('[data-count]');
    const state = { v: 0 };
    gsap
      .timeline({ scrollTrigger: { trigger: report, toggleActions: 'play none none reverse', ...trigger } })
      .from(bars, { scaleY: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 })
      .to(state, {
        v: Number(delta.dataset.count),
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => { delta.textContent = '−' + Math.round(state.v); },
      }, 0.2);
  }

  ScrollTrigger.addEventListener('refresh', () => setActive(current));
}
