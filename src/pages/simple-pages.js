import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { button, pageHero } from '../components/sections.js';

export const thanks = {
  path: '/kontakt/danke/',
  title: 'Vielen Dank',
  description: 'Ihre Nachricht wurde gesendet.',
  noindex: true,
  render: () => html`
    ${pageHero({
      eyebrow: 'Kontakt',
      title: 'Vielen Dank für Ihre Nachricht.',
      lead: 'Eines unserer Teammitglieder wird sich so schnell wie möglich mit Ihnen in Verbindung setzen.',
    })}
    <section class="section">
      <div class="container">${button({ href: '/', label: 'Zur Startseite', withIcon: true })}</div>
    </section>
  `,
};

export const notFound = {
  path: '/404.html',
  title: 'Seite nicht gefunden',
  description: `Diese Seite existiert nicht. Zur Startseite der ${site.name}.`,
  noindex: true,
  render: () => html`
    ${pageHero({
      eyebrow: 'Fehler 404',
      title: 'Diese Seite gibt es nicht.',
      lead: 'Vielleicht wurde sie verschoben oder die Adresse ist falsch geschrieben.',
    })}
    <section class="section">
      <div class="container">${button({ href: '/', label: 'Zur Startseite', withIcon: true })}</div>
    </section>
  `,
};
