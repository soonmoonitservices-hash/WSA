import { html } from '../lib/html.js';
import { icon } from './icons.js';

/**
 * Accordion gallery: the active panel expands, the others stay narrow,
 * grey and slightly tilted. Behaviour in src/scripts/gallery.js; without
 * JavaScript it is a static row of linked images.
 *
 * @param {{ items: { image: string, label: string, text: string, href: string, width: number, height: number }[],
 *           defaultIndex?: number, label: string }} props
 */
export const gallery = ({ items, defaultIndex = 0, label }) => html`
  <ul class="gallery" data-gallery aria-label="${label}">
    ${items.map(
      (item, i) => html`
        <li class="gallery__panel ${i === defaultIndex ? 'is-active' : ''}">
          <a class="gallery__link" href="${item.href}">
            <span class="gallery__media">
              <img src="${item.image}" alt="" width="${item.width}" height="${item.height}" loading="lazy" decoding="async">
            </span>
            <span class="gallery__overlay" aria-hidden="true"></span>
            <span class="gallery__label">
              <span class="gallery__bar" aria-hidden="true"></span>
              <span class="gallery__text">
                <strong class="gallery__title">${item.label}</strong>
                <span class="gallery__desc">${item.text}</span>
                <span class="gallery__more">Mehr erfahren ${icon('arrowRight')}</span>
              </span>
            </span>
          </a>
        </li>
      `,
    )}
  </ul>
`;
