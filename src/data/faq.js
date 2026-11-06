/**
 * Häufige Fragen. Antworten sind reiner Text (wird auch für Google genutzt),
 * optional mit einem weiterführenden Link.
 * Bitte inhaltlich mit der Geschäftsführung abstimmen.
 */
export const faqGroups = [
  {
    title: 'Über uns',
    items: [
      {
        question: 'Welche Leistungen bieten Sie an?',
        answer: 'Objektschutz, Veranstaltungssicherheit, Baustellenbewachung, Pforten- und Empfangsdienst, Alarmüberwachung mit Interventionsdienst, Doormen und ShopGuards im Einzelhandel, Einlasskontrollen, Unterstützung für Flüchtlings- und Notunterkünfte sowie unseren Urlaubsservice.',
        link: { href: '/leistungen/', label: 'Alle Leistungen' },
      },
      {
        question: 'In welchem Gebiet sind Sie im Einsatz?',
        answer: 'Unser Schwerpunkt ist die Region Hannover und Niedersachsen. Für Veranstaltungen und größere Aufträge sind wir auch darüber hinaus für Sie da.',
      },
      {
        question: 'Sind Ihre Sicherheitskräfte qualifiziert?',
        answer: 'Alle Einsatzkräfte erfüllen die Voraussetzungen nach § 34a GewO und sind im Bewacherregister erfasst. Wo das Gesetz die Sachkundeprüfung verlangt – etwa bei Ladendetektiven oder beim Einlass in Diskotheken –, setzen wir nur entsprechend geprüftes Personal ein.',
      },
      {
        question: 'Sind Sie versichert?',
        answer: 'Ja. Wie für Bewachungsunternehmen vorgeschrieben, besteht eine Haftpflichtversicherung für unsere Einsätze.',
      },
    ],
  },
  {
    title: 'Anfrage & Auftrag',
    items: [
      {
        question: 'Wie läuft eine Anfrage ab?',
        answer: 'Sie schildern uns kurz Ihr Anliegen. Im Gespräch – auf Wunsch mit Besichtigung vor Ort – klären wir den Bedarf. Danach erhalten Sie ein Sicherheitskonzept mit Angebot und einen festen Ansprechpartner für den Einsatz.',
        link: { href: '/kontakt/', label: 'Anfrage stellen' },
      },
      {
        question: 'Was kostet ein Sicherheitsdienst?',
        answer: 'Der Preis hängt von der Art des Einsatzes, der Dauer, der Uhrzeit (Nacht, Wochenende, Feiertag) und der Anzahl der Einsatzkräfte ab. Nach einem kurzen Gespräch erhalten Sie ein unverbindliches Angebot.',
      },
      {
        question: 'Wie schnell können Sie einen Auftrag übernehmen?',
        answer: 'Das hängt vom Umfang ab. Kurzfristige Einsätze sind oft möglich – in dringenden Fällen rufen Sie am besten direkt unseren 24h-Notruf an.',
      },
      {
        question: 'Kann ich auch einen einzelnen Einsatz buchen?',
        answer: 'Ja. Wir übernehmen einzelne Abende und Veranstaltungen ebenso wie die dauerhafte Bewachung eines Objekts.',
      },
    ],
  },
  {
    title: 'Karriere',
    items: [
      {
        question: 'Was brauche ich, um bei Ihnen zu arbeiten?',
        answer: 'Mindestens die Unterrichtung nach § 34a GewO, ein einwandfreies Führungszeugnis, gute Deutschkenntnisse und ein zuverlässiges, gepflegtes Auftreten.',
        link: { href: '/karriere/', label: 'Offene Stellen' },
      },
      {
        question: 'Kann ich auch ohne Erfahrung anfangen?',
        answer: 'Sprechen Sie uns an. Ob ein Quereinstieg möglich ist, hängt von der Stelle ab – bei der Vorbereitung auf die Unterrichtung oder Sachkundeprüfung unterstützen wir Sie gern.',
      },
    ],
  },
];
