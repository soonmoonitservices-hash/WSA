import { html } from '../lib/html.js';

const input = ({ name, label, type = 'text', required = false, autocomplete, maxlength = 100 }) => html`
  <div class="form__field">
    <label for="${name}">${label}${required ? html`<span aria-hidden="true">*</span>` : ''}</label>
    <input id="${name}" name="${name}" type="${type}" maxlength="${maxlength}"
      ${autocomplete ? html`autocomplete="${autocomplete}"` : ''} ${required ? 'required' : ''}>
  </div>
`;

/**
 * Posts to /api/kontakt/ (Vercel: api/kontakt.js, Apache: public/api/kontakt.php).
 * Spam protection without captcha: src/scripts/contact-form.js fetches a signed
 * time token on load; "website" is a honeypot that only bots fill in.
 */
export const contactForm = () => html`
  <form class="form" id="formular" action="/api/kontakt/" method="post" data-token-url="/api/kontakt/">
    <noscript>
      <p class="form__status form__status--error">Zum Absenden bitte JavaScript aktivieren – oder schreiben Sie uns direkt per E-Mail oder rufen Sie an.</p>
    </noscript>
    <div class="form__status form__status--error" data-status="error" role="alert" hidden>
      Bitte prüfen Sie Ihre Eingaben. E-Mail und Nachricht sind Pflichtfelder.
    </div>
    <div class="form__status form__status--error" data-status="limit" role="alert" hidden>
      Sie haben gerade bereits eine Nachricht gesendet. Bitte versuchen Sie es in einer Minute erneut.
    </div>
    <div class="form__status form__status--error" data-status="links" role="alert" hidden>
      Ihre Nachricht enthält zu viele Links. Bitte entfernen Sie sie und senden Sie erneut.
    </div>
    <div class="form__status form__status--error" data-status="expired" role="alert" hidden>
      Das Formular war zu lange geöffnet. Bitte senden Sie Ihre Nachricht erneut.
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

    <input type="hidden" name="token" value="">
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
