// Smooth, spring-follow custom cursor with hover scaling.
// Disabled automatically on touch devices via CSS.

const init = () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  const loop = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  const hoverTargets = 'a, button, [data-cursor-hover], input, textarea, select, label';
  document.addEventListener('mouseover', (e) => {
    if ((e.target as HTMLElement).closest(hoverTargets)) ring.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if ((e.target as HTMLElement).closest(hoverTargets)) ring.classList.remove('is-hover');
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
