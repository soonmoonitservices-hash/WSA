import { raw } from '../lib/html.js';

/**
 * Structured data for search engines. Not executable, so the strict CSP
 * (script-src 'self') does not apply. "<" is escaped so no value can close the tag.
 */
export const jsonLd = (data) =>
  raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
