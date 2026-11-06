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
  data/services.js    Leistungen (Startseite + Leistungsseite)
  data/jobs.js        Stellenangebote – jede Stelle bekommt eine Seite unter /karriere/<slug>/
  data/faq.js         Häufige Fragen (/faq/)
  pages/              eine Datei pro Seite, Registrierung in pages/index.js
  components/         Header, Footer, Formular, Abschnitte, Icons
  layouts/base.js     HTML-Grundgerüst (Head, Meta, Header/Footer)
  styles/             CSS, nach Nummer zusammengefügt (Tokens → Basis → Komponenten)
  scripts/            Navigation, Cookie-Hinweis, Hero-Animation
  lib/html.js         Template-Funktion, escaped alle Werte automatisch (XSS-Schutz)
public/               wird 1:1 kopiert: Logo, Favicon, .htaccess, api/kontakt.php
scripts/              Build & Dev-Server
```

## Noch zu erledigen vor dem Livegang

Der Build listet alle fehlenden Angaben auf; auf der Seite erscheinen sie gelb markiert.

1. `src/data/site.js`: Adresse, Telefon, E-Mail, 24h-Notrufnummer (`emergency.phone`), `url` (Domain), Impressumsdaten, ggf. Öffnungszeiten und Login-URL.
2. `src/pages/legal.js`: Texte der Datenschutzerklärung.
3. `public/api/kontakt.php`: `RECIPIENT` und `SENDER` setzen.
4. `src/data/jobs.js` und `src/data/faq.js`: Stellen, Beschäftigungsarten, „Wir bieten“ und FAQ-Antworten mit der Geschäftsführung abstimmen.

Sobald Straße und Ort eingetragen sind, erhalten die Stellenseiten automatisch Google-for-Jobs-Daten (JobPosting).

## Medien & Lizenzen

| Datei | Quelle | Lizenz |
| --- | --- | --- |
| `public/assets/video/hero-*.mp4`, `hero-poster.jpg` | [Mixkit #42342 – „Aerial shot of a city at night“](https://mixkit.co/free-stock-video/aerial-shot-of-a-city-at-night-42342/) | Mixkit Stock Video Free License (kommerziell nutzbar, keine Namensnennung nötig; nicht als Einzeldatei weiterverkaufen) |
| `public/assets/img/logo.png` | WSA Sicherheit GmbH | Eigentum des Kunden |

Das Video wurde ohne Tonspur neu kodiert (720p ≈ 1,2 MB, 360p ≈ 0,35 MB für Mobilgeräte).

## Sicherheit & Performance

- Strenge Content-Security-Policy, HSTS, Clickjacking- und MIME-Schutz (`public/.htaccess`).
- Kein Inline-JavaScript/-CSS, keine externen Skripte, Schriften oder Tracker.
- Kontaktformular: Honeypot, serverseitige Validierung, Rate-Limit, kein Header-Injection-Risiko.
- CSS/JS gebündelt mit Content-Hash → 1 Jahr Browser-Cache; HTML immer aktuell.
- Hero-Animation pausiert außerhalb des Sichtbereichs und entfällt bei „Bewegung reduzieren“.
