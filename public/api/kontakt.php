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
const RECIPIENT = '';          // Empfänger, z. B. 'info@wsa-sicherheit.de'
const SENDER = '';             // Absender auf der eigenen Domain, z. B. 'website@wsa-sicherheit.de'
// --------------------------------------------------------------------------

const MIN_SECONDS = 3;
const MAX_SECONDS = 6 * 60 * 60;
const MAX_LINKS = 2;
const MAX_BODY_BYTES = 20000;

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

$data = [
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

$body = '';
foreach ($data as $label => $value) {
    $body .= $label . ':' . ($label === 'Nachricht' ? "\n" : ' ') . ($value !== '' ? $value : '–') . "\n";
}

$sent = mail(
    RECIPIENT,
    mb_encode_mimeheader('Neue Anfrage über die Website', 'UTF-8'),
    $body,
    [
        'From'                      => 'WSA Website <' . SENDER . '>',
        'Reply-To'                  => $email,
        'Content-Type'              => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => '8bit',
    ],
);

redirect($sent ? 'ok' : 'server');
