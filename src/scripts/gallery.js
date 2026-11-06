/**
 * Accordion gallery (see src/components/gallery.js). Hover, focus or tap
 * opens a panel; a second tap follows the link. Arrow keys move between
 * panels. Inactive panels get a parallax shift (--shift) and tilt classes.
 */
function initGallery() {
  document.querySelectorAll('[data-gallery]').forEach((root) => {
    const panels = [...root.children];
    const links = panels.map((panel) => panel.querySelector('a'));
    let active = Math.max(0, panels.findIndex((panel) => panel.classList.contains('is-active')));
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const PARALLAX = 0.5;

    const mediaWidth = () => {
      // Bilder so breit wie das geöffnete Panel – so skalieren sie beim Öffnen nicht.
      const open = panels[active].getBoundingClientRect();
      root.style.setProperty('--media-w', `${Math.round(Math.max(open.width, 240))}px`);
      return open.width;
    };

    const render = () => {
      panels.forEach((panel, i) => {
        const isActive = i === active;
        panel.classList.toggle('is-active', isActive);
        panel.classList.toggle('is-before', i < active);
        panel.classList.toggle('is-after', i > active);
        const drift = Math.max(-1.5, Math.min(1.5, active - i));
        panel.style.setProperty('--shift', isActive ? '0px' : `${drift * PARALLAX * 0.06 * root.clientWidth * 0.5}px`);
        if (isActive) links[i].setAttribute('aria-current', 'true');
        else links[i].removeAttribute('aria-current');
      });
    };

    const activate = (i) => {
      if (i === active) return;
      active = i;
      render();
      // Breite erst nach der Übergangsanimation neu messen
      window.setTimeout(mediaWidth, 650);
    };

    links.forEach((link, i) => {
      link.addEventListener('mouseenter', () => finePointer.matches && activate(i));
      link.addEventListener('focus', () => activate(i));
      link.addEventListener('click', (event) => {
        if (i !== active) {
          event.preventDefault(); // erster Tipp öffnet, zweiter folgt dem Link
          activate(i);
        }
      });
      link.addEventListener('keydown', (event) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        links[(i + step + links.length) % links.length].focus();
      });
    });

    new ResizeObserver(mediaWidth).observe(root);
    root.classList.add('is-ready');
    render();
    mediaWidth();
  });
}
