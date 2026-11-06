<?php
/**
 * Kontaktformular-Handler für Apache-Hosting (PHP ≥ 8.1).
 * Auf Vercel übernimmt api/kontakt.js – die Regeln sind identisch.
 *
 *   GET  /api/kontakt/  → signiertes Formular-Token (holt das Script beim Laden)
 *   POST /api/kontakt/  → prüft alles und sendet die Anfrage per E-Mail
 *
 * Schutz ohne Captcha: signiertes Zeit-Token (min. 3 s, max. 6 h), Honeypot,
 * Herkunftsprüfung, Größenlimit, Link-/Spam-Filter, Rate-Limit pro IP,
 * keine Header-Injection (Nutzereingaben nur geprüft im Reply-To bzw. im Text).
 */
declare(strict_types=1);

// ---- Konfiguration -------------------------------------------------------
const RECIPIENT = '';          // wird beim Build aus site.js (contact.email) eingetragen
const SENDER = '';             // wird beim Build aus site.js (form.sender, sonst contact.email) eingetragen
// --------------------------------------------------------------------------

const MIN_SECONDS = 3;
const MAX_SECONDS = 6 * 60 * 60;
const MAX_LINKS = 2;
const MAX_BODY_BYTES = 20000;

// Warnung im Fehlerprotokoll, wenn die PHP-Version noch für PHP2Shell
// (CVE-2026-109618/-109619) anfällig ist → in hPanel eine aktuelle Version wählen.
const PHP_PATCHED = ['8.2' => '8.2.35', '8.3' => '8.3.36', '8.4' => '8.4.27', '8.5' => '8.5.12'];
$branch = PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION;
if (!isset(PHP_PATCHED[$branch]) ? version_compare($branch, '8.5', '<') : version_compare(PHP_VERSION, PHP_PATCHED[$branch], '<')) {
    error_log('kontakt.php: PHP ' . PHP_VERSION . ' ist veraltet/unsicher (PHP2Shell) – bitte aktualisieren.');
}

header_remove('X-Powered-By');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function redirect(string $status): never
{
    $target = $status === 'ok' ? '/kontakt/danke/' : '/kontakt/?status=' . $status . '#formular';
    header('Location: ' . $target, true, 303);
    exit;
}

/** Geheimer Schlüssel für die Tokens – wird beim ersten Aufruf zufällig erzeugt. */
function secret(): string
{
    $file = sys_get_temp_dir() . '/wsa-form-secret-' . hash('sha256', __DIR__);
    if (!is_file($file)) {
        file_put_contents($file, bin2hex(random_bytes(32)), LOCK_EX);
        @chmod($file, 0600);
    }
    return (string) file_get_contents($file);
}

function sign(string $value): string
{
    return rtrim(strtr(base64_encode(hash_hmac('sha256', $value, secret(), true)), '+/', '-_'), '=');
}

function checkToken(string $token): string
{
    if ($token === '') {
        return 'missing';
    }
    [$issued, $signature] = array_pad(explode('.', $token, 2), 2, '');
    if (!preg_match('/^\d{9,11}$/', $issued) || !hash_equals(sign($issued), $signature)) {
        return 'invalid';
    }
    $age = time() - (int) $issued;
    if ($age < MIN_SECONDS) {
        return 'too-fast';
    }
    return $age > MAX_SECONDS ? 'expired' : 'ok';
}

function input(string $key, int $maxLength, bool $singleLine = true): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = mb_substr(trim(str_replace("\0", '', $value)), 0, $maxLength);
    return $singleLine ? (string) preg_replace('/[\r\n]+/', ' ', $value) : $value;
}

/** Max. 1 Anfrage pro Minute und 5 pro Stunde je IP (IP nur als Hash gespeichert). */
function isRateLimited(): bool
{
    $file = sys_get_temp_dir() . '/wsa-contact-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $now = time();
    $hits = is_file($file) ? array_map('intval', explode(',', (string) file_get_contents($file))) : [];
    $hits = array_filter($hits, fn (int $t) => $now - $t < 3600);
    $limited = count($hits) >= 5 || array_filter($hits, fn (int $t) => $now - $t < 60) !== [];
    if (!$limited) {
        $hits[] = $now;
    }
    file_put_contents($file, implode(',', $hits), LOCK_EX);
    return $limited;
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'GET') {
    header('Content-Type: application/json');
    $now = (string) time();
    echo json_encode(['token' => $now . '.' . sign($now)]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: GET, POST');
    exit;
}

// Nur Formulare der eigenen Website annehmen
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== strtok($_SERVER['HTTP_HOST'] ?? '', ':')) {
    http_response_code(403);
    exit;
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES
    || !str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/x-www-form-urlencoded')) {
    redirect('error');
}

