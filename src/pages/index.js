import home from './home.js';
import services from './services.js';
import about from './about.js';
import { careers, jobPages } from './careers.js';
import faq from './faq.js';
import contact from './contact.js';
import { imprint, privacy } from './legal.js';
import { notFound, thanks } from './simple-pages.js';

/** Alle Seiten der Website. Neue Seite = Datei anlegen und hier eintragen. */
export const pages = [home, services, about, careers, ...jobPages, faq, contact, thanks, imprint, privacy, notFound];
