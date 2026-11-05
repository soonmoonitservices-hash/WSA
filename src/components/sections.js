import { html } from '../lib/html.js';
import { icon } from './icons.js';

export const button = ({ href, label, variant = 'primary', withIcon = false }) => html`
  <a class="button button--${variant}" href="${href}">
    ${label}${withIcon ? icon('arrowRight') : ''}
  </a>
`;

/** Compact hero for sub-pages. */
export const pageHero = ({ eyebrow, title, lead }) => html`
  <section class="page-hero">
    <div class="container">
      ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
      <h1 class="page-hero__title">${title}</h1>
      ${lead ? html`<p class="page-hero__lead">${lead}</p>` : ''}
    </div>
  </section>
`;

export const sectionHeading = ({ eyebrow, title, intro, id }) => html`
  <header class="section-heading">
    ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
    <h2 ${id ? html`id="${id}"` : ''}>${title}</h2>
    ${intro ? html`<p class="section-heading__intro">${intro}</p>` : ''}
  </header>
`;

export const serviceCard = ({ slug, icon: iconName, title, text }) => html`
  <li class="card">
    <a class="card__link" href="/leistungen/#${slug}">
      <span class="card__icon">${icon(iconName)}</span>
      <h3 class="card__title">${title}</h3>
      <p class="card__text">${text}</p>
    </a>
  </li>
`;

export const statement = (text) => html`
  <section class="statement" aria-label="Leitsatz">
    <div class="container"><p class="statement__text">${text}</p></div>
  </section>
`;

export const ctaBand = () => html`
  <section class="cta">
    <div class="container cta__inner">
      <div>
        <h2 class="cta__title">Kontaktieren Sie uns heute für mehr Sicherheit</h2>
        <p class="cta__text">Sie interessieren sich für unsere Sicherheitsdienstleistungen oder haben spezielle Fragen? Zögern Sie nicht, uns zu kontaktieren.</p>
      </div>
      ${button({ href: '/kontakt/', label: 'Kontakt aufnehmen', variant: 'primary', withIcon: true })}
    </div>
  </section>
`;
