import { html } from '../lib/html.js';
import { site } from '../data/site.js';

export const logo = () => html`
  <a class="logo" href="/" aria-label="${site.name} – Startseite">
    <img src="/assets/img/logo.png" alt="${site.name}" width="480" height="241">
  </a>
`;
