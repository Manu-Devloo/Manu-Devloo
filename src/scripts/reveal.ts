// IntersectionObserver-driven reveal animations.
// Handles [data-reveal] blocks and [data-reveal-words] text splits.

const init = () => {
  // Split any [data-reveal-words] element into wrapped words once.
  document.querySelectorAll<HTMLElement>('[data-reveal-words]').forEach((el) => {
    if (el.dataset.split === 'true') return;
    const text = el.textContent ?? '';
    const words = text.split(/(\s+)/);
    el.textContent = '';
    let i = 0;
    for (const piece of words) {
      if (piece === '') continue;
      if (/^\s+$/.test(piece)) {
        el.appendChild(document.createTextNode(piece));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'word';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.style.setProperty('--i', String(i++));
      inner.textContent = piece;
      span.appendChild(inner);
      el.appendChild(span);
    }
    el.dataset.split = 'true';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute('data-reveal-words')) el.setAttribute('data-reveal-words', 'in');
        else el.setAttribute('data-reveal', 'in');
        observer.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  document
    .querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-words]')
    .forEach((el) => observer.observe(el));
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
