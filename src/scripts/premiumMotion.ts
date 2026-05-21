import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __premiumLenis?: Lenis;
    __premiumLenisTicker?: (time: number) => void;
  }
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTouchOrSmall = () =>
  window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches;

const markRevealed = () => {
  document
    .querySelectorAll<HTMLElement>('[data-reveal]')
    .forEach((el) => el.setAttribute('data-reveal', 'in'));
  document
    .querySelectorAll<HTMLElement>('[data-reveal-words]')
    .forEach((el) => el.setAttribute('data-reveal-words', 'in'));
};

const initSmoothScroll = () => {
  if (window.__premiumLenis) return window.__premiumLenis;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  window.__premiumLenis = lenis;
  window.__premiumLenisTicker = ticker;
  return lenis;
};

const setPerspectiveMotion = () => {
  const root = document.documentElement;
  let raf = 0;

  window.addEventListener(
    'pointermove',
    (event) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        root.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
        root.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
      });
    },
    { passive: true },
  );
};

const animateHero = () => {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  hero
    .querySelectorAll<HTMLElement>('[data-reveal-words]')
    .forEach((el) => el.setAttribute('data-reveal-words', 'in'));
  gsap.set('.hero__title .word-inner', { clearProps: 'transform' });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo(
    '.hero__meta',
    { autoAlpha: 0, y: 18, filter: 'blur(10px)' },
    { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.75 },
  )
    .fromTo(
      '.hero__title',
      { autoAlpha: 0, y: 28, filter: 'blur(12px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.95 },
      '-=0.35',
    )
    .fromTo(
      ['.hero__lead', '.hero__ctas', '.hero__signature'],
      { autoAlpha: 0, y: 24, filter: 'blur(8px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 },
      '-=0.55',
    )
    .fromTo(
      '.hero__marquee',
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.75 },
      '-=0.35',
    );

  gsap.delayedCall(1.45, () => {
    gsap.set('.hero__title .word-inner', { clearProps: 'transform' });
    document
      .querySelectorAll<HTMLElement>('.hero [data-reveal-words]')
      .forEach((el) => el.setAttribute('data-reveal-words', 'in'));
  });

  gsap.to('.hero__inner', {
    yPercent: 10,
    opacity: 0.82,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.orb', {
    yPercent: -18,
    scale: 1.08,
    ease: 'none',
    stagger: 0.08,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
};

const animateReveals = () => {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 34, filter: 'blur(10px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.95,
        ease: 'power3.out',
        onStart: () => el.setAttribute('data-reveal', 'in'),
        scrollTrigger: {
          trigger: el,
          start: 'top 86%',
          once: true,
        },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-words]').forEach((el) => {
    if (el.closest('.hero')) return;
    const words = el.querySelectorAll<HTMLElement>('.word-inner');
    if (!words.length) return;
    gsap.fromTo(
      words,
      { yPercent: 108, rotate: 1.5 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1,
        stagger: 0.045,
        ease: 'power3.out',
        onStart: () => el.setAttribute('data-reveal-words', 'in'),
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      },
    );
  });
};

const animatePremiumPanels = () => {
  gsap.utils.toArray<HTMLElement>('[data-premium-panel]').forEach((panel) => {
    const quickX = gsap.quickTo(panel, 'rotateY', { duration: 0.45, ease: 'power3.out' });
    const quickY = gsap.quickTo(panel, 'rotateX', { duration: 0.45, ease: 'power3.out' });

    panel.addEventListener('pointermove', (event) => {
      const rect = panel.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      panel.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`);
      panel.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`);
      quickX((px - 0.5) * 7);
      quickY(-(py - 0.5) * 7);
    }, { passive: true });

    panel.addEventListener('pointerleave', () => {
      quickX(0);
      quickY(0);
    });
  });
};

const animateSections = () => {
  gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
    gsap.fromTo(
      section,
      { '--section-glow': 0 } as gsap.TweenVars,
      {
        '--section-glow': 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center 38%',
          scrub: true,
        },
      } as gsap.TweenVars,
    );
  });

  gsap.utils.toArray<HTMLElement>('.pj__card, .sk__card, .ct2__frame').forEach((card) => {
    gsap.fromTo(
      card,
      { y: 26, scale: 0.985 },
      {
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('.pj__media img, .about__portrait img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -4, scale: 1.06 },
      {
        yPercent: 4,
        scale: 1.09,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('article, .about__portrait') ?? img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
};

const init = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  if (prefersReducedMotion()) {
    markRevealed();
    return;
  }

  document.documentElement.setAttribute('data-motion', 'premium');
  if (!isTouchOrSmall()) initSmoothScroll();
  if (!isTouchOrSmall()) setPerspectiveMotion();
  animateHero();
  animateReveals();
  if (!isTouchOrSmall()) animatePremiumPanels();
  animateSections();
  ScrollTrigger.refresh();
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
