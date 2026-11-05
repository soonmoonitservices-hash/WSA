import { html } from '../lib/html.js';
import { legalNavigation, navigation, site } from '../data/site.js';
import { services } from '../data/services.js';
import { address, emailLink, phoneLink } from './contact-details.js';
import { logo } from './logo.js';

const linkList = (items) => html`
  <ul class="footer-links">
    ${items.map(({ href, label }) => html`<li><a href="${href}">${label}</a></li>`)}
  </ul>
`;

export const footer = () => html`
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        ${logo()}
        <p class="site-footer__claim">${site.claim}</p>
      </div>

      <nav aria-label="Unternehmen">
        <h2 class="site-footer__title">Unternehmen</h2>
        ${linkList(navigation.filter(({ href }) => href !== '/'))}
      </nav>

      <nav aria-label="Leistungen">
        <h2 class="site-footer__title">Leistungen</h2>
        ${linkList(services.slice(0, 5).map(({ slug, title }) => ({ href: `/leistungen/#${slug}`, label: title })))}
      </nav>

      <div>
        <h2 class="site-footer__title">Kontakt</h2>
        ${address()}
        <p class="site-footer__contact">${phoneLink()}<br>${emailLink()}</p>
      </div>
    </div>

    <div class="site-footer__bottom">
      <div class="container site-footer__bottom-inner">
        <p>© ${new Date().getFullYear()} ${site.name}</p>
        <nav aria-label="Rechtliches">${linkList(legalNavigation)}</nav>
      </div>
    </div>
  </footer>
`;
