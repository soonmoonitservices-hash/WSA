import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { icon } from '../components/icons.js';
import { emailLink } from '../components/contact-details.js';
import { pageHero } from '../components/sections.js';

const requirements = [
  'Unterrichtung oder Sachkundeprüfung nach § 34a GewO',
  'Einwandfreies Führungszeugnis',
  'Gute Deutschkenntnisse in Wort und Schrift',
  'Zuverlässigkeit und ein gepflegtes Auftreten',
];

export default {
  path: '/karriere/',
  title: 'Karriere',
  description: `Jobs im Sicherheitsdienst bei der ${site.name}. Jetzt bewerben.`,
  render: () => html`
    ${pageHero({
      eyebrow: 'Karriere',
      title: 'Werden Sie Teil unseres Teams.',
      lead: 'Wir suchen zuverlässige Sicherheitskräfte (m/w/d), die unseren Anspruch an Qualität teilen.',
    })}
    <section class="section">
      <div class="container split">
        <div>
          <h2>Was Sie mitbringen</h2>
          <ul class="checklist">
            ${requirements.map((item) => html`<li>${icon('check')}${item}</li>`)}
          </ul>
        </div>
        <div class="panel">
          <h2>So bewerben Sie sich</h2>
          <p>Senden Sie uns Ihren Lebenslauf und Ihre Nachweise per E-Mail an:</p>
          <p class="panel__highlight">${emailLink()}</p>
          <p>Wir melden uns so schnell wie möglich bei Ihnen.</p>
        </div>
      </div>
    </section>
  `,
};