$token = checkToken(input('token', 200));
if ($token === 'invalid' || $token === 'too-fast') {
    redirect('ok'); // Bot: nichts verraten
}
if ($token !== 'ok') {
    redirect('expired');
}

// Honeypot ausgefüllt → Bot
if (input('website', 200) !== '') {
    redirect('ok');
}

$topics = ['Objektschutz', 'Veranstaltung', 'Baustelle', 'Einzelhandel', 'Alarm & Intervention', 'Sonstiges'];
$topic = input('anliegen', 40);

$data = [
    'Anliegen'  => in_array($topic, $topics, true) ? $topic : '',
    'Vorname'   => input('vorname', 100),
    'Nachname'  => input('nachname', 100),
    'E-Mail'    => input('email', 254),
    'Telefon'   => input('telefon', 40),
    'Nachricht' => input('nachricht', 5000, false),
];

$email = filter_var($data['E-Mail'], FILTER_VALIDATE_EMAIL);
if ($email === false || mb_strlen($data['Nachricht']) < 2) {
    redirect('error');
}

// Links/HTML in Namens- oder Telefonfeldern bzw. HTML/BBCode im Text gibt es nur bei Bots.
foreach (['Vorname', 'Nachname', 'Telefon'] as $key) {
    if (preg_match('/https?:|www\.|[<>]/i', $data[$key])) {
        redirect('ok');
    }
}
if (preg_match('/<a\s|\[url|\[link|<\/?script/i', $data['Nachricht'])) {
    redirect('ok');
}
if ($data['Telefon'] !== '' && !preg_match('/^[\d\s()+\-\/.]{4,40}$/', $data['Telefon'])) {
    redirect('error');
}
if (preg_match_all('/(https?:\/\/|www\.)\S+/i', $data['Nachricht']) > MAX_LINKS) {
    redirect('links');
}

if (RECIPIENT === '' || SENDER === '') {
    error_log('kontakt.php: RECIPIENT/SENDER nicht konfiguriert.');
    redirect('server');
}

if (isRateLimited()) {
    redirect('limit');
}

// ---- E-Mail: gestaltetes HTML + Text-Fallback (wie api/_lib/mail-template.js) ----
function esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function germanDate(): string
{
    $now = new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin'));
    $days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    $months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return $days[(int) $now->format('w')] . ', ' . $now->format('j') . '. ' . $months[(int) $now->format('n') - 1]
        . ' ' . $now->format('Y') . ' um ' . $now->format('H:i');
}

$subject = 'Neue Anfrage über die Website' . ($data['Anliegen'] !== '' ? ': ' . $data['Anliegen'] : '');
$name = trim($data['Vorname'] . ' ' . $data['Nachname']);
$date = germanDate();

$text = implode("\n", [
    'Neue Anfrage über die Website',
    'Eingegangen: ' . $date,
    '',
    'Anliegen:  ' . ($data['Anliegen'] ?: '–'),
    'Name:      ' . ($name ?: '–'),
    'E-Mail:    ' . $email,
    'Telefon:   ' . ($data['Telefon'] ?: '–'),
    '',
    'Nachricht:',
    $data['Nachricht'],
    '',
    '—',
    'Auf diese E-Mail antworten = Antwort geht direkt an den Absender.',
]);

$navy = '#101f4d';
$blue = '#4ea7d8';
$line = '#e5e8ee';
$muted = '#6b7280';
$empty = '<span style="color:#9aa0ab;font-weight:400;">nicht angegeben</span>';
$phoneHref = preg_replace('/[^\d+]/', '', $data['Telefon']);
$link = fn (string $href, string $label): string =>
    '<a href="' . $href . '" style="color:' . $navy . ';text-decoration:none;border-bottom:1px solid ' . $blue . ';">' . $label . '</a>';
