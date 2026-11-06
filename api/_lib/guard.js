/**
 * Spam- und Missbrauchsschutz für das Kontaktformular – ohne Captcha.
 * Reine Funktionen, damit sie testbar sind. Dieselben Regeln gelten in
 * public/api/kontakt.php (Apache-Hosting).
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const LIMITS = {
  minSeconds: 3, // schneller füllt kein Mensch das Formular aus
  maxSeconds: 6 * 60 * 60, // Token gilt 6 Stunden
  maxLinks: 2,
  maxBodyBytes: 20_000,
};

const FIELDS = {
  vorname: 100,
  nachname: 100,
  email: 254,
  telefon: 40,
  nachricht: 5000,
};

const sign = (secret, value) => createHmac('sha256', secret).update(value).digest('base64url');

/** Token = Ausgabezeitpunkt + HMAC. Ohne Token (= ohne JavaScript, direkter Bot-POST) kein Versand. */
export const createToken = (secret, now = Date.now()) => {
  const issued = String(Math.floor(now / 1000));
  return `${issued}.${sign(secret, issued)}`;
};

/** @returns {'ok' | 'missing' | 'invalid' | 'too-fast' | 'expired'} */
export function checkToken(secret, token, now = Date.now()) {
  if (typeof token !== 'string' || !token) return 'missing';
  const [issued, signature = ''] = token.split('.');
  if (!/^\d{9,11}$/.test(issued)) return 'invalid';

  const expected = Buffer.from(sign(secret, issued));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return 'invalid';

  const age = Math.floor(now / 1000) - Number(issued);
  if (age < LIMITS.minSeconds) return 'too-fast';
  if (age > LIMITS.maxSeconds) return 'expired';
  return 'ok';
}

const clean = (value, max) =>
  (typeof value === 'string' ? value : '')
    .replace(/\0/g, '')
    .trim()
    .slice(0, max);

/** Einzeilige Felder: Zeilenumbrüche entfernen (kein Header-Injection-Risiko). */
const singleLine = (value) => value.replace(/[\r\n]+/g, ' ');

export function readFields(params) {
  const data = {};
  for (const [name, max] of Object.entries(FIELDS)) {
    const value = clean(params.get(name), max);
    data[name] = name === 'nachricht' ? value : singleLine(value);
  }
  return data;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const LINK = /(https?:\/\/|www\.)\S+/gi;

/**
 * @returns {{ result: 'ok' } | { result: 'drop' } | { result: 'error', status: string }}
 *   drop  = eindeutig Bot → stillschweigend „Erfolg“ melden, nichts senden
 *   error = Mensch hat etwas falsch gemacht → Hinweis anzeigen
 */
export function checkContent(data, honeypot) {
  if (honeypot) return { result: 'drop' };

  const { vorname, nachname, email, telefon, nachricht } = data;
  if (!EMAIL.test(email) || nachricht.length < 2) return { result: 'error', status: 'error' };

  // Links in Namens- oder Telefonfeldern oder HTML/BBCode im Text gibt es nur bei Bots.
  if ([vorname, nachname, telefon].some((v) => /https?:|www\.|[<>]/i.test(v))) return { result: 'drop' };
  if (/<a\s|\[url|\[link|<\/?script/i.test(nachricht)) return { result: 'drop' };
  if (telefon && !/^[\d\s()+\-/.]{4,40}$/.test(telefon)) return { result: 'error', status: 'error' };

  if ((nachricht.match(LINK) ?? []).length > LIMITS.maxLinks) return { result: 'error', status: 'links' };
  return { result: 'ok' };
}

/** POST nur von der eigenen Website (Schutz vor fremden Formularen/CSRF). */
export function isSameOrigin(origin, host) {
  if (!origin) return true; // ältere Browser senden keinen Origin-Header
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
