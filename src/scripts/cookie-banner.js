const CONSENT_KEY = 'wsa-consent';

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Speicher blockiert (z. B. privater Modus) – Banner erscheint dann erneut. */
    }
  },
};

function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  const remember = banner.dataset.remember === 'true';
  if (remember && storage.get(CONSENT_KEY)) return;

  banner.hidden = false;

  banner.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent]');
    if (!button) return;
    if (remember) storage.set(CONSENT_KEY, button.dataset.consent);
    banner.hidden = true;
  });
}
