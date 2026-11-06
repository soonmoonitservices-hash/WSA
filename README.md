# WSA Sicherheit GmbH – Website

Statische Website ohne Framework und ohne npm-Abhängigkeiten. Benötigt nur Node.js ≥ 20 zum Bauen.

```bash
node scripts/dev.mjs     # lokale Vorschau mit Auto-Rebuild → http://localhost:4321
node scripts/build.mjs   # fertige Website nach dist/ bauen
```

Den Inhalt von `dist/` per FTP/SFTP auf den Webspace laden (Apache mit PHP ≥ 8.1, z. B. IONOS, Strato, All-Inkl).

## Struktur

```
src/
  data/site.js        Firmendaten, Navigation, Cookie-Hinweis   ← hier Daten eintragen
  data/services.js    Leistungen – jede bekommt eine Seite unter /leistungen/<slug>/ (Texte, Aufgaben, Bilder)
  data/jobs.js        Stellenangebote – jede Stelle bekommt eine Seite unter /karriere/<slug>/
  data/faq.js         Häufige Fragen (/faq/)
  pages/              eine Datei pro Seite, Registrierung in pages/index.js
  components/         Header, Footer, Formular, Abschnitte, Icons
  layouts/base.js     HTML-Grundgerüst (Head, Meta, Header/Footer)
  styles/             CSS, nach Nummer zusammengefügt (Tokens → Basis → Komponenten)
  scripts/            Navigation, Cookie-Hinweis, Hero-Animation
  lib/html.js         Template-Funktion, escaped alle Werte automatisch (XSS-Schutz)
public/               wird 1:1 kopiert: Logo, Favicon, .htaccess, api/kontakt.php (Apache)
api/                  Vercel-Function fürs Kontaktformular, _lib/guard.js = Spam-Schutz-Regeln
scripts/              Build & Dev-Server
```

## Noch zu erledigen vor dem Livegang

Der Build listet alle fehlenden Angaben auf; auf der Seite erscheinen sie gelb markiert.

