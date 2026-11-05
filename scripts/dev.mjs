/**
 * Local preview: serves dist/ and rebuilds on changes in src/ or public/.
 * Usage: node scripts/dev.mjs  →  http://localhost:4321
 * Note: PHP (contact form) is not executed locally.
 */
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;

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

createServer(async (req, res) => {
  const file = await resolveFile(req.url);
  try {
    if (!file) throw new Error('not found');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
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
