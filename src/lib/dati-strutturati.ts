/**
 * I dati strutturati (schema.org, JSON-LD).
 *
 * A che cosa servono davvero, qui: quando qualcuno cerca «RSA Torino» o
 * «casa di riposo Biella», il risultato di ricerca può mostrare il percorso
 * del sito invece dell'URL grezzo, il numero verde accanto al nome, e la
 * scheda della struttura con indirizzo e telefono. Per un pubblico che
 * arriva quasi tutto dal motore di ricerca, è la differenza fra un
 * risultato che si capisce e quattro livelli di URL.
 *
 * DUE REGOLE, E NON SI DEROGA.
 *
 * 1. Non si dichiara niente che non sia anche visibile nella pagina. Dati
 *    strutturati che raccontano una cosa diversa dal testo sono una
 *    penalizzazione, non un'ottimizzazione — e nel nostro caso sarebbero
 *    anche una bugia su una struttura sanitaria.
 *
 * 2. Un indirizzo che il gestionale non restituisce non si scrive qui.
 *    Quando `indirizzoPubblicabile` è falso — un gruppo appartamento in
 *    condominio, una casa di accoglienza per donne — il campo non arriva
 *    proprio, e queste funzioni lo omettono invece di inventarlo. Un
 *    indirizzo nascosto nella pagina ma presente nel JSON-LD sarebbe la
 *    peggiore delle due cose: invisibile a chi legge, perfettamente
 *    leggibile da chiunque guardi il sorgente o interroghi il motore.
 */

const ID_ORGANIZZAZIONE = '#anteo';
const ID_SITO = '#sito';

export interface Recapiti {
  numeroVerde: string;
  telefono: string;
  email: string;
  indirizzo: string;
}

/** Ripreso da src/content/anteo.js, che resta l'unica fonte dei recapiti. */
export const RECAPITI: Recapiti = {
  numeroVerde: '800 127 996',
  telefono: '015 813401',
  email: 'anteo@gruppoanteo.it',
  indirizzo: 'Via Piacenza 11, 13900 Biella',
};

/**
 * L'ente. Un nodo solo, con un @id stabile, che tutto il resto cita.
 *
 * `NGO` è il tipo che descrive una cooperativa sociale meglio di
 * `Organization` generico: non è un'impresa commerciale e non è un ente
 * pubblico. Il nome è per esteso, come ovunque.
 */
export function ORGANIZZAZIONE(sito: URL) {
  return {
    '@type': 'NGO',
    '@id': new URL(ID_ORGANIZZAZIONE, sito).href,
    name: 'Anteo Impresa Sociale',
    legalName: 'Anteo Impresa Sociale società cooperativa sociale',
    url: sito.href,
    logo: new URL('/marchio/logo-lockup.svg', sito).href,
    description:
      'Servizi socio-sanitari ed educativi per anziani, persone con disabilità, ' +
      'salute mentale, dipendenze, minori e famiglie, in 21 province italiane.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Piacenza 11',
      postalCode: '13900',
      addressLocality: 'Biella',
      addressRegion: 'BI',
      addressCountry: 'IT',
    },
    email: RECAPITI.email,
    telephone: `+39 ${RECAPITI.telefono.replace(/\s/g, '')}`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        // Il numero verde è quello che compare in ogni pagina, in alto.
        telephone: `+39 ${RECAPITI.numeroVerde.replace(/\s/g, '')}`,
        contactType: 'customer service',
        areaServed: 'IT',
        availableLanguage: 'it',
        /* Gli orari sono dichiarati perché sono veri e perché il sito li
           dice: promettere un numero attivo 24 ore su 24 quando è 9-18 è
           esattamente il genere di scarto fra dato e pagina che va evitato. */
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
    ],
  };
}

export function SITO_WEB(sito: URL) {
  return {
    '@type': 'WebSite',
    '@id': new URL(ID_SITO, sito).href,
    url: sito.href,
    name: 'Anteo Impresa Sociale',
    inLanguage: 'it-IT',
    publisher: { '@id': new URL(ID_ORGANIZZAZIONE, sito).href },
    /* Nessuna `SearchAction`: la dichiarerebbe come ricerca per parole
       chiave, mentre la nostra è un percorso a tre passi in POST — apposta,
       perché quello che si sceglie rivela una condizione di salute e non
       deve finire in un indirizzo web. Dichiarare qualcosa che non c'è
       sarebbe una promessa che il sito non mantiene. */
  };
}

