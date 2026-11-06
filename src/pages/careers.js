import { html } from '../lib/html.js';
import { mailHref } from '../lib/format.js';
import { site } from '../data/site.js';
import { benefits, jobs, requirements } from '../data/jobs.js';
import { icon } from '../components/icons.js';
import { emailLink } from '../components/contact-details.js';
import { jsonLd } from '../components/json-ld.js';
import { button, pageHero, sectionHeading } from '../components/sections.js';

const jobPath = (job) => `/karriere/${job.slug}/`;
const { contact } = site;

/** Pre-filled e-mail; without an address the button leads to the contact page. */
const applyHref = (job) =>
  contact.email ? `${mailHref(contact.email)}?subject=${encodeURIComponent(`Bewerbung: ${job.title}`)}` : '/kontakt/';

const jobMeta = (job) => html`
  <ul class="job-meta">
    <li>${icon('pin')}${contact.city || 'Region Hannover'}</li>
    <li>${icon('clock')}${job.employmentTypes.join(' · ')}</li>
  </ul>
`;

/**
 * Stellenkarte zum Umdrehen (src/scripts/flip-card.js).
 * Vorne: Eckdaten der Stelle. Hinten: Aufgaben, Profil und Bewerben.
 * Ohne JavaScript bleibt die Vorderseite mit dem Link zur Stelle sichtbar.
 */
const jobCard = (job) => html`
  <li class="flip-card" data-flip-card>
    <div class="flip-card__rotor">
      <article class="flip-card__face flip-card__face--front">
        <div class="flip-card__top">
          <span class="flip-card__icon">${icon(job.icon)}</span>
          <span class="flip-card__badge">Jetzt bewerben</span>
        </div>
        <h3 class="flip-card__title">${job.title}</h3>
        <ul class="flip-card__tags">
          ${job.employmentTypes.map((type) => html`<li>${type}</li>`)}
        </ul>
        <p class="flip-card__text">${job.summary}</p>
        <ul class="flip-card__facts">
          <li>${icon('pin')}${contact.city || 'Region Hannover'}</li>
          <li>${icon('badge')}Unterrichtung nach § 34a GewO</li>
        </ul>
        <div class="flip-card__actions">
          <a class="flip-card__link" href="${jobPath(job)}">Zur Stelle ${icon('arrowRight')}</a>
          <button class="flip-card__turn" type="button" data-flip-toggle hidden>${icon('rotate')}Details</button>
        </div>
        <span class="flip-card__glare" aria-hidden="true"></span>
      </article>
      <div class="flip-card__face flip-card__face--back" aria-hidden="true" inert>
        <p class="flip-card__eyebrow">${job.title}</p>
        <h4 class="flip-card__subtitle">Ihre Aufgaben</h4>
        <ul class="flip-card__list">${job.tasks.slice(0, 4).map((item) => html`<li>${icon('check')}${item}</li>`)}</ul>
        <h4 class="flip-card__subtitle">Das bringen Sie mit</h4>
        <ul class="flip-card__list">${job.profile.slice(0, 3).map((item) => html`<li>${icon('check')}${item}</li>`)}</ul>
        <div class="flip-card__actions">
          <a class="button button--primary flip-card__apply" href="${applyHref(job)}">Jetzt bewerben ${icon('arrowRight')}</a>
          <a class="flip-card__link" href="${jobPath(job)}">Alle Details</a>
          <button class="flip-card__turn" type="button" data-flip-toggle aria-label="Karte zurückdrehen">${icon('rotate')}</button>
        </div>
        <span class="flip-card__glare" aria-hidden="true"></span>
      </div>
    </div>
  </li>
`;

const checklist = (items) => html`
  <ul class="checklist">${items.map((item) => html`<li>${icon('check')}${item}</li>`)}</ul>
`;

const applyPanel = (job) => html`
  <div class="panel">
    <h2>So bewerben Sie sich</h2>
    <p>Senden Sie uns Ihren Lebenslauf und Ihre Nachweise (z. B. § 34a GewO) per E-Mail an:</p>
    <p class="panel__highlight">${emailLink()}</p>
    <p>Wir melden uns so schnell wie möglich bei Ihnen.</p>
    ${job ? button({ href: applyHref(job), label: 'Jetzt bewerben', variant: 'primary', withIcon: true }) : ''}
  </div>
`;

export const careers = {
  path: '/karriere/',
  title: 'Karriere',
  description: `Jobs im Sicherheitsdienst bei der ${site.name}: ${jobs.map((job) => job.title).join(', ')}.`,
  render: () => html`
    ${pageHero({
      eyebrow: 'Karriere',
      title: 'Werden Sie Teil unseres Teams.',
      lead: 'Wir suchen zuverlässige Sicherheitskräfte (m/w/d), die unseren Anspruch an Qualität teilen.',
    })}
    <section class="section">
      <div class="container">
        ${sectionHeading({ eyebrow: 'Stellenangebote', title: 'Offene Stellen', intro: 'Finden Sie die Stelle, die zu Ihnen passt.' })}
        <ul class="flip-grid">${jobs.map(jobCard)}</ul>
      </div>
    </section>
    <section class="section">
      <div class="container split">
        <div>
          <h2>Was Sie mitbringen</h2>
          ${checklist(requirements)}
        </div>
        <div>
          <h2>Was wir bieten</h2>
          ${checklist(benefits)}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">${applyPanel()}</div>
    </section>
  `,
};

/** schema.org JobPosting – only with a full address, otherwise Google rejects it. */
const jobStructuredData = (job) => () =>
  contact.city && contact.street
    ? jsonLd({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: [job.summary, ...job.tasks, ...job.profile].join(' '),
        datePosted: job.datePosted,
        employmentType: job.employmentTypes.map(
          (type) => ({ Vollzeit: 'FULL_TIME', Teilzeit: 'PART_TIME', Minijob: 'PART_TIME' })[type],
        ),
        hiringOrganization: { '@type': 'Organization', name: site.name, ...(site.url && { sameAs: site.url }) },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: contact.street,
            postalCode: contact.zip,
            addressLocality: contact.city,
            addressCountry: 'DE',
          },
        },
      })
    : '';

const jobPage = (job) => ({
  path: jobPath(job),
  title: job.title,
  description: `${job.title} bei der ${site.name}: ${job.summary}`,
  structuredData: jobStructuredData(job),
  render: () => html`
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow"><a class="back-link" href="/karriere/">Karriere</a> · Stellenangebot</p>
        <h1 class="page-hero__title">${job.title}</h1>
        <p class="page-hero__lead">${job.summary}</p>
        ${jobMeta(job)}
        <div class="page-hero__actions">
          ${button({ href: applyHref(job), label: 'Jetzt bewerben', variant: 'primary', withIcon: true })}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container split split--even">
        <div>
          <h2>Ihre Aufgaben</h2>
          ${checklist(job.tasks)}
        </div>
        <div>
          <h2>Ihr Profil</h2>
          ${checklist(job.profile)}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container split split--even">
        <div>
          <h2>Was wir bieten</h2>
          ${checklist(benefits)}
        </div>
        ${applyPanel(job)}
      </div>
    </section>
  `,
});

export const jobPages = jobs.map(jobPage);
