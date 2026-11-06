/**
 * Stellenkarten zum Umdrehen (Karriere-Seite).
 * - Klick auf die Karte oder „Details“ dreht sie um, Links bleiben normale Links
 * - am Handy zusätzlich: seitlich wischen
 * - mit Maus: leichtes 3D-Neigen mit Lichtreflex
 * - Tastatur: Buttons sind fokussierbar, die verdeckte Seite ist inert
 * Ohne JavaScript bleibt die Vorderseite mit „Zur Stelle“ sichtbar.
 */
function initFlipCards() {
  const cards = document.querySelectorAll('[data-flip-card]');
  if (!cards.length) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TILT_MAX = 8;
  const SWIPE_MIN = 45;

  cards.forEach((card) => {
    const front = card.querySelector('.flip-card__face--front');
    const back = card.querySelector('.flip-card__face--back');
    let swipe = null;
    let suppressClick = false;

    const setFlipped = (flipped, { moveFocus = false } = {}) => {
      card.classList.toggle('is-flipped', flipped);
      const [shown, hidden] = flipped ? [back, front] : [front, back];
      shown.inert = false;
      shown.removeAttribute('aria-hidden');
      hidden.inert = true;
      hidden.setAttribute('aria-hidden', 'true');
      if (moveFocus) shown.querySelector('[data-flip-toggle]')?.focus({ preventScroll: true });
    };

    const toggle = (options) => setFlipped(!card.classList.contains('is-flipped'), options);

    const resetTilt = () => {
      card.style.setProperty('--fc-tx', '0deg');
      card.style.setProperty('--fc-ty', '0deg');
      card.style.setProperty('--fc-sheen', '0');
      card.classList.remove('is-lifted');
    };

    card.querySelectorAll('[data-flip-toggle]').forEach((button) => {
      button.hidden = false;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        toggle({ moveFocus: event.detail === 0 }); // per Tastatur: Fokus auf die andere Seite
      });
    });

    // Klick auf die freie Kartenfläche dreht – Links und Buttons nicht
    card.addEventListener('click', (event) => {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      if (event.target.closest('a, button')) return;
      if (window.getSelection()?.toString()) return; // Text markiert → nicht drehen
      toggle();
    });

    // Wischen am Handy
    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      swipe = { x: event.clientX, y: event.clientY };
    });
    card.addEventListener('pointerup', (event) => {
      if (!swipe) return;
      const dx = event.clientX - swipe.x;
      const dy = event.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.5) {
        suppressClick = true;
        window.setTimeout(() => (suppressClick = false), 400);
        toggle();
      }
    });
    card.addEventListener('pointercancel', () => (swipe = null));

    // 3D-Neigen mit Maus
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) return;
      const rect = card.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      card.style.setProperty('--fc-tx', `${((0.5 - py) * 2 * TILT_MAX).toFixed(2)}deg`);
      card.style.setProperty('--fc-ty', `${((px - 0.5) * 2 * TILT_MAX).toFixed(2)}deg`);
      card.style.setProperty('--fc-gx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--fc-gy', `${(py * 100).toFixed(1)}%`);
      card.style.setProperty('--fc-sheen', '1');
      card.classList.add('is-lifted');
    });
    card.addEventListener('pointerleave', resetTilt);

    card.classList.add('is-ready');
  });
}
