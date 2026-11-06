/**
 * Inhalte der Startseite. Fotos: StockSnap, CC0 (siehe README → Medien & Lizenzen).
 */
const photo = (name, width, height) => ({ image: `/assets/img/photos/${name}.webp`, width, height });

export const galleryItems = [
  { ...photo('objektschutz', 960, 720), label: 'Objektschutz', text: 'Gebäude, Gelände und Werte – geschützt bei Tag und Nacht.', href: '/leistungen/objektschutz/' },
  { ...photo('veranstaltungen', 960, 640), label: 'Veranstaltungen', text: 'Konzerte, Messen und Firmenfeiern sicher und störungsfrei.', href: '/leistungen/veranstaltungen/' },
  { ...photo('baustellen', 960, 606), label: 'Baustellen', text: 'Schutz vor Diebstahl, Vandalismus und unbefugtem Zutritt.', href: '/leistungen/baustellen/' },
  { ...photo('einzelhandel', 960, 640), label: 'Einzelhandel', text: 'Doormen und ShopGuards für Ihr Geschäft und Ihre Kunden.', href: '/leistungen/einzelhandel/' },
  { ...photo('alarm', 960, 640), label: 'Alarm & Intervention', text: 'Schnelle Reaktion, wenn der Alarm auslöst.', href: '/leistungen/alarm/' },
  { ...photo('urlaubsservice', 960, 640), label: 'Urlaubsservice', text: 'Wir behalten Ihr Zuhause im Blick, während Sie verreisen.', href: '/leistungen/urlaubsservice/' },
];

export const processSteps = [
  { icon: 'phone', title: 'Anfrage', text: 'Sie schildern uns Ihr Anliegen – telefonisch, per E-Mail oder über das Kontaktformular.' },
  { icon: 'pin', title: 'Analyse vor Ort', text: 'Wir sehen uns Objekt oder Veranstaltung an und klären Risiken und Anforderungen.' },
  { icon: 'shieldCheck', title: 'Sicherheitskonzept', text: 'Sie erhalten ein auf Sie zugeschnittenes Konzept mit einem klaren Angebot.' },
  { icon: 'users', title: 'Einsatz', text: 'Unser Team übernimmt – mit festem Ansprechpartner und sauberer Dokumentation.' },
];

export const strengths = [
  { icon: 'clock', title: 'Rund um die Uhr erreichbar', text: 'Auch an Wochenenden und Feiertagen.' },
  { icon: 'badge', title: 'Geprüftes Personal', text: 'Alle Einsatzkräfte mit Qualifikation nach § 34a GewO.' },
  { icon: 'users', title: 'Feste Ansprechpartner', text: 'Kurze Wege und klare Zuständigkeiten.' },
  { icon: 'pin', title: 'In der Region verwurzelt', text: 'Hannover und Niedersachsen – und darüber hinaus.' },
];
