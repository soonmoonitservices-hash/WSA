<?php
/**
 * Empfänger des Kontaktformulars (Hostinger / PHP-Hosting).
 *
 * NICHT in den Web-Ordner legen und NICHT ins Git-Repository!
 *   1. Datei kopieren und in  wsa-kontakt.php  umbenennen
 *   2. Adressen eintragen
 *   3. per Dateimanager EINE Ebene ÜBER  public_html  hochladen, also z. B.
 *        /home/u123456789/domains/firma.de/wsa-kontakt.php
 *        /home/u123456789/domains/firma.de/public_html/   ← Website
 *   4. Dateirechte auf 600 (nur Eigentümer lesen/schreiben)
 *
 * to   = wohin die Anfragen gehen (wird nirgends angezeigt)
 * from = Postfach auf der eigenen Domain, über das gesendet wird
 *        (leer = gleiche Adresse wie "to")
 */
return [
    'to'   => '',
    'from' => '',
];
