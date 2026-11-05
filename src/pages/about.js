import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { icon } from '../components/icons.js';
import { ctaBand, pageHero, statement } from '../components/sections.js';

const values = ['Vertrauen', 'Innovation', 'Engagement'];

export default {
  path: '/ueber-uns/',
  title: 'Über uns',
  description: `${site.name}: ein junges Team mit langjähriger Erfahrung in der Sicherheitsbranche.`,
  render: () => html`
    ${pageHero({ eyebrow: 'Über uns', title: 'Jung, aber keineswegs unerfahren.' })}
    <section class="section">
      <div class="container split">
        <div class="prose prose--lead">
          <p>Die ${site.name} wurde mit dem festen Ziel gegründet, Sicherheit in Niedersachsen auf höchstem Niveau zu leisten. Wir sind ein junges Unternehmen, aber keineswegs unerfahren.</p>
        </div>
        <div class="prose">
          <p>Jedes Mitglied unseres Teams bringt umfangreiche Fachkenntnisse und langjährige Erfahrung in der Sicherheitsbranche mit. Diese Kombination aus frischer Perspektive und bewährtem Know-how ermöglicht es uns, innovative und zuverlässige Sicherheitsdienstleistungen anzubieten, die speziell auf die Bedürfnisse unserer Kunden zugeschnitten sind.</p>
          <p>Tag für Tag schreiben wir unsere eigene Geschichte – eine Geschichte des Vertrauens, der Innovation und des überdurchschnittlichen Engagements für die Sicherheit unserer Kunden.</p>
          <ul class="values">
            ${values.map((value) => html`<li>${icon('check')}${value}</li>`)}
          </ul>
        </div>
      </div>
    </section>
    ${statement(`„${site.motto}“`)}
    ${ctaBand()}
  `,
};
