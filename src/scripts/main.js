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

/** Shows the server's error message after a redirect (?status=…). */
function initFormStatus() {
  const status = new URLSearchParams(window.location.search).get('status');
  if (!status) return;
  const message = document.querySelector(`[data-status="${CSS.escape(status)}"]`);
  if (message) message.hidden = false;
}

initNavigation();
initFormStatus();
initCookieBanner();
initHeroVideo();
initHeroNetwork();
initTypewriter();
