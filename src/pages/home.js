import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { services } from '../data/services.js';
import { jobs } from '../data/jobs.js';
import { galleryItems, processSteps, strengths } from '../data/home.js';
import { icon } from '../components/icons.js';
import { hotline } from '../components/emergency.js';
import { gallery } from '../components/gallery.js';
import { button, ctaBand, sectionHeading, serviceCard, statement } from '../components/sections.js';

const typedWords = ['Objektschutz', 'Veranstaltungen', 'Baustellen', 'Empfangsdienst', 'Einzelhandel', 'Alarmüberwachung'];

/** Decorative radar: rings, rotating sweep and pulsing blips – pure CSS. */
const radar = () => html`
  <div class="radar" aria-hidden="true">
    <div class="radar__sweep"></div>
    <span class="radar__blip"></span>
    <span class="radar__blip"></span>
    <span class="radar__blip"></span>
    <span class="radar__blip"></span>
    <div class="radar__core">${icon('shieldCheck')}</div>
  </div>
`;

const hero = () => html`
  <section class="hero">
    <video class="hero__video" muted loop playsinline preload="none" aria-hidden="true"
      poster="/assets/video/hero-poster.jpg"
      data-src-small="/assets/video/hero-360.mp4"
      data-src-large="/assets/video/hero-720.mp4"></video>
    <canvas class="hero__canvas" aria-hidden="true"></canvas>
    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__eyebrow">
          <span class="hero__live"></span>
          Sicherheit für <span class="hero__typed" data-words="${typedWords.join('|')}">${typedWords[0]}</span>
        </p>
        <h1 class="hero__title">Ihre Sicherheit <span>ist unsere Mission.</span></h1>
        <p class="hero__lead">Wir setzen auf moderne Sicherheitsdienstleistungen in der Region Hannover und darüber hinaus.</p>
        <div class="hero__actions">
          ${button({ href: '/leistungen/', label: 'Unsere Leistungen', variant: 'primary', withIcon: true })}
          ${button({ href: '/kontakt/', label: 'Kontakt aufnehmen', variant: 'outline' })}
        </div>
        ${hotline('hotline hero__hotline')}
      </div>
      ${radar()}
    </div>
  </section>
`;

const intro = () => html`
  <section class="section">
    <div class="container split">
      <div>
        <p class="eyebrow">Unser Motto</p>
        <h2>„${site.motto}“</h2>
      </div>
      <div class="prose">
        <p>Dieses Motto treibt uns an, stets über den Standard hinauszugehen und maßgeschneiderte Sicherheitskonzepte zu entwickeln, die genau auf Ihre Bedürfnisse zugeschnitten sind.</p>
        <p>Erleben Sie mit ${site.shortName} ein neues Niveau des Schutzes für alles, was Ihnen wichtig ist.</p>
      </div>
    </div>
  </section>
`;

const servicesPreview = () => html`
  <section class="section">
    <div class="container">
      ${sectionHeading({
        eyebrow: 'Leistungen',
        title: 'Sie haben sich spezialisiert? Wir auch. Auf Sie!',
        intro: 'Sicherheit ohne Seriosität ist nicht denkbar. Deshalb zählt für uns nicht nur, was wir tun, sondern auch, wie wir es tun.',
      })}
      <ul class="card-grid card-grid--swipe">${services.map(serviceCard)}</ul>
      <p class="swipe-hint" aria-hidden="true">Wischen für weitere Leistungen ${icon('arrowRight')}</p>
      <div class="section-actions">
        ${button({ href: '/leistungen/', label: 'Alle Leistungen ansehen', variant: 'primary', withIcon: true })}
      </div>
    </div>
  </section>
`;

const inAction = () => html`
  <section class="section">
    <div class="container">
      ${sectionHeading({
        eyebrow: 'Im Einsatz',
        title: 'Überall dort, wo Sie uns brauchen.',
        intro: 'Vom Firmengelände über das Konzert bis zum Ladengeschäft – wir passen unseren Einsatz an Ihr Umfeld an.',
      })}
      ${gallery({ items: galleryItems, defaultIndex: 1, label: 'Unsere Einsatzbereiche' })}
    </div>
  </section>
`;

const process = () => html`
  <section class="section">
    <div class="container">
      ${sectionHeading({
        eyebrow: 'Ablauf',
        title: 'In vier Schritten zu Ihrem Sicherheitskonzept.',
        intro: 'Klar, persönlich und ohne Umwege – so arbeiten wir mit Ihnen zusammen.',
      })}
      <ol class="steps">
        ${processSteps.map(
          ({ icon: iconName, title, text }, i) => html`
            <li class="step">
              <span class="step__icon">${icon(iconName)}<span class="step__number">${i + 1}</span></span>
              <h3 class="step__title">${title}</h3>
              <p class="step__text">${text}</p>
            </li>
          `,
        )}
      </ol>
    </div>
  </section>
`;

const aroundTheClock = () => html`
  <section class="section">
    <div class="container media-split">
      <figure class="media-split__image">
        <img src="/assets/img/photos/nacht.webp" alt="Beleuchtete Straße bei Nacht" width="960" height="722" loading="lazy" decoding="async">
        <figcaption class="media-split__badge"><span class="live-dot"></span>24/7 im Dienst</figcaption>
      </figure>
      <div>
        <p class="eyebrow">Warum ${site.shortName}</p>
        <h2>Wir sind da, wenn andere schlafen.</h2>
        <p class="prose--lead">Nachtschicht im Objekt, Alarm am Wochenende oder kurzfristiger Personalbedarf – auf uns können Sie sich verlassen.</p>
        <ul class="feature-list">
          ${strengths.map(
            ({ icon: iconName, title, text }) => html`
              <li>
                <span class="feature-list__icon">${icon(iconName)}</span>
                <div><h3 class="feature-list__title">${title}</h3><p>${text}</p></div>
              </li>
            `,
          )}
        </ul>
        ${hotline()}
      </div>
    </div>
  </section>
`;

const careersTeaser = () => html`
  <section class="section">
    <div class="container split">
      <div>
        <p class="eyebrow">Karriere</p>
        <h2>Verstärken Sie unser Team.</h2>
        <p>Wir suchen zuverlässige Sicherheitskräfte (m/w/d) mit Haltung und einem guten Auge für Details.</p>
        ${button({ href: '/karriere/', label: 'Alle Stellen ansehen', variant: 'primary', withIcon: true })}
      </div>
      <ul class="job-links">
        ${jobs.map(
          (job) => html`
            <li>
              <a class="job-links__item" href="/karriere/${job.slug}/">
                <span class="job-links__icon">${icon(job.icon)}</span>
                <span class="job-links__text">
                  <strong>${job.title}</strong>
                  <small>${job.employmentTypes.join(' · ')}</small>
                </span>
                ${icon('arrowRight', 'icon job-links__arrow')}
              </a>
            </li>
          `,
        )}
      </ul>
    </div>
  </section>
`;

export default {
  path: '/',
  title: '',
  description: `${site.name}: Objektschutz, Veranstaltungssicherheit, Baustellenbewachung, Empfangsdienst und mehr in der Region Hannover.`,
  render: () => html`
    ${hero()}
    ${intro()}
    ${statement('Wenn Sicherheit, dann wir.')}
    ${servicesPreview()}
    ${inAction()}
    ${process()}
    ${aroundTheClock()}
    ${careersTeaser()}
    ${ctaBand()}
  `,
};
