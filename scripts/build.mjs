/**
 * Static site build: renders src/pages → dist/, bundles CSS/JS with content
 * hashes (for long-term caching) and writes sitemap.xml + robots.txt.
 * No dependencies – runs on plain Node.js ≥ 20.
 */
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/data/site.js';
import { layout } from '../src/layouts/base.js';
import { pages } from '../src/pages/index.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const hash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 10);

/** Conservative minifier: strips comments and collapses whitespace. */
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':') // nur nach ":" kürzen – davor wäre z. B. ".a :hover" ≠ ".a:hover"
    .replace(/;}/g, '}')
    .trim();

async function writeAsset(dir, name, ext, content) {
  const fileName = `${name}.${hash(content)}.${ext}`;
  await mkdir(join(DIST, dir), { recursive: true });
  await writeFile(join(DIST, dir, fileName), content);
  return `/${dir}/${fileName}`;
}

async function buildCss() {
  const dir = join(SRC, 'styles');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.css')).sort();
  const css = (await Promise.all(files.map((f) => readFile(join(dir, f), 'utf8')))).join('\n');
  return writeAsset('assets/css', 'main', 'css', minifyCss(css));
}

/** Concatenated into one module file; main.js comes last and calls the init functions. */
const SCRIPTS = ['cookie-banner.js', 'hero.js', 'gallery.js', 'contact-form.js', 'main.js'];

async function buildJs() {
  const parts = await Promise.all(SCRIPTS.map((f) => readFile(join(SRC, 'scripts', f), 'utf8')));
  return writeAsset('assets/js', 'main', 'js', parts.join('\n'));
}

const outputPath = (path) => join(DIST, path.endsWith('/') ? `${path}index.html` : path);

function findPlaceholders(html) {
  return [...html.matchAll(/class="placeholder">\[([^\]]+)\]/g)].map((m) => m[1]);
}

async function writeSeoFiles() {
  const indexable = pages.filter((p) => !p.noindex);
  const robots = ['User-agent: *', 'Allow: /'];

  if (site.url) {
    const urls = indexable.map((p) => `  <url><loc>${site.url}${p.path}</loc></url>`).join('\n');
    await writeFile(
      join(DIST, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
    robots.push(`Sitemap: ${site.url}/sitemap.xml`);
  }
  await writeFile(join(DIST, 'robots.txt'), `${robots.join('\n')}\n`);
}

/** RFC 9116: wohin Sicherheitslücken gemeldet werden können. Nur mit E-Mail-Adresse. */
async function writeSecurityTxt() {
  if (!site.contact.email) return;
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const lines = [`Contact: mailto:${site.contact.email}`, `Expires: ${expires}`, 'Preferred-Languages: de, en'];
  if (site.url) lines.push(`Canonical: ${site.url}/.well-known/security.txt`);
  await mkdir(join(DIST, '.well-known'), { recursive: true });
  await writeFile(join(DIST, '.well-known', 'security.txt'), `${lines.join('\n')}\n`);
}

/** Trägt Empfänger und Absender aus site.js in dist/api/kontakt.php ein. */
async function configureContactForm() {
  const file = join(DIST, 'api', 'kontakt.php');
  const recipient = site.contact.email.trim();
  const sender = (site.form?.sender || recipient).trim();
  const isEmail = (value) => /^[^\s@'\\]+@[^\s@'\\]+\.[a-z]{2,}$/i.test(value);

  if (!recipient) {
    console.log('\n⚠ contact.email ist leer – das Kontaktformular verschickt noch keine E-Mails.');
    return;
  }
  if (!isEmail(recipient) || !isEmail(sender)) throw new Error('contact.email oder form.sender ist keine gültige E-Mail-Adresse.');

  const php = (await readFile(file, 'utf8'))
    .replace("const RECIPIENT = '';", `const RECIPIENT = '${recipient}';`)
    .replace("const SENDER = '';", `const SENDER = '${sender}';`);
  await writeFile(file, php);
}

async function build() {
  const started = performance.now();
  await rm(DIST, { recursive: true, force: true });
  await cp(join(ROOT, 'public'), DIST, { recursive: true });

  const assets = { css: await buildCss(), js: await buildJs() };
  const missing = new Set();

  for (const page of pages) {
    const html = layout({ page, content: page.render(), assets }).toString();
    const file = outputPath(page.path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    findPlaceholders(html).forEach((label) => missing.add(label));
  }

  await writeSeoFiles();
  await writeSecurityTxt();
  await configureContactForm();

  const ms = Math.round(performance.now() - started);
  console.log(`✔ ${pages.length} Seiten nach dist/ gebaut (${ms} ms)`);

  if (missing.size) {
    console.log(`\n⚠ Noch fehlende Angaben (src/data/site.js, src/pages/legal.js):\n  ${[...missing].join(' · ')}`);
  }
  if (!site.url) console.log('\n⚠ site.url ist leer – keine Sitemap und keine Canonical-Links.');
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