/** [testo, href] nell'ordine in cui compaiono, l'ultima è la pagina corrente. */
export function briciolePerPercorso(voci: [string, string][], sito: URL) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: voci.map(([nome, href], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: nome,
      item: new URL(href, sito).href,
    })),
  };
}

export interface SchedaSede {
  nome: string;
  tipologia: string;
  settore: string;
  descrizione: string;
  comune: string;
  provincia: string;
  /** Assente quando la sede non è pubblicabile: allora non si scrive. */
  indirizzo?: string | null;
  indirizzoPubblicabile: boolean;
  telefono?: string | null;
  postiLetto?: number | null;
  percorso: string;
}

/**
 * Una sede.
 *
 * `ResidentialCare` per ciò che è residenziale, `MedicalClinic` per i
 * diurni: sono i due tipi di schema.org che corrispondono a quello che
 * queste strutture sono davvero. Usare `LocalBusiness` generico farebbe
 * comparire il sollecito a inserire prezzi e recensioni, che su questo sito
 * non esistono per scelta.
 */
export function SEDE(s: SchedaSede, sito: URL) {
  const residenziale = /residenz|comunit|gruppo appartamento|casa di riposo|rsa/i.test(
    s.tipologia,
  );

  const nodo: Record<string, unknown> = {
    '@type': residenziale ? 'ResidentialCare' : 'MedicalClinic',
    '@id': new URL(`${s.percorso}#sede`, sito).href,
    name: s.nome,
    url: new URL(s.percorso, sito).href,
    description: s.descrizione,
    parentOrganization: { '@id': new URL(ID_ORGANIZZAZIONE, sito).href },
    areaServed: { '@type': 'AdministrativeArea', name: s.provincia },
  };

  /* L'indirizzo. Se non è pubblicabile, si dichiara soltanto il comune —
     che è già scritto nella pagina — e nient'altro. Coordinate, via e
     numero civico non compaiono. */
  nodo.address = s.indirizzoPubblicabile && s.indirizzo
    ? {
        '@type': 'PostalAddress',
        streetAddress: s.indirizzo.split(',')[0].trim(),
        addressLocality: s.comune,
        addressRegion: s.provincia,
        addressCountry: 'IT',
      }
    : {
        '@type': 'PostalAddress',
        addressLocality: s.comune,
        addressRegion: s.provincia,
        addressCountry: 'IT',
      };

  if (s.telefono) nodo.telephone = `+39 ${s.telefono.replace(/\s/g, '')}`;

  /* I posti letto solo se il numero è vero. Un segnaposto fra parentesi
     quadre qui dentro diventerebbe un dato pubblicato. */
  if (typeof s.postiLetto === 'number' && Number.isFinite(s.postiLetto)) {
    nodo.numberOfBeds = s.postiLetto;
  }

  return nodo;
}

export interface Annuncio {
  ruolo: string;
  descrizione: string;
  sede: string;
  comune: string;
  provincia: string;
  contratto: string;
  percorso: string;
  /** Data di pubblicazione ISO. Senza, l'annuncio non è valido. */
  pubblicatoIl?: string | null;
}

/**
 * Un annuncio di lavoro.
 *
 * `baseSalary` NON c'è, e non è una dimenticanza: la retribuzione negli
 * annunci si dichiara sempre, ma come intervallo con livello CCNL e
 * indennità, cioè una struttura che `MonetaryAmount` non sa rappresentare
 * senza semplificarla in un numero. Un numero solo, estratto da un
 * intervallo, sarebbe più impreciso del testo che gli sta accanto. Quando
 * il gestionale restituirà minimo e massimo separati, questo campo si
 * aggiunge con i due valori veri.
 */
export function ANNUNCIO_LAVORO(a: Annuncio, sito: URL) {
  const nodo: Record<string, unknown> = {
    '@type': 'JobPosting',
    '@id': new URL(`${a.percorso}#annuncio`, sito).href,
    title: a.ruolo,
    description: a.descrizione,
    employmentType: /full\s*time|tempo pieno/i.test(a.contratto)
      ? 'FULL_TIME'
      : 'PART_TIME',
    hiringOrganization: { '@id': new URL(ID_ORGANIZZAZIONE, sito).href },
    jobLocation: {
      '@type': 'Place',
      name: a.sede,
      address: {
        '@type': 'PostalAddress',
        addressLocality: a.comune,
        addressRegion: a.provincia,
        addressCountry: 'IT',
      },
    },
  };
  if (a.pubblicatoIl) nodo.datePosted = a.pubblicatoIl;
  return nodo;
}
