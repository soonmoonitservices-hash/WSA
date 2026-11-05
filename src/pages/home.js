import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { services } from '../data/services.js';
import { icon } from '../components/icons.js';
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

const aboutTeaser = () => html`
  <section class="section">
    <div class="container split">
      <div>
        <p class="eyebrow">Über uns</p>
        <h2>Jung, aber keineswegs unerfahren.</h2>
      </div>
      <div class="prose">
        <p>Jedes Mitglied unseres Teams bringt umfangreiche Fachkenntnisse und langjährige Erfahrung in der Sicherheitsbranche mit.</p>
        ${button({ href: '/ueber-uns/', label: 'Mehr über uns', variant: 'text', withIcon: true })}
      </div>
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
    ${aboutTeaser()}
    ${ctaBand()}
  `,
};
