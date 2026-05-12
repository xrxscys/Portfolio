import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupReveal(container: HTMLElement, selector = '.reveal') {
  const els = container.querySelectorAll(selector);
  els.forEach(el => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}

export function killReveal(container: HTMLElement) {
  const els = container.querySelectorAll('.reveal');
  els.forEach(el => {
    const trigger = ScrollTrigger.getById(el as any);
    if (trigger) trigger.kill();
    gsap.killTweensOf(el);
  });
  ScrollTrigger.refresh();
}
