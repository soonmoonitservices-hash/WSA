import { html } from '../lib/html.js';
import { telHref } from '../lib/format.js';
import { site } from '../data/site.js';
import { icon } from './icons.js';

/** Fixed quick-contact bar on phones. Hidden on the contact pages themselves. */
export const showMobileCta = (path) => !path.startsWith('/kontakt/');

export const mobileCta = (path) => {
  if (!showMobileCta(path)) return '';
  const { phone } = site.contact;

  return html`
    <nav class="mobile-cta" aria-label="Schnellkontakt">
      ${phone
        ? html`<a class="mobile-cta__btn" href="${telHref(phone)}">${icon('phone')}Anrufen</a>`
        : ''}
      <a class="mobile-cta__btn mobile-cta__btn--primary" href="/kontakt/">${icon('mail')}Anfrage stellen</a>
    </nav>
  `;
};
