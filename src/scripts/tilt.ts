// 3D tilt for project cards. Apply with [data-tilt].

const MAX = 6; // degrees

const init = () => {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    if ((card as any)._tiltBound) return;
    (card as any)._tiltBound = true;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * MAX * 2;
      const rotX = -(py - 0.5) * MAX * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${rotX}deg`);
        card.style.setProperty('--tilt-y', `${rotY}deg`);
        card.style.setProperty('--glow-x', `${px * 100}%`);
        card.style.setProperty('--glow-y', `${py * 100}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
