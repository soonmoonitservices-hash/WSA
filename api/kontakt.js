/**
 * Kontaktformular auf Vercel (Node.js-Function, keine Abhängigkeiten).
 *
 *   GET  /api/kontakt/  → signiertes Formular-Token (holt das Script beim Laden)
 *   POST /api/kontakt/  → prüft alles und sendet die Anfrage per E-Mail
 *
 * Umgebungsvariablen (Vercel → Project → Settings → Environment Variables):
 *   MAIL_TO         Empfänger der Anfragen
 *   MAIL_PROVIDER   'resend' (Standard, mit eigener Domain) oder 'formsubmit'
 *                   (ohne Konto; beim ersten Versand kommt eine Bestätigungs-Mail)
 *   RESEND_API_KEY  nur für Resend: API-Key von resend.com
 *   MAIL_FROM       nur für Resend: Absender auf der verifizierten Domain
 *   FORM_SECRET     optional: langer Zufallswert zum Signieren der Tokens
 *
 * Antworten gehen immer direkt an den Absender (Reply-To).
 */
import { createHash } from 'node:crypto';
import { mailHtml, mailText, subjectFor } from './_lib/mail-template.js';
import { checkContent, checkToken, createToken, isSameOrigin, LIMITS, readFields } from './_lib/guard.js';

const { RESEND_API_KEY = '', MAIL_TO = '', MAIL_FROM = '', FORM_SECRET = '', MAIL_PROVIDER = 'resend' } = process.env;
const SECRET = FORM_SECRET || createHash('sha256').update(`wsa-form|${RESEND_API_KEY}|${MAIL_TO}`).digest('hex');
const SITE_ORIGIN = 'https://wsa-sicherheit.vercel.app';

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
/** Resend: eigener Absender auf verifizierter Domain. */
async function sendViaResend(data) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `WSA Website <${MAIL_FROM}>`,
      to: [MAIL_TO],
      reply_to: data.email,
      subject: subjectFor(data),
      text: mailText(data),
      html: mailHtml(data),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) console.error('kontakt: Resend antwortet', response.status, await response.text());
  return response.ok;
}

/** FormSubmit.co: ohne Konto, Empfänger bestätigt einmalig per Link. */
async function sendViaFormSubmit(data, origin) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(MAIL_TO)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: origin, Referer: `${origin}/kontakt/` },
    body: JSON.stringify({
      Anliegen: data.anliegen || '–',
      Vorname: data.vorname || '–',
      Nachname: data.nachname || '–',
      'E-Mail': data.email,
      Telefon: data.telefon || '–',
      Nachricht: data.nachricht,
      _subject: subjectFor(data),
      _replyto: data.email,
      _template: 'table',
      _captcha: 'false',
    }),
    signal: AbortSignal.timeout(8000),
  });
  const result = await response.json().catch(() => ({}));
  const ok = response.ok && String(result.success) === 'true';
  if (!ok) console.error('kontakt: FormSubmit antwortet', response.status, JSON.stringify(result));
  return ok;
}

const isConfigured = () =>
  MAIL_TO && (MAIL_PROVIDER === 'formsubmit' || (RESEND_API_KEY && MAIL_FROM));

const sendMail = (data, origin) =>
  MAIL_PROVIDER === 'formsubmit' ? sendViaFormSubmit(data, origin) : sendViaResend(data);

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

  if (!isConfigured()) {
    console.error('kontakt: Mailversand nicht konfiguriert (MAIL_TO, MAIL_PROVIDER, RESEND_API_KEY, MAIL_FROM).');
    return redirect(request, 'server');
  }
  if (isRateLimited(clientIp(request))) return redirect(request, 'limit');

  try {
    return redirect(request, (await sendMail(data, url.origin.startsWith('http://localhost') ? SITE_ORIGIN : url.origin)) ? 'ok' : 'server');
  } catch (error) {
    console.error('kontakt: Versand fehlgeschlagen', error);
    return redirect(request, 'server');
  }
}
