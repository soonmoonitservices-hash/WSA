/**
 * Kontaktformular: holt beim Laden ein signiertes Zeit-Token vom Server
 * (Spam-Schutz ohne Captcha), prüft die Eingaben vor dem Absenden,
 * zählt Zeichen und verhindert doppeltes Absenden.
 */
function initContactForm() {
  const form = document.querySelector('form[data-token-url]');
  if (!form) return;

  const tokenField = form.elements.namedItem('token');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.querySelector('.form__submit-label');
  const idleLabel = submitLabel.textContent;

  const loadToken = () =>
    fetch(form.dataset.tokenUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then(({ token }) => {
        tokenField.value = token;
      })
      .catch(() => {
        /* Ohne Token lehnt der Server ab und zeigt einen Hinweis. */
      });

  const setSending = (sending) => {
    submit.disabled = sending;
    submit.classList.toggle('is-sending', sending);
    submitLabel.textContent = sending ? 'Wird gesendet …' : idleLabel;
  };

  // Zeichenzähler: erscheint erst ab 80 % des Limits
  form.querySelectorAll('[data-count-for]').forEach((counter) => {
    const field = form.elements.namedItem(counter.dataset.countFor);
    const update = () => {
      const { length } = field.value;
      counter.textContent = `${length} / ${field.maxLength}`;
      counter.hidden = length < field.maxLength * 0.8;
    };
    field.addEventListener('input', update);
    update();
  });

  // Nach einem Fehlversuch sofort live prüfen
  form.addEventListener('input', (event) => {
    const field = event.target.closest('.form__field');
    if (field && form.classList.contains('was-validated')) field.classList.toggle('is-invalid', !event.target.checkValidity());
  });

  loadToken();

  form.addEventListener('submit', (event) => {
    form.querySelectorAll('.form__input').forEach((input) => {
      input.value = input.value.trim() === '' ? '' : input.value;
      input.closest('.form__field').classList.toggle('is-invalid', !input.checkValidity());
    });
    if (!form.checkValidity()) {
      event.preventDefault();
      form.classList.add('was-validated');
      form.querySelector('.form__input:invalid')?.focus();
      return;
    }
    setSending(true);
  });

  // Zurück-Button (bfcache): Formular wieder benutzbar machen, frisches Token holen
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    setSending(false);
    loadToken();
  });
}
