/**
 * Kontaktformular auf Vercel (Node.js-Function, keine Abhängigkeiten).
 *
 *   GET  /api/kontakt/  → signiertes Formular-Token (holt das Script beim Laden)
 *   POST /api/kontakt/  → prüft alles und sendet die Anfrage per E-Mail (Resend)
 *
 * Umgebungsvariablen (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  API-Key von resend.com (Domain dort verifizieren)
 *   MAIL_TO         Empfänger, z. B. info@wsa-sicherheit.de
 *   MAIL_FROM       Absender auf der verifizierten Domain, z. B. website@wsa-sicherheit.de
 *   FORM_SECRET     optional: langer Zufallswert zum Signieren der Tokens
 */
import { createHash } from 'node:crypto';
import { checkContent, checkToken, createToken, isSameOrigin, LIMITS, readFields } from './_lib/guard.js';

const { RESEND_API_KEY = '', MAIL_TO = '', MAIL_FROM = '', FORM_SECRET = '' } = process.env;
const SECRET = FORM_SECRET || createHash('sha256').update(`wsa-form|${RESEND_API_KEY}`).digest('hex');

const NO_STORE = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

const redirect = (request, status) => {
  const target = status === 'ok' ? '/kontakt/danke/' : `/kontakt/?status=${status}#formular`;
  return new Response(null, { status: 303, headers: { ...NO_STORE, Location: new URL(target, request.url).href } });
};

// ---- Rate-Limit: max. 1 Anfrage pro Minute und 5 pro Stunde je IP --------
// Best effort: gilt pro Function-Instanz (Vercel hält Instanzen warm).
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  const limited = recent.length >= 5 || recent.some((t) => now - t < 60_000);
  if (!limited) recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // Speicher begrenzen
  return limited;
}

const clientIp = (request) =>
  createHash('sha256')
    .update(request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown')
    .digest('hex');

// ---- E-Mail ---------------------------------------------------------------
const LABELS = { vorname: 'Vorname', nachname: 'Nachname', email: 'E-Mail', telefon: 'Telefon', nachricht: 'Nachricht' };

async function sendMail(data) {
  const text = Object.entries(LABELS)
    .map(([key, label]) => `${label}:${key === 'nachricht' ? '\n' : ' '}${data[key] || '–'}`)
    .join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `WSA Website <${MAIL_FROM}>`,
      to: [MAIL_TO],
      reply_to: data.email,
      subject: 'Neue Anfrage über die Website',
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) console.error('kontakt: Resend antwortet', response.status, await response.text());
  return response.ok;
}

// ---- Handler --------------------------------------------------------------
export function GET() {
  return Response.json({ token: createToken(SECRET) }, { headers: NO_STORE });
}

export async function POST(request) {
  const url = new URL(request.url);
  if (!isSameOrigin(request.headers.get('origin'), url.host)) return new Response(null, { status: 403, headers: NO_STORE });

  const type = request.headers.get('content-type') ?? '';
  const length = Number(request.headers.get('content-length') ?? 0);
  if (!type.startsWith('application/x-www-form-urlencoded') || length > LIMITS.maxBodyBytes) {
    return redirect(request, 'error');
  }

  const raw = await request.text();
  if (raw.length > LIMITS.maxBodyBytes) return redirect(request, 'error');
  const params = new URLSearchParams(raw);

  const token = checkToken(SECRET, params.get('token'));
  if (token === 'invalid' || token === 'too-fast') return redirect(request, 'ok'); // Bot: nichts verraten
  if (token !== 'ok') return redirect(request, 'expired');

  const data = readFields(params);
  const check = checkContent(data, params.get('website'));
  if (check.result === 'drop') return redirect(request, 'ok');
  if (check.result === 'error') return redirect(request, check.status);

  if (!RESEND_API_KEY || !MAIL_TO || !MAIL_FROM) {
    console.error('kontakt: RESEND_API_KEY / MAIL_TO / MAIL_FROM fehlen.');
    return redirect(request, 'server');
  }
  if (isRateLimited(clientIp(request))) return redirect(request, 'limit');

  try {
    return redirect(request, (await sendMail(data)) ? 'ok' : 'server');
  } catch (error) {
    console.error('kontakt: Versand fehlgeschlagen', error);
    return redirect(request, 'server');
  }
}
