import { html, raw } from '../lib/html.js';
import { icon } from './icons.js';

/** Auswahl „Worum geht es?“ – muss zu TOPICS in api/_lib/guard.js und kontakt.php passen. */
const TOPICS = ['Objektschutz', 'Veranstaltung', 'Baustelle', 'Einzelhandel', 'Alarm & Intervention', 'Sonstiges'];

const STATUS = {
  error: 'Bitte prüfen Sie Ihre Eingaben. E-Mail und Nachricht sind Pflichtfelder.',
  limit: 'Sie haben gerade bereits eine Nachricht gesendet. Bitte versuchen Sie es in einer Minute erneut.',
  links: 'Ihre Nachricht enthält zu viele Links. Bitte entfernen Sie sie und senden Sie erneut.',
  expired: 'Das Formular war zu lange geöffnet. Bitte senden Sie Ihre Nachricht erneut.',
  server: 'Ihre Nachricht konnte nicht gesendet werden. Bitte kontaktieren Sie uns telefonisch oder per E-Mail.',
};

const labelText = (label, required) =>
  required ? html`${label}<span class="form__req" aria-hidden="true">*</span>` : html`${label} <span class="form__optional">optional</span>`;

const input = ({ name, label, type = 'text', icon: iconName, required = false, autocomplete, maxlength = 100, error, extra = '' }) => html`
  <div class="form__field">
    <label class="form__label" for="${name}">${labelText(label, required)}</label>
    <div class="form__control">
      ${icon(iconName, 'icon form__icon')}
      <input class="form__input" id="${name}" name="${name}" type="${type}" maxlength="${maxlength}"
        ${autocomplete ? html`autocomplete="${autocomplete}"` : ''} ${required ? 'required' : ''}
        ${error ? html`aria-describedby="${name}-error"` : ''} ${raw(extra)}>
    </div>
    ${error ? html`<p class="form__error" id="${name}-error">${icon('alert')}${error}</p>` : ''}
  </div>
`;

/**
 * Posts to /api/kontakt/ (Vercel: api/kontakt.js, Apache/Hostinger: public/api/kontakt.php).
 * Spam protection without captcha: src/scripts/contact-form.js fetches a signed
 * time token on load; "website" is a honeypot that only bots fill in.
 */
export const contactForm = () => html`
  <form class="form form-card" id="formular" action="/api/kontakt/" method="post" data-token-url="/api/kontakt/" novalidate>
    <div class="form-card__head">
      <h2 class="form-card__title">Anfrage senden</h2>
      <p class="form-card__lead">Kostenlos und unverbindlich – wir melden uns so schnell wie möglich bei Ihnen.</p>
    </div>

    <noscript>
      <p class="form__status">${icon('alert')}Zum Absenden bitte JavaScript aktivieren – oder schreiben Sie uns direkt per E-Mail oder rufen Sie an.</p>
    </noscript>
    ${Object.entries(STATUS).map(
      ([key, text]) => html`<div class="form__status" data-status="${key}" role="alert" hidden>${icon('alert')}<span>${text}</span></div>`,
    )}

    <fieldset class="form__topics">
      <legend class="form__label">Worum geht es? <span class="form__optional">optional</span></legend>
      <div class="chips">
        ${TOPICS.map(
          (topic) => html`
            <label class="chip">
              <input type="radio" name="anliegen" value="${topic}">
              <span>${topic}</span>
            </label>
          `,
        )}
      </div>
    </fieldset>

    <div class="form__row">
      ${input({ name: 'vorname', label: 'Vorname', icon: 'user', autocomplete: 'given-name', extra: 'autocapitalize="words" enterkeyhint="next"' })}
      ${input({ name: 'nachname', label: 'Nachname', icon: 'user', autocomplete: 'family-name', extra: 'autocapitalize="words" enterkeyhint="next"' })}
    </div>
    <div class="form__row">
      ${input({
        name: 'email', label: 'E-Mail', type: 'email', icon: 'mail', required: true, autocomplete: 'email', maxlength: 254,
        error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        extra: 'inputmode="email" autocapitalize="off" spellcheck="false" enterkeyhint="next"',
      })}
      ${input({
        name: 'telefon', label: 'Telefon', type: 'tel', icon: 'phone', autocomplete: 'tel', maxlength: 40,
        error: 'Bitte nur Ziffern, Leerzeichen und + ( ) - / verwenden.',
        extra: 'inputmode="tel" pattern="[0-9 \\(\\)+\\-\\/.]{4,40}" enterkeyhint="next"',
      })}
    </div>
    <div class="form__field">
      <label class="form__label" for="nachricht">${labelText('Ihre Nachricht', true)}</label>
      <div class="form__control form__control--area">
        ${icon('message', 'icon form__icon')}
        <textarea class="form__input" id="nachricht" name="nachricht" rows="6" minlength="2" maxlength="500" required
          aria-describedby="nachricht-error nachricht-count"
          placeholder="Was dürfen wir für Sie absichern? Ort, Zeitraum, Umfang …"></textarea>
      </div>
      <div class="form__meta">
        <p class="form__error" id="nachricht-error">${icon('alert')}Bitte schreiben Sie uns kurz Ihr Anliegen.</p>
        <span class="form__count" id="nachricht-count" data-count-for="nachricht">0 / 500</span>
      </div>
    </div>

    <input type="hidden" name="token" value="">
    <div class="form__honeypot" aria-hidden="true">
      <label for="website">Website</label>
      <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>

    <div class="form__footer">
      <p class="form__hint">
        ${icon('lock')}
        <span>Ihre Angaben werden verschlüsselt übertragen und nur zur Bearbeitung Ihrer Anfrage verwendet.
        Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.</span>
      </p>
      <button class="button button--primary form__submit" type="submit">
        <span class="form__submit-label">Anfrage senden</span>${icon('send')}
      </button>
    </div>
  </form>
`;
