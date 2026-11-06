/**
 * Holt beim Laden ein signiertes Zeit-Token vom Server (Spam-Schutz ohne
 * Captcha) und verhindert doppeltes Absenden.
 */
function initContactForm() {
  const form = document.querySelector('form[data-token-url]');
  if (!form) return;

  const tokenField = form.elements.namedItem('token');
  const submit = form.querySelector('[type="submit"]');

  const loadToken = () =>
    fetch(form.dataset.tokenUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then(({ token }) => {
        tokenField.value = token;
      })
      .catch(() => {
        /* Ohne Token lehnt der Server ab und zeigt einen Hinweis. */
      });

  loadToken();

  form.addEventListener('submit', () => {
    submit.disabled = true;
    submit.textContent = 'Wird gesendet …';
  });

  // Zurück-Button (bfcache): Formular wieder benutzbar machen, frisches Token holen
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    submit.disabled = false;
    submit.textContent = 'Absenden';
    loadToken();
  });
}
