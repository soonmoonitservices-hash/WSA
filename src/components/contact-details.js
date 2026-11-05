import { html } from '../lib/html.js';
import { field, mailHref, telHref } from '../lib/format.js';
import { site } from '../data/site.js';
import { icon } from './icons.js';

const { contact } = site;

export const address = () => html`
  <address class="address">
    ${site.name}<br>
    ${field(contact.street, 'Straße Nr.')}<br>
    ${field(contact.zip, 'PLZ')} ${field(contact.city, 'Ort')}
  </address>
`;

export const phoneLink = () =>
  contact.phone ? html`<a href="${telHref(contact.phone)}">${contact.phone}</a>` : field('', 'Telefon');

export const emailLink = () =>
  contact.email ? html`<a href="${mailHref(contact.email)}">${contact.email}</a>` : field('', 'E-Mail');

export const contactDetails = () => html`
  <ul class="contact-list">
    <li>
      ${icon('pin')}
      <div><h3 class="contact-list__title">Büro</h3>${address()}</div>
    </li>
    ${site.openingHours.length
      ? html`
          <li>
            ${icon('clock')}
            <div>
              <h3 class="contact-list__title">Öffnungszeiten</h3>
              <dl class="hours">
                ${site.openingHours.map(({ days, time }) => html`<dt>${days}</dt><dd>${time}</dd>`)}
              </dl>
            </div>
          </li>
        `
      : ''}
    <li>
      ${icon('phone')}
      <div><h3 class="contact-list__title">Telefon</h3>${phoneLink()}</div>
    </li>
    <li>
      ${icon('mail')}
      <div><h3 class="contact-list__title">E-Mail</h3>${emailLink()}</div>
    </li>
  </ul>
`;