1. `src/data/site.js`: Adresse, Telefon, E-Mail, 24h-Notrufnummer (`emergency.phone`), `url` (Domain), Impressumsdaten, ggf. Öffnungszeiten und Login-URL.
2. `src/pages/legal.js`: Texte der Datenschutzerklärung.
3. Kontaktformular einrichten:
   - **Vercel, aktuell (Test):** `MAIL_PROVIDER=resend`, `MAIL_TO` und `MAIL_FROM=onboarding@resend.dev` sind gesetzt, es fehlt nur `RESEND_API_KEY`. Mit dem Test-Absender `onboarding@resend.dev` stellt Resend nur an die E-Mail-Adresse des eigenen Resend-Kontos zu. Alternativ `MAIL_PROVIDER=formsubmit` (FormSubmit.co, ohne Konto – war beim Test am 06.11.2026 nicht erreichbar).
   - **Vercel, empfohlen für den Livegang:** Konto bei [resend.com](https://resend.com) anlegen, Domain verifizieren und in Vercel unter Settings → Environment Variables `MAIL_PROVIDER=resend`, `RESEND_API_KEY`, `MAIL_TO` und `MAIL_FROM` setzen. Optional `FORM_SECRET` (langer Zufallswert). Danach neu deployen.
   - Antworten auf eine Anfrage gehen in beiden Fällen direkt an den Absender (Reply-To).
   - **Hostinger (oder anderes PHP-Hosting) – ohne Vercel und ohne Resend:**
     1. `npm run build` und den Inhalt von `dist/` (inkl. `.htaccess`, `.user.ini`, `.well-known`) nach `public_html/` hochladen.
     2. Empfänger festlegen – **die Adresse steht nie im Code, im Repository oder im Web-Ordner:** `config/wsa-kontakt.example.php` kopieren, in `wsa-kontakt.php` umbenennen, `to` (Empfänger) und ggf. `from` (Postfach auf der eigenen Domain, in hPanel → E-Mails anlegen) eintragen und **eine Ebene über `public_html`** hochladen, Rechte 600. Alternativ Server-Variablen `WSA_MAIL_TO` / `WSA_MAIL_FROM`. `wsa-kontakt.php` ist in `.gitignore`.
     3. hPanel: SSL aktivieren, PHP-Version auf die neueste 8.4/8.5 stellen. Liegt das Firmenpostfach nicht bei Hostinger: SPF-Eintrag für Hostinger im DNS prüfen.
   - Auf Vercel steht der Empfänger nur in der Umgebungsvariable `MAIL_TO` (nicht im Code).
   - `contact.email` in `src/data/site.js` ist nur die öffentliche Adresse für Impressum und Kontaktseite. Am besten für das Formular ein eigenes, nicht veröffentlichtes Postfach als Empfänger nutzen.
   - Nachrichten sind auf 500 Zeichen begrenzt (Formular, `api/_lib/guard.js`, `kontakt.php`).
   - Die E-Mail an die Firma ist gestaltet (HTML + Text): Anliegen, Name, E-Mail, Telefon, Nachricht, Knöpfe „Jetzt antworten“ und „Anrufen“.
4. `src/data/jobs.js` und `src/data/faq.js`: Stellen, Beschäftigungsarten, „Wir bieten“ und FAQ-Antworten mit der Geschäftsführung abstimmen.

Sobald Straße und Ort eingetragen sind, erhalten die Stellenseiten automatisch Google-for-Jobs-Daten (JobPosting).

## Medien & Lizenzen

| Datei | Quelle | Lizenz |
| --- | --- | --- |
| `public/assets/video/hero-*.mp4`, `hero-poster.jpg` | [Mixkit #42342 – „Aerial shot of a city at night“](https://mixkit.co/free-stock-video/aerial-shot-of-a-city-at-night-42342/) | Mixkit Stock Video Free License (kommerziell nutzbar, keine Namensnennung nötig; nicht als Einzeldatei weiterverkaufen) |
| `public/assets/img/logo.png` | WSA Sicherheit GmbH | Eigentum des Kunden |
| `public/assets/img/photos/objektschutz.webp` | [StockSnap – security-surveillance-W0P0UUBX98](https://stocksnap.io/photo/security-surveillance-W0P0UUBX98) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/veranstaltungen.webp` | [StockSnap – events-concert-1ZNLM71V1J](https://stocksnap.io/photo/events-concert-1ZNLM71V1J) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/baustellen.webp` | [StockSnap – danger-fence-HYVPKXY3JP](https://stocksnap.io/photo/danger-fence-HYVPKXY3JP) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/einzelhandel.webp` | [StockSnap – shop-store-I93PW8NE0F](https://stocksnap.io/photo/shop-store-I93PW8NE0F) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/alarm.webp` | [StockSnap – cctv-camera-1VZ50RICYR](https://stocksnap.io/photo/cctv-camera-1VZ50RICYR) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/urlaubsservice.webp` | [StockSnap – keys-door-Z1TKDI29FZ](https://stocksnap.io/photo/keys-door-Z1TKDI29FZ) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/nacht.webp` | [StockSnap – night-city-MIONYWYWGU](https://stocksnap.io/photo/night-city-MIONYWYWGU) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/objektschutz-2.webp` | [StockSnap – industrial-building-KUVPJ1G06U](https://stocksnap.io/photo/industrial-building-KUVPJ1G06U) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/veranstaltungen-2.webp` | [StockSnap – bluesfest-festival-6ZMXTUJ92C](https://stocksnap.io/photo/bluesfest-festival-6ZMXTUJ92C) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/baustellen-2.webp` | [StockSnap – construction-site-KSN9ULCSVX](https://stocksnap.io/photo/construction-site-KSN9ULCSVX) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/empfang.webp` | [StockSnap – staircase-interior-CIMIPMHUXZ](https://stocksnap.io/photo/staircase-interior-CIMIPMHUXZ) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/empfang-2.webp` | [StockSnap – sunlight-couch-NB6ISAF275](https://stocksnap.io/photo/sunlight-couch-NB6ISAF275) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/alarm-2.webp` | [StockSnap – security-surveillance-E8U0GNCPI8](https://stocksnap.io/photo/security-surveillance-E8U0GNCPI8) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/einzelhandel-2.webp` | [StockSnap – shop-store-XPBFSRZRLM](https://stocksnap.io/photo/shop-store-XPBFSRZRLM) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/einlass.webp` | [StockSnap – concert-festival-4CNNMKE9IQ](https://stocksnap.io/photo/concert-festival-4CNNMKE9IQ) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/einlass-2.webp` | [StockSnap – crowd-people-IUJP9OI22I](https://stocksnap.io/photo/crowd-people-IUJP9OI22I) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/urlaubsservice-2.webp` | [StockSnap – house-home-LJ515CPAKI](https://stocksnap.io/photo/house-home-LJ515CPAKI) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/unterkuenfte-2.webp` | [StockSnap – warehouse-building-2EEE2092E1](https://stocksnap.io/photo/warehouse-building-2EEE2092E1) | CC0 1.0 (gemeinfrei, unwiderruflich, keine Namensnennung nötig) |
| `public/assets/img/photos/unterkuenfte.webp` | [Wikimedia Commons – Shipping Container Houses, Brighton (Hassocks5489)](https://commons.wikimedia.org/wiki/File:Shipping_Container_Houses,_New_England_Road,_Brighton_(December_2013)_(1).jpg) | CC0 1.0 |
| `public/favicon*`, `icon-*.png`, `apple-touch-icon.png` | aus dem WSA-Logo erzeugt | Eigentum des Kunden |

Alle Fotos liegen auf dem eigenen Server (keine Abhängigkeit von fremden Diensten), als WebP mit max. 960 px Breite (lazy geladen).

Das Video wurde ohne Tonspur neu kodiert (720p ≈ 1,2 MB, 360p ≈ 0,35 MB für Mobilgeräte).

## Sicherheit & Performance

- Strenge Content-Security-Policy mit Trusted Types, HSTS, Clickjacking-, MIME- und Cross-Origin-Schutz (`vercel.json` und `public/.htaccess` – beide gleich halten). Der Dev-Server sendet dieselben Header.
- Kein Inline-JavaScript/-CSS, keine externen Skripte, Schriften oder Tracker, keine npm-Abhängigkeiten.
- Apache/LiteSpeed: nur GET/HEAD/POST, keine Verzeichnislisten, versteckte Dateien gesperrt, PHP wird nur für `api/kontakt.php` ausgeführt.
- PHP2Shell (CVE-2026-109618/-109619, Okt./Nov. 2026): Die Lücke steckt in PHP selbst. Abhilfe: beim Hoster eine gepatchte Version wählen (mind. 8.2.35 / 8.3.36 / 8.4.27 / 8.5.12). Zusätzlich setzt `public/.user.ini` `session.upload_progress.enabled = 0` und kleine Anfragelimits; `kontakt.php` schreibt eine Warnung ins Fehlerprotokoll, wenn die PHP-Version noch anfällig ist. Die Vercel-Variante nutzt kein PHP.
- `/.well-known/security.txt` wird erzeugt, sobald eine E-Mail-Adresse eingetragen ist.
- Kontaktformular – Spam-Schutz ohne Captcha:
  - signiertes Zeit-Token (holt das Script beim Laden; Absenden frühestens nach 3 s, höchstens nach 6 h)
  - Honeypot-Feld, Herkunftsprüfung (nur von der eigenen Website), Größenlimit
  - Filter für Links/HTML/BBCode, max. 2 Links pro Nachricht
  - Rate-Limit: 1 Anfrage pro Minute, 5 pro Stunde je IP
  - Bots erhalten stillschweigend die Dankeseite, damit sie nichts lernen
  - serverseitige Validierung, kein Header-Injection-Risiko
- CSS/JS gebündelt mit Content-Hash → 1 Jahr Browser-Cache; HTML immer aktuell.
- Hero-Animation pausiert außerhalb des Sichtbereichs und entfällt bei „Bewegung reduzieren“.
