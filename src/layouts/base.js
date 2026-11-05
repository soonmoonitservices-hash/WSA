import { html } from '../lib/html.js';
import { site } from '../data/site.js';
import { cookieBanner } from '../components/cookie-banner.js';
import { footer } from '../components/footer.js';
import { header } from '../components/header.js';

const fullTitle = (title) => (title ? `${title} | ${site.name}` : `${site.name} – ${site.claim}`);

/**
 * @param {{ page: { path: string, title?: string, description: string, noindex?: boolean },
 *           content: unknown, assets: { css: string, js: string } }} props
 */
export const layout = ({ page, content, assets }) => {
  const canonical = site.url ? site.url + page.path : '';
  const title = fullTitle(page.title);

  return html`<!doctype html>
<html lang="${site.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${page.description}">
  ${page.noindex ? html`<meta name="robots" content="noindex">` : ''}
  ${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${page.description}">
  ${canonical ? html`<meta property="og:url" content="${canonical}">` : ''}
  <meta name="theme-color" content="#082f7b">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${assets.css}">
  <noscript><link rel="stylesheet" href="/assets/css/no-js.css"></noscript>
  <script src="${assets.js}" type="module"></script>
</head>
<body>
  <a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
  ${header(page.path)}
  <main id="inhalt">
    ${content}
  </main>
  ${footer()}
  ${cookieBanner()}
</body>
</html>
`;
};
