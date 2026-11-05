import { html } from './html.js';

/**
 * Renders a value or, if it is still missing, a highlighted placeholder.
 * The build reports every remaining placeholder, so nothing ships unnoticed.
 */
export const field = (value, label) =>
  value ? value : html`<span class="placeholder">[${label}]</span>`;

/** Converts a German phone number like "0511-123456" into an E.164 tel: link. */
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '').replace(/^0/, '+49')}`;

export const mailHref = (email) => `mailto:${email}`;
