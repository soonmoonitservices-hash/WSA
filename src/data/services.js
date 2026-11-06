/**
 * Leistungen. Jede Leistung bekommt eine eigene Seite unter /leistungen/<slug>/.
 *
 *   text    Kurztext für Karten und Übersicht
 *   lead    Einleitung oben auf der Leistungsseite
 *   intro   Absätze im ersten Abschnitt
 *   tasks   „Das übernehmen wir“
 *   places  „Typische Einsätze“
 *   note    „Gut zu wissen“ (optional)
 *   images  zwei Fotos aus public/assets/img/photos (CC0, siehe README)
 */
const img = (file, alt, width, height) => ({ src: `/assets/img/photos/${file}.webp`, alt, width, height });

export const services = [
  {
    slug: 'objektschutz',
    icon: 'building',
    title: 'Objektschutz',
    text: 'Wir sorgen für den Schutz und die Sicherheit von Gebäuden, Anlagen und Einrichtungen. Unser Ziel ist es, Risiken zu minimieren und Sicherheit rund um die Uhr zu gewährleisten.',
    lead: 'Bürogebäude, Lager, Produktionshallen oder leer stehende Immobilien: Wir passen auf, wenn niemand da ist – und auch, wenn Betrieb herrscht.',
    intro: [
      'Ein Gebäude ist nachts und am Wochenende am verwundbarsten. Einbrecher, Vandalen oder ungebetene Gäste rechnen damit, dass keiner hinsieht. Genau dann sind wir vor Ort.',
      'Je nach Objekt stellen wir einen festen Wachposten, fahren Kontrollen in unregelmäßigen Abständen oder kombinieren beides. Was wir bei jeder Runde sehen, steht im Wachbuch – Sie wissen also jederzeit, was los war.',
    ],
    tasks: [
      'Fester Wachdienst am Objekt, tagsüber oder nachts',
      'Kontroll- und Streifengänge nach festgelegtem Plan',
      'Prüfen von Türen, Fenstern, Toren und Beleuchtung',
      'Zugangskontrolle für Mitarbeiter, Besucher und Lieferanten',
      'Schließdienst: Auf- und Abschließen zu vereinbarten Zeiten',
      'Bericht über jede Schicht und jeden Vorfall',
    ],
    places: ['Bürogebäude und Verwaltungen', 'Lager- und Logistikflächen', 'Produktionsbetriebe', 'Leer stehende oder zu sanierende Gebäude'],
    note: 'Wenn Sie uns vorab Grundriss, Schlüsselplan und Ansprechpartner für den Notfall nennen, können wir beim ersten Einsatz sofort richtig handeln.',
    images: [
      img('objektschutz', 'Überwachungskamera an einer dunkelblauen Fassade', 960, 720),
      img('objektschutz-2', 'Person geht an einem Backsteingebäude mit verschlossenen Fenstern vorbei', 960, 640),
    ],
  },
  {
    slug: 'unterkuenfte',
    icon: 'home',
    title: 'Unterstützung für Flüchtlings- und Notunterkünfte',
    text: 'Wir sorgen für Sicherheit und Ordnung in Unterkünften, um ein sicheres Umfeld für alle Bewohner zu schaffen.',
    lead: 'In einer Unterkunft leben viele Menschen auf engem Raum. Wir sorgen dafür, dass sich dort alle sicher fühlen können – Bewohner wie Personal.',
    intro: [
      'Sicherheit in einer Unterkunft heißt vor allem: ansprechbar sein. Unsere Mitarbeiter kennen die Hausordnung, wissen, wer ins Haus gehört, und gehen Konflikten früh und ruhig nach, bevor sie größer werden.',
      'Wir arbeiten eng mit der Einrichtungsleitung, den Sozialarbeitern und bei Bedarf mit Polizei und Rettungsdienst zusammen. Respekt gegenüber den Bewohnern ist für uns dabei selbstverständlich.',
    ],
    tasks: [
      'Empfang und Zugangskontrolle rund um die Uhr',
      'Besucherregelung nach Hausordnung',
      'Rundgänge im Gebäude und auf dem Gelände',
      'Schlichten von Streit und Deeskalation',
      'Brandschutz-Kontrollen und Hilfe bei Räumungen',
      'Dokumentation und Übergabe an die Einrichtungsleitung',
    ],
    places: ['Erstaufnahme-Einrichtungen', 'Gemeinschafts- und Notunterkünfte', 'Wohncontainer-Anlagen', 'Obdachlosen-Unterkünfte'],
    note: 'Für leitende Tätigkeiten in Flüchtlingsunterkünften schreibt § 34a GewO die Sachkundeprüfung vor. Wir setzen dort nur entsprechend geprüftes Personal ein.',
    images: [
      img('unterkuenfte', 'Wohnanlage aus Containern an einer Straße', 960, 508),
      img('unterkuenfte-2', 'Weißes Gebäude mit Eingangsbereich und Zaun', 960, 640),
    ],
  },
  {
    slug: 'veranstaltungen',
    icon: 'users',
    title: 'Veranstaltungssicherheit',
    text: 'Von großen Events bis zu privaten Feiern: Wir stellen sicher, dass Ihre Veranstaltung sicher und störungsfrei verläuft.',
    lead: 'Konzert, Stadtfest, Messe oder Firmenfeier: Sie kümmern sich um Ihre Gäste, wir um die Sicherheit.',
    intro: [
      'Jede Veranstaltung ist anders. Ein Sommerfest mit 300 Gästen braucht etwas anderes als ein Konzert mit mehreren Tausend Besuchern. Deshalb sprechen wir vorher mit Ihnen über Ablauf, Gelände und Publikum und planen die Zahl der Kräfte danach.',
      'Am Veranstaltungstag ist ein Einsatzleiter Ihr fester Ansprechpartner. Er hält Kontakt zu Ihnen, zum Sanitätsdienst und – wenn nötig – zu Polizei und Feuerwehr.',
    ],
    tasks: [
      'Planung des Sicherheitsdienstes mit Ihnen',
      'Einlass-, Ticket- und Taschenkontrollen',
      'Ordnungsdienst und Lenkung der Besucher',
      'Sicherung von Bühne, Backstage und VIP-Bereich',
      'Freihalten von Rettungswegen',
      'Bewachung von Gelände und Technik über Nacht',
    ],
    places: ['Konzerte und Festivals', 'Stadt- und Straßenfeste', 'Messen und Kongresse', 'Firmenfeiern und private Feste'],
    note: 'Je früher Sie uns ansprechen, desto besser. Für größere Veranstaltungen verlangen Behörden oft ein Sicherheitskonzept – dabei unterstützen wir Sie.',
    images: [
      img('veranstaltungen', 'Band auf einer Bühne, Publikum mit erhobenen Händen', 960, 640),
      img('veranstaltungen-2', 'Besucherin vor einer beleuchteten Festivalbühne', 960, 640),
    ],
  },
  {
    slug: 'baustellen',
    icon: 'cone',
    title: 'Baustellenbewachung',
    text: 'Unser Service schützt Ihre Baustelle vor Vandalismus, Diebstahl und unbefugtem Zutritt.',
    lead: 'Werkzeug, Maschinen, Kupfer und Baumaterial sind auf einer Baustelle schnell weg. Wir sorgen dafür, dass am Montag noch alles da ist.',
    intro: [
      'Diebstahl auf Baustellen kostet nicht nur das gestohlene Material. Oft steht danach die Arbeit still, weil eine Maschine fehlt oder erst neues Material bestellt werden muss.',
      'Wir bewachen Ihre Baustelle nach Feierabend, am Wochenende und über die Feiertage. Auf Wunsch kontrollieren wir auch tagsüber, wer das Gelände betritt.',
    ],
    tasks: [
      'Bewachung nach Feierabend und am Wochenende',
      'Kontrollgänge entlang von Zaun, Containern und Lagerflächen',
      'Zufahrtskontrolle für Lieferungen und Fremdfirmen',
      'Prüfen von Absperrungen und Beleuchtung',
      'Sofortige Meldung an Bauleitung und Polizei bei Vorfällen',
      'Tägliche Berichte für Ihre Bauakte',
    ],
    places: ['Wohn- und Gewerbebau', 'Straßen- und Tiefbau', 'Sanierungen im Bestand', 'Lagerplätze für Material und Maschinen'],
    images: [
      img('baustellen', 'Bauzaun mit Warnschild „Danger – Construction Area“', 960, 606),
      img('baustellen-2', 'Blick durch einen Bauzaun auf eine Baustelle in der Stadt', 632, 960),
    ],
  },
  {
    slug: 'empfang',
    icon: 'desk',
    title: 'Pforten- und Empfangsdienst',
    text: 'Wir bieten professionellen Empfangsdienst, der Sicherheit mit Gastfreundschaft verbindet.',
    lead: 'Der Empfang ist das Erste, was Besucher von Ihrem Haus sehen. Wir sorgen dafür, dass sie sich willkommen fühlen – und dass nur hineinkommt, wer hinein darf.',
    intro: [
      'Unsere Mitarbeiter am Empfang sind freundlich, gut gekleidet und wissen, was zu tun ist. Sie melden Besucher an, geben Ausweise aus und behalten im Blick, wer kommt und geht.',
      'Wir richten uns nach Ihren Abläufen: Ob Besucherbuch auf Papier oder elektronisches System, ob Telefonzentrale oder Postannahme – wir arbeiten uns ein und übernehmen.',
    ],
    tasks: [
      'Empfang und Anmeldung von Besuchern',
      'Ausgabe von Besucher- und Mitarbeiterausweisen',
      'Zugangskontrolle an Pforte und Schranke',
      'Schlüsselverwaltung',
      'Telefonzentrale, Post- und Paketannahme',
      'Erste Ansprechperson im Notfall',
    ],
    places: ['Firmenzentralen und Bürohäuser', 'Behörden und öffentliche Gebäude', 'Werksgelände und Industrieparks', 'Kliniken und Pflegeeinrichtungen'],
    images: [
      img('empfang', 'Helles Treppenhaus in einem modernen Bürogebäude', 960, 640),
      img('empfang-2', 'Schwarze Sitzbank in einer hellen Eingangshalle', 960, 640),
    ],
  },
  {
    slug: 'alarm',
    icon: 'bell',
    title: 'Alarmüberwachung und Interventionsdienst',
    text: 'Im Alarmfall reagieren unsere Teams schnell und effizient, um Schäden zu verhindern oder zu minimieren.',
    lead: 'Eine Alarmanlage hilft nur, wenn auch jemand kommt. Wenn bei Ihnen der Alarm auslöst, fahren wir hin und sehen nach.',
    intro: [
      'Viele Alarme sind Fehlalarme – ein offenes Fenster, eine Katze, ein Defekt. Trotzdem muss jeder Alarm ernst genommen werden. Wir prüfen vor Ort, ob alles in Ordnung ist, und sichern das Objekt, wenn nicht.',
      'Bei einem echten Einbruch verständigen wir sofort die Polizei, sichern den Bereich und informieren Sie. Wenn nötig, bleiben wir vor Ort, bis eine kaputte Tür oder ein Fenster gesichert ist.',
    ],
    tasks: [
      'Anfahrt zum Objekt bei Alarm',
      'Kontrolle von Gebäude und Außenbereich',
      'Verständigung von Polizei, Feuerwehr oder Rettungsdienst',
      'Sicherung des Objekts nach einem Einbruch',
      'Information an Sie oder Ihre Notfallkontakte',
      'Schriftlicher Bericht zu jedem Einsatz',
    ],
    places: ['Gewerbe- und Büroobjekte', 'Einzelhandel und Gastronomie', 'Lager und Werkstätten', 'Privathäuser'],
    note: 'Für den Interventionsdienst hinterlegen Sie bei uns einen Schlüssel und Ihre Notfallkontakte. Beides wird sicher verwahrt.',
    images: [
      img('alarm', 'Überwachungskamera an einer Decke', 960, 640),
      img('alarm-2', 'Kuppelkamera an einer Wand mit grafischem Muster', 960, 720),
    ],
  },
  {
    slug: 'einzelhandel',
    icon: 'bag',
    title: 'Doormen, ShopGuards, Ladendetektive',
    text: 'Unsere Spezialisten arbeiten diskret im Hintergrund, um Einzelhandelsgeschäfte und ihre Kunden zu schützen.',
    lead: 'Ladendiebstahl kostet den Handel jedes Jahr viel Geld. Sichtbare Präsenz am Eingang und ein geschultes Auge auf der Fläche wirken dagegen.',
    intro: [
      'Ein Doorman oder ShopGuard am Eingang schreckt ab. Wer sieht, dass jemand aufpasst, lässt es oft gleich bleiben. Gleichzeitig ist er Ansprechpartner für Kunden und unterstützt Ihr Personal, wenn es unruhig wird.',
      'Ladendetektive arbeiten dagegen unauffällig in Zivil. Sie beobachten, greifen bei einem Diebstahl ein und übergeben an die Polizei.',
    ],
    tasks: [
      'Sichtbare Präsenz am Eingang (Doorman)',
      'Kontrollgänge auf der Verkaufsfläche (ShopGuard)',
      'Verdeckte Beobachtung durch Ladendetektive',
      'Ruhiges Eingreifen bei Konflikten',
      'Übergabe an die Polizei und Anzeige',
      'Auswertung: Wo und wann passiert am meisten?',
    ],
    places: ['Supermärkte und Discounter', 'Drogerien und Elektronikmärkte', 'Modegeschäfte', 'Einkaufszentren'],
    note: 'Ladendetektive brauchen nach § 34a GewO die Sachkundeprüfung. Alle unsere Ladendetektive haben sie.',
    images: [
      img('einzelhandel', 'Schild „Open – Shop“ an einer Ladentür', 960, 640),
      img('einzelhandel-2', 'Kleines Geschäft mit vollen Regalen', 960, 641),
    ],
  },
  {
    slug: 'einlass',
    icon: 'badge',
    title: 'Einlasskontrollen',
    text: 'Wir sorgen für einen reibungslosen und sicheren Ablauf bei der Besucherverwaltung von Veranstaltungen.',
    lead: 'Am Einlass entscheidet sich, wie ein Abend läuft. Wir kontrollieren gründlich, ohne dass sich lange Schlangen bilden.',
    intro: [
      'Gute Einlasskontrolle ist eine Mischung aus Freundlichkeit und Konsequenz. Gäste sollen sich willkommen fühlen, aber gefährliche Gegenstände, Glas oder Pyrotechnik bleiben draußen.',
      'Wir planen mit Ihnen, wie viele Kontrollspuren Sie brauchen, wo Frauen von Frauen abgetastet werden und wie Gäste mit Behinderung bevorzugt eingelassen werden.',
    ],
    tasks: [
      'Ticket- und Akkreditierungskontrolle',
      'Taschen- und Personenkontrolle',
      'Alterskontrolle bei Jugendschutz-Auflagen',
      'Durchsetzen von Hausrecht und Hausverbot',
      'Zählung der Besucher für die erlaubte Höchstzahl',
      'Lenkung von Warteschlangen',
    ],
    places: ['Clubs und Diskotheken', 'Konzerte und Festivals', 'Sportveranstaltungen', 'Messen und Firmenevents'],
    note: 'Für den Einlass in Diskotheken schreibt § 34a GewO die Sachkundeprüfung vor. Dort setzen wir nur geprüftes Personal ein.',
    images: [
      img('einlass', 'Konzertbesucher filmt die Bühne mit dem Handy', 960, 640),
      img('einlass-2', 'Publikum formt mit den Händen ein Herz vor der Bühne', 960, 640),
    ],
  },
  {
    slug: 'urlaubsservice',
    icon: 'suitcase',
    title: 'Urlaubsservice',
    text: 'Wir halten ein wachsames Auge auf Ihr Zuhause, während Sie entspannt Ihren Urlaub genießen.',
    lead: 'Ein voller Briefkasten und immer dieselben geschlossenen Rollläden verraten: Hier ist niemand zu Hause. Wir sorgen dafür, dass Ihr Haus bewohnt aussieht.',
    intro: [
      'Während Sie verreist sind, schauen wir regelmäßig nach Ihrem Haus oder Ihrer Wohnung. Wir leeren den Briefkasten, öffnen und schließen Rollläden und kontrollieren Türen und Fenster.',
      'Fällt uns etwas auf – etwa ein Wasserschaden oder Spuren eines Einbruchsversuchs – melden wir uns sofort bei Ihnen und kümmern uns um das Nötige.',
    ],
    tasks: [
      'Kontrollbesuche in vereinbarten Abständen',
      'Leeren von Briefkasten und Annahme von Paketen',
      'Rollläden und Licht wechselnd bedienen',
      'Prüfen von Türen, Fenstern und Wasserleitungen',
      'Pflanzen gießen auf Wunsch',
      'Kurze Nachricht nach jedem Besuch',
    ],
    places: ['Einfamilienhäuser', 'Wohnungen', 'Ferien- und Zweitwohnungen', 'Praxen und kleine Büros in der Urlaubszeit'],
    note: 'Melden Sie Ihren Urlaub am besten ein bis zwei Wochen vorher an. Dann bleibt genug Zeit für die Schlüsselübergabe und einen ersten Rundgang mit Ihnen.',
    images: [
      img('urlaubsservice', 'Schlüssel steckt in einer offenen Haustür', 960, 640),
      img('urlaubsservice-2', 'Einfamilienhaus in der Abenddämmerung mit beleuchteten Fenstern', 960, 640),
    ],
  },
];

export const servicePath = (service) => `/leistungen/${service.slug}/`;
