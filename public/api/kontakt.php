<?php
/**
 * Kontaktformular-Handler (PHP ≥ 8.1).
 *
 * Schutzmaßnahmen: nur POST, Honeypot gegen Bots, serverseitige Validierung,
 * Längenlimits, Rate-Limit pro IP, kein Header-Injection-Risiko
 * (Nutzereingaben landen nur geprüft im Reply-To bzw. im Mail-Text).
 */
declare(strict_types=1);

// ---- Konfiguration -------------------------------------------------------
const RECIPIENT = '';          // Empfänger, z. B. 'info@wsa-sicherheit.de'
const SENDER = '';             // Absender auf der eigenen Domain, z. B. 'noreply@wsa-sicherheit.de'
const RATE_LIMIT_SECONDS = 60;
// --------------------------------------------------------------------------

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function redirect(string $status): never
{
    $target = $status === 'ok' ? '/kontakt/danke/' : '/kontakt/?status=' . $status . '#formular';
    header('Location: ' . $target, true, 303);
    exit;
}

function input(string $key, int $maxLength): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = trim(str_replace("\0", '', $value));
    return mb_substr($value, 0, $maxLength);
}

function isRateLimited(): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/wsa-contact-' . hash('sha256', $ip);
    if (is_file($file) && time() - (int) filemtime($file) < RATE_LIMIT_SECONDS) {
        return true;
    }
    touch($file);
    return false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

// Honeypot ausgefüllt → Bot. Still "Erfolg" melden, nichts senden.
if (input('website', 200) !== '') {
    redirect('ok');
}

$data = [
    'Vorname'   => input('vorname', 100),
    'Nachname'  => input('nachname', 100),
    'E-Mail'    => input('email', 254),
    'Telefon'   => input('telefon', 40),
    'Nachricht' => input('nachricht', 5000),
];

$email = filter_var($data['E-Mail'], FILTER_VALIDATE_EMAIL);
if ($email === false || $data['Nachricht'] === '') {
    redirect('error');
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
    $body .= $label . ': ' . ($label === 'Nachricht' ? "\n" : '') . ($value !== '' ? $value : '–') . "\n";
}

$headers = [
    'From'                      => 'WSA Website <' . SENDER . '>',
    'Reply-To'                  => $email,
    'Content-Type'              => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
];

$sent = mail(
    RECIPIENT,
    mb_encode_mimeheader('Neue Anfrage über die Website', 'UTF-8'),
    $body,
    $headers,
);

redirect($sent ? 'ok' : 'server');
