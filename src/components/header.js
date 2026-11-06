import { html } from '../lib/html.js';
import { navigation, site } from '../data/site.js';
import { servicePath, services } from '../data/services.js';
import { icon } from './icons.js';
import { logo } from './logo.js';
import { topbar } from './emergency.js';

const isActive = (href, currentPath) =>
  href === '/' ? currentPath === '/' : currentPath.startsWith(href);

/** Inhalte der Untermenüs (Schlüssel aus navigation[].submenu). */
const SUBMENUS = {
  services: () => services.map((service) => ({ href: servicePath(service), label: service.title, icon: service.icon })),
};

const navLink = ({ href, label }, currentPath) => html`
  <li>
    <a class="nav__link" href="${href}" ${isActive(href, currentPath) ? html`aria-current="page"` : ''}>${label}</a>
  </li>
`;

/** Menüpunkt ohne eigenen Link: Der Button öffnet nur das Untermenü. */
const navDropdown = ({ href, label, submenu }, currentPath) => {
  const id = `submenu-${submenu}`;
  return html`
    <li class="nav__dropdown">
      <button class="nav__link nav__dropdown-toggle" type="button" aria-expanded="false" aria-controls="${id}"
        ${isActive(href, currentPath) ? html`data-current` : ''}>
        ${label}${icon('chevronDown', 'icon nav__chevron')}
      </button>
      <ul class="nav__submenu" id="${id}">
        ${SUBMENUS[submenu]().map(
          (item) => html`
            <li>
              <a class="nav__sublink" href="${item.href}" ${currentPath === item.href ? html`aria-current="page"` : ''}>
                <span class="nav__subicon">${icon(item.icon)}</span>${item.label}
              </a>
            </li>
          `,
        )}
      </ul>
    </li>
  `;
};

export const header = (currentPath) => html`
  <header class="site-header">
    ${topbar()}
    <div class="container site-header__inner">
      ${logo()}
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
        ${icon('menu', 'icon nav-toggle__open')}
        ${icon('close', 'icon nav-toggle__close')}
        <span class="visually-hidden">Menü</span>
      </button>
      <nav class="nav" id="main-nav" aria-label="Hauptnavigation">
        <ul class="nav__list">
          ${navigation.map((item) => (item.submenu ? navDropdown(item, currentPath) : navLink(item, currentPath)))}
          ${site.loginUrl
            ? html`<li class="nav__login"><a class="nav__link nav__link--login" href="${site.loginUrl}" rel="noopener">${icon('lock')}Login</a></li>`
            : ''}
        </ul>
      </nav>
    </div>
  </header>
`;
