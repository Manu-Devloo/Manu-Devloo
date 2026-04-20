// Theme toggle using the View Transitions API for a smooth circular reveal.

const apply = (theme: 'dark' | 'light') => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {}
};

const init = () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  buttons.forEach((btn) => {
    if ((btn as any)._themeBound) return;
    (btn as any)._themeBound = true;

    btn.addEventListener('click', (e) => {
      const current = document.documentElement.dataset.theme ?? 'dark';
      const next = current === 'dark' ? 'light' : 'dark';

      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };

      if (!doc.startViewTransition) {
        apply(next);
        return;
      }

      const x = (e as MouseEvent).clientX;
      const y = (e as MouseEvent).clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = doc.startViewTransition(() => apply(next));
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0 at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 600,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
    });
  });
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
