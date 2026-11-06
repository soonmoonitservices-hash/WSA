import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { servicePath, services } from '../data/services.js';
import { icon } from '../components/icons.js';
import { hotline } from '../components/emergency.js';
import { jsonLd } from '../components/json-ld.js';
import { button, ctaBand, pageHero, sectionHeading, serviceCard } from '../components/sections.js';

// ---- Übersicht /leistungen/ ------------------------------------------------
const serviceItem = (service) => html`
  <li class="service" id="${service.slug}">
    <a class="service__link" href="${servicePath(service)}">
      <span class="service__icon">${icon(service.icon)}</span>
      <span class="service__body">
        <h2 class="service__title">${service.title}</h2>
        <p>${service.text}</p>
        <span class="service__more">Mehr erfahren ${icon('arrowRight')}</span>
      </span>
    </a>
  </li>
`;

export const servicesOverview = {
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

// ---- Einzelseite /leistungen/<slug>/ ----------------------------------------
const photo = ({ src, alt, width, height }) => html`
  <figure class="media-split__image">
    <img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async">
  </figure>
`;

const checklist = (items) => html`
  <ul class="checklist">${items.map((item) => html`<li>${icon('check')}${item}</li>`)}</ul>
`;

/** Drei andere Leistungen, beginnend nach der aktuellen – so wechselt die Auswahl je Seite. */
const otherServices = (service) => {
  const index = services.indexOf(service);
  return [1, 2, 3].map((offset) => services[(index + offset) % services.length]);
};

const structuredData = (service) => () =>
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.lead,
    serviceType: service.title,
    areaServed: 'Region Hannover, Niedersachsen',
    provider: { '@type': 'Organization', name: site.name, ...(site.url && { url: site.url }) },
  });

const servicePage = (service) => {
  const [first, second] = service.images;

  return {
    path: servicePath(service),
    title: service.title,
    description: service.lead,
    structuredData: structuredData(service),
    render: () => html`
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow"><a class="back-link" href="/leistungen/">Leistungen</a> · ${service.title}</p>
          <h1 class="page-hero__title">${service.title}</h1>
          <p class="page-hero__lead">${service.lead}</p>
          <div class="page-hero__actions">
            ${button({ href: '/kontakt/', label: 'Unverbindlich anfragen', variant: 'primary', withIcon: true })}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container media-split">
          ${photo(first)}
          <div class="prose">
            ${service.intro.map((paragraph) => html`<p>${paragraph}</p>`)}
            <h2 class="service-detail__subtitle">Typische Einsätze</h2>
            <ul class="tag-list">${service.places.map((place) => html`<li>${place}</li>`)}</ul>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container media-split media-split--reverse">
          ${photo(second)}
          <div>
            <h2>Das übernehmen wir</h2>
            ${checklist(service.tasks)}
            ${service.note
              ? html`<div class="note-box"><p class="note-box__title">${icon('shieldCheck')}Gut zu wissen</p><p>${service.note}</p></div>`
              : ''}
            ${hotline()}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHeading({ eyebrow: 'Weitere Leistungen', title: 'Das könnte Sie auch interessieren.' })}
          <ul class="card-grid">${otherServices(service).map(serviceCard)}</ul>
        </div>
      </section>

      ${ctaBand()}
    `,
  };
};

export const servicePages = services.map(servicePage);
