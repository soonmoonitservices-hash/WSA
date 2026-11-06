import { html } from '../lib/html.js';
import { field, telHref } from '../lib/format.js';
import { site } from '../data/site.js';
import { icon } from './icons.js';

const { emergency } = site;

export const showEmergency = emergency.enabled;

export const emergencyLink = () =>
  emergency.phone
    ? html`<a href="${telHref(emergency.phone)}">${emergency.phone}</a>`
    : field('', 'Notrufnummer');

/** Slim bar above the header, on every page. */
export const topbar = () =>
  showEmergency
    ? html`
        <div class="topbar">
          <div class="container topbar__inner">
            <p class="topbar__note"><span class="live-dot"></span>Rund um die Uhr für Sie erreichbar</p>
            <p class="topbar__hotline">${icon('phone')}<span>24h-Notruf:</span> ${emergencyLink()}</p>
          </div>
        </div>
      `
    : '';

/** Highlighted line, e.g. in the home hero. */
export const hotline = (className = 'hotline') =>
  showEmergency
    ? html`<p class="${className}">${icon('phone')}<span>24h-Notruf</span> ${emergencyLink()}</p>`
    : '';

/** Box for the contact page. */
export const emergencyPanel = () =>
  showEmergency
    ? html`
        <div class="emergency-panel">
          <p class="emergency-panel__title"><span class="live-dot"></span>24h-Notruf</p>
          <p class="emergency-panel__number">${emergencyLink()}</p>
          <p class="emergency-panel__text">Bei Alarm, Einbruch oder kurzfristigem Personalbedarf – rund um die Uhr, auch an Wochenenden und Feiertagen.</p>
        </div>
      `
    : '';
