import { html } from '../lib/html.js';

const input = ({ name, label, type = 'text', required = false, autocomplete, maxlength = 100 }) => html`
  <div class="form__field">
    <label for="${name}">${label}${required ? html`<span aria-hidden="true">*</span>` : ''}</label>
    <input id="${name}" name="${name}" type="${type}" maxlength="${maxlength}"
      ${autocomplete ? html`autocomplete="${autocomplete}"` : ''} ${required ? 'required' : ''}>
  </div>
`;

/**
 * Posts to /api/kontakt.php (see public/api). The hidden "website" field is a
 * honeypot: real users never fill it, bots usually do.
 */
export const contactForm = () => html`
  <form class="form" id="formular" action="/api/kontakt.php" method="post">
    <div class="form__status form__status--error" data-status="error" role="alert" hidden>
      Bitte prüfen Sie Ihre Eingaben. E-Mail und Nachricht sind Pflichtfelder.
    </div>
    <div class="form__status form__status--error" data-status="limit" role="alert" hidden>
      Sie haben gerade bereits eine Nachricht gesendet. Bitte versuchen Sie es in einer Minute erneut.
    </div>
    <div class="form__status form__status--error" data-status="server" role="alert" hidden>
      Ihre Nachricht konnte nicht gesendet werden. Bitte kontaktieren Sie uns telefonisch oder per E-Mail.
    </div>

    <div class="form__row">
      ${input({ name: 'vorname', label: 'Vorname', autocomplete: 'given-name' })}
      ${input({ name: 'nachname', label: 'Nachname', autocomplete: 'family-name' })}
    </div>
    <div class="form__row">
      ${input({ name: 'email', label: 'E-Mail', type: 'email', required: true, autocomplete: 'email', maxlength: 254 })}
      ${input({ name: 'telefon', label: 'Telefon', type: 'tel', autocomplete: 'tel', maxlength: 40 })}
    </div>
    <div class="form__field">
      <label for="nachricht">Ihre Nachricht<span aria-hidden="true">*</span></label>
      <textarea id="nachricht" name="nachricht" rows="6" maxlength="5000" required></textarea>
    </div>

    <div class="form__honeypot" aria-hidden="true">
      <label for="website">Website</label>
      <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>

    <p class="form__hint">
      Mit dem Absenden werden Ihre Angaben zur Bearbeitung Ihrer Anfrage verwendet.
      Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.
    </p>
    <button class="button button--primary" type="submit">Absenden</button>
  </form>
`;
