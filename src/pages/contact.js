import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { contactDetails } from '../components/contact-details.js';
import { contactForm } from '../components/contact-form.js';
import { emergencyPanel } from '../components/emergency.js';
import { pageHero } from '../components/sections.js';

export default {
  path: '/kontakt/',
  title: 'Kontakt',
  description: `Kontakt zur ${site.name}: Anfrage für Sicherheitsdienstleistungen stellen.`,
  render: () => html`
    ${pageHero({
      eyebrow: 'Kontakt',
      title: 'Kontaktieren Sie uns heute für mehr Sicherheit',
      lead: 'Sie interessieren sich für unsere Sicherheitsdienstleistungen oder haben spezielle Fragen? Füllen Sie einfach das Formular aus – eines unserer Teammitglieder wird sich so schnell wie möglich mit Ihnen in Verbindung setzen.',
    })}
    <section class="section">
      <div class="container contact-layout">
        ${contactForm()}
        <aside class="contact-aside" aria-label="Kontaktdaten">
          ${emergencyPanel()}
          ${contactDetails()}
          <p class="contact-aside__faq">Fragen zu Ablauf oder Kosten? <a href="/faq/">Häufige Fragen</a></p>
        </aside>
      </div>
    </section>
  `,
};