$row = fn (string $label, string $value): string =>
    '<tr><td style="padding:12px 0;border-bottom:1px solid ' . $line . ';width:110px;vertical-align:top;color:' . $muted . ';font-size:13px;">' . $label . '</td>'
    . '<td style="padding:12px 0;border-bottom:1px solid ' . $line . ';vertical-align:top;color:#0f1424;font-size:15px;font-weight:600;">' . $value . '</td></tr>';
$replySubject = rawurlencode('Ihre Anfrage' . ($data['Anliegen'] !== '' ? ' – ' . $data['Anliegen'] : ''));
$e = esc($email);
$phone = esc($data['Telefon']);

$html = '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    . '<meta name="color-scheme" content="light"><title>' . esc($subject) . '</title></head>'
    . '<body style="margin:0;padding:0;background:#f1f3f7;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f7;"><tr><td align="center" style="padding:28px 12px;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:\'Segoe UI\',Helvetica,Arial,sans-serif;">'
    . '<tr><td style="height:5px;background:' . $blue . ';line-height:5px;font-size:0;">&nbsp;</td></tr>'
    . '<tr><td style="padding:26px 28px 22px;background:' . $navy . ';">'
    . '<p style="margin:0 0 6px;color:' . $blue . ';font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Kontaktformular</p>'
    . '<h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.3;font-weight:700;">Neue Anfrage' . ($name !== '' ? ' von ' . esc($name) : '') . '</h1>'
    . '<p style="margin:8px 0 0;color:#c9d3e6;font-size:13px;">' . esc($date) . '</p>'
    . ($data['Anliegen'] !== '' ? '<p style="margin:14px 0 0;"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:' . $blue . ';color:' . $navy . ';font-size:13px;font-weight:700;">' . esc($data['Anliegen']) . '</span></p>' : '')
    . '</td></tr>'
    . '<tr><td style="padding:10px 28px 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
    . $row('Name', $name !== '' ? esc($name) : $empty)
    . $row('E-Mail', $link('mailto:' . $e, $e))
    . $row('Telefon', $phone !== '' ? $link('tel:' . $phoneHref, $phone) : $empty)
    . '</table></td></tr>'
    . '<tr><td style="padding:18px 28px 6px;"><p style="margin:0 0 8px;color:' . $muted . ';font-size:13px;">Nachricht</p>'
    . '<div style="padding:16px 18px;background:#f6f8fb;border-left:4px solid ' . $blue . ';border-radius:8px;color:#2a2f3a;font-size:15px;line-height:1.6;white-space:pre-wrap;">' . esc($data['Nachricht']) . '</div></td></tr>'
    . '<tr><td style="padding:22px 28px 28px;">'
    . '<a href="mailto:' . $e . '?subject=' . $replySubject . '" style="display:inline-block;padding:13px 26px;background:' . $navy . ';color:#ffffff;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">Jetzt antworten</a>'
    . ($phone !== '' ? '<a href="tel:' . $phoneHref . '" style="display:inline-block;margin-left:8px;padding:12px 22px;border:1.5px solid ' . $navy . ';color:' . $navy . ';border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">Anrufen</a>' : '')
    . '</td></tr>'
    . '<tr><td style="padding:16px 28px;background:#f8f9fb;border-top:1px solid ' . $line . ';color:' . $muted . ';font-size:12px;line-height:1.5;">'
    . 'Gesendet über das Kontaktformular der Website. Wenn Sie auf diese E-Mail antworten, geht die Antwort direkt an ' . $e . '.</td></tr>'
    . '</table></td></tr></table></body></html>';

$boundary = 'wsa-' . bin2hex(random_bytes(12));
$part = fn (string $type, string $content): string =>
    '--' . $boundary . "\r\nContent-Type: " . $type . "; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($content)) . "\r\n";

$sent = mail(
    RECIPIENT,
    mb_encode_mimeheader($subject, 'UTF-8'),
    $part('text/plain', $text) . $part('text/html', $html) . '--' . $boundary . '--',
    [
        'From'         => mb_encode_mimeheader('WSA Website', 'UTF-8') . ' <' . SENDER . '>',
        'Reply-To'     => $email,
        'MIME-Version' => '1.0',
        'Content-Type' => 'multipart/alternative; boundary="' . $boundary . '"',
    ],
    '-f' . SENDER,
);

redirect($sent ? 'ok' : 'server');
