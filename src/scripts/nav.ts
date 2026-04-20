// Header behavior: shrink on scroll, active section tracking, mobile menu toggle.

const init = () => {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header && !(header as any)._scrollBound) {
    (header as any)._scrollBound = true;
    const onScroll = () => {
      if (window.scrollY > 40) header.setAttribute('data-scrolled', 'true');
      else header.removeAttribute('data-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (toggle && nav && !(nav as any)._navBound) {
    (nav as any)._navBound = true;
    const mobileMq = window.matchMedia('(max-width: 900px)');

    const setMenuState = (nextOpen: boolean) => {
      const open = mobileMq.matches && nextOpen;
      nav.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-expanded', String(open));
      document.documentElement.toggleAttribute('data-nav-open', open);
    };

    toggle.addEventListener('click', () => {
      setMenuState(nav.getAttribute('data-open') !== 'true');
    });

    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        setMenuState(false);
      }),
    );

    const syncViewportState = () => {
      if (!mobileMq.matches) setMenuState(false);
    };

    if (typeof mobileMq.addEventListener === 'function') {
      mobileMq.addEventListener('change', syncViewportState);
    } else {
      mobileMq.addListener(syncViewportState);
    }

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuState(false);
    });

    syncViewportState();
  }

  // Active section underline
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = links
    .map((a) => {
      const id = a.getAttribute('href')?.replace('#', '');
      return id ? document.getElementById(id) : null;
    })
    .filter((el): el is HTMLElement => !!el);

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((l) =>
              l.toggleAttribute('data-active', l.getAttribute('href') === `#${id}`),
            );
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
  }
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load', init);
