import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { services } from '../data/services.js';
import { icon } from '../components/icons.js';
import { ctaBand, pageHero } from '../components/sections.js';

const serviceItem = ({ slug, icon: iconName, title, text }) => html`
  <li class="service" id="${slug}">
    <span class="service__icon">${icon(iconName)}</span>
    <div>
      <h2 class="service__title">${title}</h2>
      <p>${text}</p>
    </div>
  </li>
`;

export default {
  path: '/leistungen/',
  title: 'Leistungen',
  description: `Die Sicherheitsdienstleistungen der ${site.name}: ${services.map((s) => s.title).join(', ')}.`,
  render: () => html`
    ${pageHero({
      eyebrow: 'Leistungen',
      title: 'Sie haben sich spezialisiert? Wir auch. Auf Sie!',
      lead: 'Sicherheit ohne Seriosität ist nicht denkbar. Deshalb zählt für uns nicht nur, was wir tun, sondern auch, wie wir es tun.',
    })}
    <section class="section">
      <div class="container">
        <ul class="service-list">${services.map(serviceItem)}</ul>
      </div>
    </section>
    ${ctaBand()}
  `,
};
