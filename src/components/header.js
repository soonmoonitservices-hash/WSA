import { html } from '../lib/html.js';
import { navigation, site } from '../data/site.js';
import { icon } from './icons.js';
import { logo } from './logo.js';
import { topbar } from './emergency.js';

const isActive = (href, currentPath) =>
  href === '/' ? currentPath === '/' : currentPath.startsWith(href);

const navLink = ({ href, label }, currentPath) => html`
  <li>
    <a class="nav__link" href="${href}" ${isActive(href, currentPath) ? html`aria-current="page"` : ''}>${label}</a>
  </li>
`;

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
          ${navigation.map((item) => navLink(item, currentPath))}
          ${site.loginUrl
            ? html`<li><a class="nav__link" href="${site.loginUrl}" rel="noopener">Login</a></li>`
            : ''}
        </ul>
      </nav>
    </div>
  </header>
`;
