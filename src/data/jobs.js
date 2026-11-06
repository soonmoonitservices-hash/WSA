/**
 * Offene Stellen. Jede Stelle bekommt automatisch eine eigene Seite unter
 * /karriere/<slug>/. Stelle entfernen = Eintrag löschen.
 *
 * Beschäftigungsarten und „Wir bieten“ bitte mit der Geschäftsführung abstimmen.
 */
export const jobs = [
  {
    slug: 'doorman-shopguard',
    icon: 'bag',
    title: 'Doorman / ShopGuard (m/w/d)',
    employmentTypes: ['Vollzeit', 'Teilzeit', 'Minijob'],
    datePosted: '2026-11-06',
    summary: 'Sie sorgen im Einzelhandel für Sicherheit am Eingang und auf der Verkaufsfläche und sind erster Ansprechpartner für Kunden und Personal.',
    tasks: [
      'Präsenz am Eingang und auf der Verkaufsfläche',
      'Vorbeugung von Ladendiebstahl',
      'Ansprechpartner für Kunden und Mitarbeiter des Marktes',
      'Ruhiges, deeskalierendes Auftreten in Konfliktsituationen',
      'Dokumentation von Vorfällen',
    ],
    profile: [
      'Unterrichtung nach § 34a GewO, für Ladendetektive die Sachkundeprüfung',
      'Freundliches, sicheres Auftreten',
      'Gute Deutschkenntnisse',
      'Flexibilität bei den Einsatzzeiten',
    ],
  },
  {
    slug: 'objektschutz',
    icon: 'building',
    title: 'Sicherheitsmitarbeiter Objektschutz (m/w/d)',
    employmentTypes: ['Vollzeit', 'Teilzeit'],
    datePosted: '2026-11-06',
    summary: 'Sie schützen Gebäude, Gelände und Werte unserer Kunden – im Revier, an der Zufahrt oder als fester Wachposten.',
    tasks: [
      'Kontroll- und Streifengänge nach Plan',
      'Zugangs- und Zufahrtskontrolle',
      'Überwachung von Alarm- und Videotechnik',
      'Richtiges Handeln bei Störungen, Alarmierung von Polizei und Feuerwehr',
      'Führen von Wachbuch und Berichten',
    ],
    profile: [
      'Unterrichtung oder Sachkundeprüfung nach § 34a GewO',
      'Bereitschaft zu Nacht-, Wochenend- und Feiertagsdiensten',
      'Zuverlässigkeit und Verantwortungsbewusstsein',
      'Führerschein Klasse B von Vorteil',
    ],
  },
  {
    slug: 'veranstaltungen-einlass',
    icon: 'users',
    title: 'Sicherheitsmitarbeiter Veranstaltungen & Einlass (m/w/d)',
    employmentTypes: ['Teilzeit', 'Minijob'],
    datePosted: '2026-11-06',
    summary: 'Sie sorgen bei Konzerten, Messen, Stadtfesten und Firmenevents für einen sicheren und reibungslosen Ablauf.',
    tasks: [
      'Einlass-, Ticket- und Taschenkontrollen',
      'Ordnungsdienst und Besucherlenkung',
      'Sicherung von Bühnen, Backstage- und VIP-Bereichen',
      'Unterstützung im Notfall und bei Räumungen',
    ],
    profile: [
      'Unterrichtung nach § 34a GewO, für den Einlass in Diskotheken die Sachkundeprüfung',
      'Teamgeist und Belastbarkeit auch bei großem Andrang',
      'Einsatzbereitschaft am Abend und am Wochenende',
      'Englischkenntnisse von Vorteil',
    ],
  },
  {
    slug: 'empfang-pforte',
    icon: 'desk',
    title: 'Mitarbeiter Empfangs- und Pfortendienst (m/w/d)',
    employmentTypes: ['Vollzeit', 'Teilzeit'],
    datePosted: '2026-11-06',
    summary: 'Sie sind das Gesicht unserer Kunden am Empfang – professionell, freundlich und mit Blick auf die Sicherheit im Haus.',
    tasks: [
      'Empfang und Anmeldung von Besuchern',
      'Ausgabe von Besucherausweisen und Schlüsseln',
      'Zugangskontrolle',
      'Telefonzentrale und Postannahme',
    ],
    profile: [
      'Unterrichtung nach § 34a GewO',
      'Gepflegtes, serviceorientiertes Auftreten',
      'Sehr gute Deutsch-, gute Englischkenntnisse',
      'Sicherer Umgang mit PC und Telefon',
    ],
  },
];

/** Gilt für alle Stellen. */
export const benefits = [
  'Faire und pünktliche Bezahlung',
  'Planbare Dienste und feste Ansprechpartner',
  'Gründliche Einarbeitung im Team',
  'Unterstützung bei Weiterbildungen, z. B. zur Sachkundeprüfung',
];

/** Gilt für alle Stellen. */
export const requirements = [
  'Unterrichtung oder Sachkundeprüfung nach § 34a GewO',
  'Einwandfreies Führungszeugnis',
  'Gute Deutschkenntnisse in Wort und Schrift',
  'Zuverlässigkeit und ein gepflegtes Auftreten',
];
