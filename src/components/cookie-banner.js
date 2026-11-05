import { html } from '../lib/html.js';
import { site } from '../data/site.js';

/** Rendered hidden; src/scripts/cookie-banner.js decides when to show it. */
export const cookieBanner = () => {
  const { enabled, rememberChoice } = site.cookieBanner;
  if (!enabled) return '';

  return html`
    <section class="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text"
      data-remember="${String(rememberChoice)}" hidden>
      <div class="cookie-banner__body">
        <h2 class="cookie-banner__title" id="cookie-title">Cookies &amp; Datenschutz</h2>
        <p class="cookie-banner__text" id="cookie-text">
          Wir verwenden ausschließlich technisch notwendige Funktionen – kein Tracking, keine Werbung.
          Mehr dazu in unserer <a href="/datenschutz/">Datenschutzerklärung</a>.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <button class="button button--outline" type="button" data-consent="necessary">Nur notwendige</button>
        <button class="button button--primary" type="button" data-consent="all">Akzeptieren</button>
      </div>
    </section>
  `;
};
