import { html } from '../lib/html.js';
import { field } from '../lib/format.js';
import { site } from '../data/site.js';
import { address, emailLink, phoneLink } from '../components/contact-details.js';
import { pageHero } from '../components/sections.js';

const { legal } = site;

const legalPage = ({ path, title, body }) => ({
  path,
  title,
  description: `${title} der ${site.name}.`,
  render: () => html`
    ${pageHero({ title })}
    <section class="section">
      <div class="container"><div class="prose prose--legal">${body()}</div></div>
    </section>
  `,
});

export const imprint = legalPage({
  path: '/impressum/',
  title: 'Impressum',
  body: () => html`
    <h2>Angaben gemäß § 5 DDG</h2>
    ${address()}

    <h2>Vertreten durch</h2>
    <p>Geschäftsführung: ${field(legal.managingDirectors, 'Geschäftsführer')}</p>

    <h2>Kontakt</h2>
    <p>Telefon: ${phoneLink()}<br>E-Mail: ${emailLink()}</p>

    <h2>Registereintrag</h2>
    <p>Registergericht: ${field(legal.registerCourt, 'Amtsgericht')}<br>
      Registernummer: ${field(legal.registerNumber, 'HRB')}</p>

    <h2>Umsatzsteuer-ID</h2>
    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ${field(legal.vatId, 'USt-IdNr.')}</p>

    <h2>Erlaubnis nach § 34a GewO</h2>
    <p>Zuständige Aufsichtsbehörde: ${field(legal.permitAuthority, 'Behörde')}</p>

    <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
    <p>${field(legal.contentResponsible, 'Name, Anschrift')}</p>

    <h2>Bildnachweis</h2>
    <p>Fotos: StockSnap.io und Wikimedia Commons (CC0, gemeinfrei). Hintergrundvideo: Mixkit (Mixkit Stock Video Free License).</p>
  `,
});

const pending = (label) => html`<p>${field('', label)}</p>`;

export const privacy = legalPage({
  path: '/datenschutz/',
  title: 'Datenschutz',
  body: () => html`
    <h2>1. Verantwortliche Stelle</h2>
    ${address()}
    <p>Telefon: ${phoneLink()}<br>E-Mail: ${emailLink()}</p>

    <h2>2. Hosting und Server-Logfiles</h2>
    ${pending('Text folgt')}

    <h2>3. Kontaktformular und Anfragen per E-Mail</h2>
    ${pending('Text folgt')}

    <h2>4. Ihre Rechte</h2>
    ${pending('Text folgt')}

    <p class="note">Diese Website verwendet keine Cookies, kein Tracking und lädt keine Inhalte von Drittanbietern. Ihre Auswahl im Datenschutz-Hinweis wird nur für die Dauer der Sitzung im Browser (sessionStorage) gespeichert und beim Schließen des Tabs gelöscht.</p>
  `,
});
