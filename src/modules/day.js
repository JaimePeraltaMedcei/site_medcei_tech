// "Um dia em casa": the scroll is the clock. While the section is pinned, scrolling
// moves the time from 07:00 to 23:00, the sun crosses the sky and the Super App
// feed fills with the day's events. Without motion the whole day is shown.
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap.js';
import { events, DAY_START, DAY_END, toMinutes, toClock } from '../data/day.js';

const VISIBLE = 5;

export function initDay() {
  const section = document.querySelector('[data-day]');
  if (!section) return;

  const feed = section.querySelector('[data-day-feed]');
  const clock = section.querySelector('[data-day-clock]');
  const now = section.querySelector('[data-day-now]');
  const progressBar = section.querySelector('[data-day-progress]');
  const sun = section.querySelector('[data-day-sun]');

  const items = events
    .slice()
    .reverse() // newest on top
    .map((ev) => {
      const li = document.createElement('li');
      li.className = 'feed-item';
      li.dataset.minutes = toMinutes(ev.time);
      li.innerHTML = `
        <div class="feed-item__card"><div class="feed-item__inner">
          <span class="feed-item__time">${ev.time}</span>
          <span class="feed-item__tag"${ev.alert ? ' data-alert' : ''}>${ev.tag}</span>
          <span class="feed-item__text">${ev.text}</span>
        </div></div>`;
      return { li, minutes: toMinutes(ev.time), now: ev.now };
    });
  feed.append(...items.map((i) => i.li));

  let lastKey = '';
  const render = (minutes) => {
    clock.textContent = toClock(minutes);
    const shown = items.filter((i) => i.minutes <= minutes);
    const visible = shown.slice(0, VISIBLE);
    const key = visible.map((i) => i.minutes).join();
    if (key === lastKey) return;
    lastKey = key;
    items.forEach((i) => {
      i.li.classList.toggle('is-on', visible.includes(i));
      i.li.classList.toggle('is-latest', i === visible[0]);
    });
    now.textContent = visible[0]?.now ?? 'Bom dia, D. Amélia';
  };

  if (prefersReducedMotion()) {
    render(DAY_END);
    return;
  }

  render(DAY_START);

  // The sun rises from below, left of the phone, peaks above it and sets on the right,
  // turning from yellow to the brand grey as the evening comes.
  const placeSun = (p) => {
    const w = sun.parentElement.offsetWidth;
    const h = sun.parentElement.offsetHeight;
    const angle = Math.PI * (1 - p);
    gsap.set(sun, {
      x: Math.cos(angle) * w * 0.3,
      y: h * 0.5 - Math.sin(angle) * h * 0.78,
      backgroundColor: gsap.utils.interpolate('#ECC440', '#5b6569', gsap.utils.clamp(0, 1, (p - 0.7) / 0.3)),
    });
  };
  placeSun(0);

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=260%',
    pin: true,
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      render(DAY_START + (DAY_END - DAY_START) * p);
      gsap.set(progressBar, { scaleX: p });
      placeSun(p);
    },
    onRefresh: (self) => placeSun(self.progress),
  });

  gsap.from(section.querySelector('.phone'), {
    y: 120,
    rotation: 6,
    autoAlpha: 0,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  });
}
