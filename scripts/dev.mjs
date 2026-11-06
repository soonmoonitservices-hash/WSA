/**
 * Local preview: serves dist/ and rebuilds on changes in src/ or public/.
 * Usage: node scripts/dev.mjs  →  http://localhost:4321
 * /api/kontakt/ runs the Vercel function (api/kontakt.js); without
 * RESEND_API_KEY etc. it answers "server", but all spam checks run.
 */
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;

/** Same security headers as production (from vercel.json), so CSP problems show up locally. */
const vercelConfig = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
const SECURITY_HEADERS = Object.fromEntries(
  vercelConfig.headers
    .find(({ source }) => source === '/(.*)')
    .headers.filter(({ key }) => !['Strict-Transport-Security'].includes(key))
    .map(({ key, value }) => [key, value.replace('; upgrade-insecure-requests', '')]),
);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

let building = null;
let queued = false;

function rebuild() {
  if (building) {
    queued = true;
    return;
  }
  building = spawn(process.execPath, [join(ROOT, 'scripts', 'build.mjs')], { stdio: 'inherit' });
  building.on('exit', () => {
    building = null;
    if (queued) {
      queued = false;
      rebuild();
    }
  });
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const file = normalize(join(DIST, decoded));
  if (!file.startsWith(DIST + sep) && file !== DIST) return null; // path traversal guard
  try {
    const info = await stat(file);
    return info.isDirectory() ? join(file, 'index.html') : file;
  } catch {
    return null;
  }
}

/** Bridges Node's req/res to the Web-style handler of the Vercel function. */
async function handleApi(req, res) {
  const api = await import(`${pathToFileURL(join(ROOT, 'api', 'kontakt.js')).href}?t=${Date.now()}`);
  const handler = api[req.method];
  if (!handler) {
    res.writeHead(405).end();
    return;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
  });
  const response = await handler(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

createServer(async (req, res) => {
  if (/^\/api\/kontakt\/?(\?|$)/.test(req.url)) return handleApi(req, res);
  const file = await resolveFile(req.url);
  try {
    if (!file) throw new Error('not found');
    const body = await readFile(file);
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'Not found'));
  }
}).listen(PORT, () => console.log(`→ http://localhost:${PORT}`));

let timer;
for (const dir of ['src', 'public']) {
  watch(join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 80);
  });
}
rebuild();
