/**
 * E-Mail an die Firma bei einer neuen Anfrage: HTML (gestaltet) + Text (Fallback).
 * Gleiches Aussehen wie in public/api/kontakt.php. Tabellen und Inline-Styles,
 * damit es in Gmail, Outlook und Apple Mail gleich aussieht.
 * Alle Eingaben werden escaped.
 */
const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const C = { navy: '#101f4d', blue: '#4ea7d8', ink: '#0f1424', text: '#2a2f3a', muted: '#6b7280', line: '#e5e8ee', bg: '#f1f3f7' };
const FONT = "'Segoe UI',Helvetica,Arial,sans-serif";

export const SUBJECT = 'Neue Anfrage über die Website';
export const subjectFor = (data) => (data.anliegen ? `${SUBJECT}: ${data.anliegen}` : SUBJECT);

const formatDate = (date) =>
  new Intl.DateTimeFormat('de-DE', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Berlin' }).format(date);

const fullName = (data) => [data.vorname, data.nachname].filter(Boolean).join(' ');

export function mailText(data, date = new Date()) {
  return [
    SUBJECT,
    `Eingegangen: ${formatDate(date)}`,
    '',
    `Anliegen:  ${data.anliegen || '–'}`,
    `Name:      ${fullName(data) || '–'}`,
    `E-Mail:    ${data.email}`,
    `Telefon:   ${data.telefon || '–'}`,
    '',
    'Nachricht:',
    data.nachricht,
    '',
    '—',
    'Auf diese E-Mail antworten = Antwort geht direkt an den Absender.',
  ].join('\n');
}

const row = (label, value) => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid ${C.line};width:110px;vertical-align:top;color:${C.muted};font-size:13px;">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid ${C.line};vertical-align:top;color:${C.ink};font-size:15px;font-weight:600;">${value}</td>
  </tr>`;

export function mailHtml(data, date = new Date()) {
  const name = fullName(data);
  const email = esc(data.email);
  const phone = data.telefon ? esc(data.telefon) : '';
  const phoneHref = data.telefon.replace(/[^\d+]/g, '');
  const replySubject = encodeURIComponent(`Ihre Anfrage${data.anliegen ? ` – ${data.anliegen}` : ''}`);
  const link = (href, text) => `<a href="${href}" style="color:${C.navy};text-decoration:none;border-bottom:1px solid ${C.blue};">${text}</a>`;

  return `<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subjectFor(data))}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:${FONT};">
      <tr><td style="height:5px;background:${C.blue};line-height:5px;font-size:0;">&nbsp;</td></tr>
      <tr><td style="padding:26px 28px 22px;background:${C.navy};">
        <p style="margin:0 0 6px;color:${C.blue};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Kontaktformular</p>
        <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.3;font-weight:700;">Neue Anfrage${name ? ` von ${esc(name)}` : ''}</h1>
        <p style="margin:8px 0 0;color:#c9d3e6;font-size:13px;">${esc(formatDate(date))}</p>
        ${data.anliegen ? `<p style="margin:14px 0 0;"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.blue};color:${C.navy};font-size:13px;font-weight:700;">${esc(data.anliegen)}</span></p>` : ''}
      </td></tr>
      <tr><td style="padding:10px 28px 4px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Name', name ? esc(name) : '<span style="color:#9aa0ab;font-weight:400;">nicht angegeben</span>')}
          ${row('E-Mail', link(`mailto:${email}`, email))}
          ${row('Telefon', phone ? link(`tel:${phoneHref}`, phone) : '<span style="color:#9aa0ab;font-weight:400;">nicht angegeben</span>')}
        </table>
      </td></tr>
      <tr><td style="padding:18px 28px 6px;">
        <p style="margin:0 0 8px;color:${C.muted};font-size:13px;">Nachricht</p>
        <div style="padding:16px 18px;background:#f6f8fb;border-left:4px solid ${C.blue};border-radius:8px;color:${C.text};font-size:15px;line-height:1.6;white-space:pre-wrap;">${esc(data.nachricht)}</div>
      </td></tr>
      <tr><td style="padding:22px 28px 28px;">
        <a href="mailto:${email}?subject=${replySubject}" style="display:inline-block;padding:13px 26px;background:${C.navy};color:#ffffff;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">Jetzt antworten</a>
        ${phone ? `<a href="tel:${phoneHref}" style="display:inline-block;margin-left:8px;padding:12px 22px;border:1.5px solid ${C.navy};color:${C.navy};border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">Anrufen</a>` : ''}
      </td></tr>
      <tr><td style="padding:16px 28px;background:#f8f9fb;border-top:1px solid ${C.line};color:${C.muted};font-size:12px;line-height:1.5;">
        Gesendet über das Kontaktformular der Website. Wenn Sie auf diese E-Mail antworten, geht die Antwort direkt an ${email}.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
