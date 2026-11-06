// Progressive enhancement only – the site works fully without JavaScript.

function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('nav-open', open); // sperrt das Scrollen dahinter
  };

  // Beim Wechsel auf Desktop-Breite Menü schließen
  window.matchMedia('(min-width: 52.01rem)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
}

/** Untermenüs: Klick öffnet/schließt, Escape oder Klick daneben schließt. */
function initDropdowns() {
  const toggles = [...document.querySelectorAll('.nav__dropdown-toggle')];
  if (!toggles.length) return;

  const close = (except) =>
    toggles.forEach((toggle) => toggle !== except && toggle.setAttribute('aria-expanded', 'false'));

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      close(toggle);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav__dropdown')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = toggles.find((toggle) => toggle.getAttribute('aria-expanded') === 'true');
    close();
    open?.focus();
  });
}

/** Shows the server's error message after a redirect (?status=…). */
function initFormStatus() {
  const status = new URLSearchParams(window.location.search).get('status');
  if (!status) return;
  const message = document.querySelector(`[data-status="${CSS.escape(status)}"]`);
  if (message) message.hidden = false;
}

initNavigation();
initDropdowns();
initFormStatus();
initContactForm();
initGallery();
initCookieBanner();
initHeroVideo();
initHeroNetwork();
initTypewriter();
