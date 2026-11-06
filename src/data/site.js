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
  loginUrl: 'https://office.spn-sicherheit.de/',

  cookieBanner: {
    enabled: true,
    /**
     * false = Hinweis beim ersten Besuch und bei jedem Neuladen; beim Wechsel
     *         zwischen Seiten nicht mehr (Auswahl im sessionStorage des Tabs).
     * true  = Auswahl wird dauerhaft im Browser (localStorage) gespeichert.
     */
    rememberChoice: false,
  },

  contact: {
    street: '',
    zip: '',
    city: '',
    phone: '',
    email: '', // öffentliche E-Mail (Impressum/Kontaktseite) – NICHT der Formular-Empfänger
  },


  /**
   * 24h-Notruf: erscheint oben auf jeder Seite, im Hero und auf der Kontaktseite.
   * enabled: false blendet ihn komplett aus.
   */
  emergency: {
    enabled: true,
    phone: '',
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
  // submenu: Menüpunkt öffnet ein Untermenü statt selbst zu verlinken
  { href: '/leistungen/', label: 'Leistungen', submenu: 'services' },
  { href: '/ueber-uns/', label: 'Über uns' },
  { href: '/karriere/', label: 'Karriere' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/kontakt/', label: 'Kontakt' },
];

export const legalNavigation = [
  { href: '/impressum/', label: 'Impressum' },
  { href: '/datenschutz/', label: 'Datenschutz' },
];
