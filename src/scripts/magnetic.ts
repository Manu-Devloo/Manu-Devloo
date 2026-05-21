// Magnetic pull effect on [data-magnetic] elements.

const STRENGTH = 0.35;

const init = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    if ((el as any)._magBound) return;
    (el as any)._magBound = true;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
    };
    const onLeave = () => {
      el.style.transform = '';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
