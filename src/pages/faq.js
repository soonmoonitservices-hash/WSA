import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { faqGroups } from '../data/faq.js';
import { icon } from '../components/icons.js';
import { jsonLd } from '../components/json-ld.js';
import { ctaBand, pageHero } from '../components/sections.js';

const allItems = faqGroups.flatMap((group) => group.items);

const faqItem = ({ question, answer, link }) => html`
  <details class="faq__item">
    <summary class="faq__question">${question}<span class="faq__toggle" aria-hidden="true"></span></summary>
    <div class="faq__answer">
      <p>${answer}</p>
      ${link ? html`<a class="faq__link" href="${link.href}">${link.label}${icon('arrowRight')}</a>` : ''}
    </div>
  </details>
`;

const structuredData = () =>
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  });

export default {
  path: '/faq/',
  title: 'Häufige Fragen',
  structuredData,
  description: `Antworten auf häufige Fragen zu Leistungen, Ablauf, Kosten und Jobs bei der ${site.name}.`,
  render: () => html`
    ${pageHero({
      eyebrow: 'FAQ',
      title: 'Häufige Fragen',
      lead: 'Hier finden Sie Antworten auf die Fragen, die uns am häufigsten gestellt werden. Ihre ist nicht dabei? Rufen Sie uns an oder schreiben Sie uns.',
    })}
    <section class="section">
      <div class="container faq">
        ${faqGroups.map(
          ({ title, items }) => html`
            <div class="faq__group">
              <h2 class="faq__group-title">${title}</h2>
              <div class="faq__list">${items.map(faqItem)}</div>
            </div>
          `,
        )}
      </div>
    </section>
    ${ctaBand()}
  `,
};
