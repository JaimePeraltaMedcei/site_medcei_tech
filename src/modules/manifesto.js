// Manifesto: the sentence lights up word by word as the section is scrolled.
import { gsap, SplitText } from './gsap.js';

export function initManifesto() {
  const section = document.querySelector('[data-manifesto]');
  if (!section) return;

  const text = section.querySelector('[data-manifesto-text]');
  const split = SplitText.create(text, { type: 'words' });

  gsap.fromTo(
    split.words,
    { opacity: 0.18 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: true,
      },
    },
  );
}
