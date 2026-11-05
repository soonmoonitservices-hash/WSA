/**
 * Zentrale Firmendaten. Leere Felder ('') erscheinen auf der Website als
 * gelber Platzhalter und werden beim Build aufgelistet.
 */
export const site = {
  name: 'WSA Sicherheit GmbH',
  shortName: 'WSA',
  claim: 'Ihre Sicherheit ist unsere Mission.',
  motto: 'Das Bessere ist der Feind des Guten',
  lang: 'de',

  /** Live-Domain ohne Slash am Ende, z. B. 'https://www.wsa-sicherheit.de'. Nötig für Sitemap & Canonical. */
  url: '',

  /** Externer Mitarbeiter-/Kundenlogin. Leer = Link wird ausgeblendet. */
  loginUrl: '',

  cookieBanner: {
    enabled: true,
    /**
     * false = Hinweis erscheint bei jedem Seitenaufruf/Refresh.
     * true  = Auswahl wird im Browser (localStorage) gespeichert → in der
     *         Datenschutzerklärung erwähnen.
     */
    rememberChoice: false,
  },

  contact: {
    street: '',
    zip: '',
    city: '',
    phone: '',
    email: '',
  },

  /** Leer lassen, solange die Zeiten nicht feststehen – der Block wird dann ausgeblendet. */
  openingHours: [
    // { days: 'Mo–Do', time: '9:00–17:00 Uhr' },
    // { days: 'Fr', time: '9:00–13:00 Uhr' },
  ],

  legal: {
    managingDirectors: '',
    registerCourt: '',
    registerNumber: '',
    vatId: '',
    /** Behörde, die die Erlaubnis nach § 34a GewO erteilt hat. */
    permitAuthority: '',
    contentResponsible: '',
  },
};

export const navigation = [
  { href: '/', label: 'Startseite' },
  { href: '/leistungen/', label: 'Leistungen' },
  { href: '/ueber-uns/', label: 'Über uns' },
  { href: '/karriere/', label: 'Karriere' },
  { href: '/kontakt/', label: 'Kontakt' },
];

export const legalNavigation = [
  { href: '/impressum/', label: 'Impressum' },
  { href: '/datenschutz/', label: 'Datenschutz' },
];
