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
public/               wird 1:1 kopiert: Logo, Favicon, .htaccess, api/kontakt.php (Apache)
api/                  Vercel-Function fürs Kontaktformular, _lib/guard.js = Spam-Schutz-Regeln
scripts/              Build & Dev-Server
```

## Noch zu erledigen vor dem Livegang

Der Build listet alle fehlenden Angaben auf; auf der Seite erscheinen sie gelb markiert.

1. `src/data/site.js`: Adresse, Telefon, E-Mail, 24h-Notrufnummer (`emergency.phone`), `url` (Domain), Impressumsdaten, ggf. Öffnungszeiten und Login-URL.
2. `src/pages/legal.js`: Texte der Datenschutzerklärung.
3. Kontaktformular einrichten:
   - **Vercel:** Konto bei [resend.com](https://resend.com) anlegen, Domain verifizieren und in Vercel unter Settings → Environment Variables `RESEND_API_KEY`, `MAIL_TO` und `MAIL_FROM` setzen. Optional `FORM_SECRET` (langer Zufallswert). Danach neu deployen.
   - **Apache/PHP:** in `public/api/kontakt.php` `RECIPIENT` und `SENDER` setzen.
4. `src/data/jobs.js` und `src/data/faq.js`: Stellen, Beschäftigungsarten, „Wir bieten“ und FAQ-Antworten mit der Geschäftsführung abstimmen.

Sobald Straße und Ort eingetragen sind, erhalten die Stellenseiten automatisch Google-for-Jobs-Daten (JobPosting).

## Medien & Lizenzen

| Datei | Quelle | Lizenz |
| --- | --- | --- |
| `public/assets/video/hero-*.mp4`, `hero-poster.jpg` | [Mixkit #42342 – „Aerial shot of a city at night“](https://mixkit.co/free-stock-video/aerial-shot-of-a-city-at-night-42342/) | Mixkit Stock Video Free License (kommerziell nutzbar, keine Namensnennung nötig; nicht als Einzeldatei weiterverkaufen) |
| `public/assets/img/logo.png` | WSA Sicherheit GmbH | Eigentum des Kunden |

Das Video wurde ohne Tonspur neu kodiert (720p ≈ 1,2 MB, 360p ≈ 0,35 MB für Mobilgeräte).

## Sicherheit & Performance

- Strenge Content-Security-Policy mit Trusted Types, HSTS, Clickjacking-, MIME- und Cross-Origin-Schutz (`vercel.json` und `public/.htaccess` – beide gleich halten). Der Dev-Server sendet dieselben Header.
- Kein Inline-JavaScript/-CSS, keine externen Skripte, Schriften oder Tracker, keine npm-Abhängigkeiten.
- Apache: nur GET/HEAD/POST, keine Verzeichnislisten, versteckte Dateien gesperrt.
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
