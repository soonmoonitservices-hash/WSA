const CONSENT_KEY = 'wsa-consent';

/** Web Storage can throw (private mode, blocked site data) – then the banner simply shows again. */
const safeStorage = (getStore) => ({
  get(key) {
    try {
      return getStore().getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      getStore().setItem(key, value);
    } catch {
      /* ignorieren */
    }
  },
});

const local = safeStorage(() => localStorage);
const session = safeStorage(() => sessionStorage);

const isReload = () => performance.getEntriesByType('navigation')[0]?.type === 'reload';

/**
 * Banner erscheint beim ersten Seitenaufruf und bei jedem Neuladen.
 * Nach einer Auswahl bleibt er beim Wechsel zwischen Seiten (im selben Tab) aus.
 * Mit data-remember="true" wird die Auswahl dauerhaft gespeichert.
 */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  const remember = banner.dataset.remember === 'true';
  if (remember && local.get(CONSENT_KEY)) return;
  if (!remember && session.get(CONSENT_KEY) && !isReload()) return;

  banner.hidden = false;

  banner.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent]');
    if (!button) return;
    (remember ? local : session).set(CONSENT_KEY, button.dataset.consent);
    banner.hidden = true;
  });
}
