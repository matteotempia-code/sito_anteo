#!/usr/bin/env node
/**
 * Verifica i dati strutturati.
 *
 * Non è un controllo di sintassi: JSON.stringify non sbaglia. È un
 * controllo di REGOLE, e la regola che conta è una sola — un indirizzo che
 * la pagina non mostra non deve comparire nel JSON-LD.
 *
 * Il rischio è concreto e silenzioso. Nella scheda di un gruppo
 * appartamento l'indirizzo è nascosto di proposito: chi ci vive ha diritto
 * a che nessuno sappia dal citofono che cosa sta attraversando. Se lo stesso
 * indirizzo finisse nel blocco di dati strutturati, sarebbe invisibile a chi
 * legge la pagina e perfettamente leggibile da chiunque guardi il sorgente,
 * da ogni motore di ricerca e da ogni raccoglitore automatico. Cioè il
 * contrario esatto di quello che la pagina promette.
 *
 * Un difetto così non si vede guardando la pagina. Si vede solo qui.
 *
 * Si controlla anche che non escano segnaposto: `[N] posti letto` scritto
 * come `numberOfBeds` diventerebbe un dato pubblicato, e i dati pubblicati
 * fanno prendere decisioni.
 *
 * Gira con: node --experimental-strip-types scripts/verifica-dati-strutturati.mjs
 */
import { ORGANIZZAZIONE, SITO_WEB, SEDE, ANNUNCIO_LAVORO, briciolePerPercorso } from '../src/lib/dati-strutturati.ts';

const SITO = new URL('https://www.anteocoop.it');
let errori = 0;
let prove = 0;

function prova(nome, condizione, dettaglio = '') {
  prove++;
  if (!condizione) {
    console.error(`  ✗ ${nome}${dettaglio ? ` — ${dettaglio}` : ''}`);
    errori++;
  }
}

/** Cerca una stringa ovunque dentro l'oggetto, a qualsiasi profondità. */
function contiene(oggetto, ago) {
  return JSON.stringify(oggetto).toLowerCase().includes(ago.toLowerCase());
}

/* ------------------------------------------------- l'ente e il sito ---- */

const ente = ORGANIZZAZIONE(SITO);
prova('l’ente ha un @id stabile', ente['@id'] === 'https://www.anteocoop.it/#anteo');
prova('il nome è per esteso', ente.name === 'Anteo Impresa Sociale');
prova('non esiste «Anteo» da solo', !/(^|[^a-zà-ù])Anteo([^ ]|$)/.test(ente.name));
prova('il numero verde è in formato internazionale',
  ente.contactPoint[0].telephone.startsWith('+39'));
prova('gli orari dichiarati sono 9-18 lun-ven, come scrive la pagina',
  ente.contactPoint[0].hoursAvailable.opens === '09:00' &&
  ente.contactPoint[0].hoursAvailable.closes === '18:00' &&
  ente.contactPoint[0].hoursAvailable.dayOfWeek.length === 5);

const sito = SITO_WEB(SITO);
prova('il sito cita l’ente per @id', sito.publisher['@id'] === ente['@id']);
prova('nessuna SearchAction dichiarata', !contiene(sito, 'SearchAction'),
  'la ricerca è in POST a tre passi, non per parole chiave');

/* ------------------------------------------------------- le briciole --- */

const bric = briciolePerPercorso(
  [['Home', '/'], ['Servizi', '/servizi'], ['Anziani', '/servizi/anziani']],
  SITO,
);
prova('le briciole sono numerate da 1',
  bric.itemListElement.map((v) => v.position).join() === '1,2,3');
prova('gli indirizzi delle briciole sono assoluti',
  bric.itemListElement.every((v) => v.item.startsWith('https://')));

/* ------------------- LA REGOLA CHE CONTA: l'indirizzo riservato -------- */

const RISERVATA = {
  nome: 'Gruppo Appartamento Le Betulle',
  tipologia: 'Gruppo appartamento',
  settore: 'salute-mentale',
  descrizione: 'Cinque persone vivono in un appartamento come un altro.',
  comune: 'Vercelli',
  provincia: 'VC',
  indirizzo: 'Via Segreta 42, Vercelli',
  indirizzoPubblicabile: false,
  telefono: null,
  postiLetto: 5,
  percorso: '/servizi/salute-mentale/vercelli/le-betulle',
};

const riservata = SEDE(RISERVATA, SITO);
prova('sede riservata: la via NON compare', !contiene(riservata, 'Via Segreta'),
  'sarebbe pubblicata a chiunque legga il sorgente');
prova('sede riservata: nemmeno il numero civico', !contiene(riservata, '42'));
prova('sede riservata: niente streetAddress', !('streetAddress' in riservata.address));
prova('sede riservata: il comune sì, perché la pagina lo dice',
  riservata.address.addressLocality === 'Vercelli');
prova('sede riservata: niente coordinate', !contiene(riservata, 'geo'));

/* ------------------------------------------------ la sede pubblicabile - */

const PUBBLICA = {
  nome: 'RSA Gran Torino',
  tipologia: 'Residenza sanitaria per anziani',
  settore: 'anziani',
  descrizione: 'Accogliamo persone anziane non più autosufficienti.',
  comune: 'Torino',
  provincia: 'TO',
  indirizzo: 'Strada San Mauro 158, Torino',
  indirizzoPubblicabile: true,
  telefono: '800 127 996',
  postiLetto: 120,
  percorso: '/servizi/anziani/torino/rsa-gran-torino',
};

const pubblica = SEDE(PUBBLICA, SITO);
prova('sede pubblicabile: la via compare',
  pubblica.address.streetAddress === 'Strada San Mauro 158');
prova('sede residenziale: il tipo è ResidentialCare',
  pubblica['@type'] === 'ResidentialCare');
prova('i posti letto veri si dichiarano', pubblica.numberOfBeds === 120);
prova('la sede cita l’ente per @id', pubblica.parentOrganization['@id'] === ente['@id']);
prova('nessun prezzo, da nessuna parte',
  !contiene(pubblica, 'price') && !contiene(pubblica, 'offer') && !contiene(pubblica, 'retta'),
  'sul sito pubblico di soldi non si parla');
prova('nessuna recensione inventata',
  !contiene(pubblica, 'aggregateRating') && !contiene(pubblica, 'review'));

const diurno = SEDE({ ...PUBBLICA, tipologia: 'Centro diurno', postiLetto: null }, SITO);
prova('un diurno non è ResidentialCare', diurno['@type'] === 'MedicalClinic');
prova('senza posti letto, il campo non esiste', !('numberOfBeds' in diurno));

/* ------------------------------------------------------- i segnaposto -- */

const conSegnaposto = SEDE(
  { ...PUBBLICA, postiLetto: '[N]', telefono: '[TELEFONO]', indirizzo: '[INDIRIZZO]' },
  SITO,
);
prova('un segnaposto nei posti letto non viene pubblicato',
  !('numberOfBeds' in conSegnaposto),
  'un numero finto fa prendere decisioni sbagliate');

/* --------------------------------------------------------- l'annuncio - */

const annuncio = ANNUNCIO_LAVORO(
  {
    ruolo: 'Operatore socio-sanitario (OSS)',
    descrizione: 'Igiene e mobilizzazione, aiuto ai pasti, accompagnamento.',
    sede: 'RSA Gran Torino',
    comune: 'Torino',
    provincia: 'TO',
    contratto: 'Tempo indeterminato, full time · turni su tre fasce',
    percorso: '/lavora-con-noi/oss-torino',
    pubblicatoIl: '2026-09-25',
  },
  SITO,
);
prova('l’annuncio è a tempo pieno', annuncio.employmentType === 'FULL_TIME');
prova('l’annuncio cita l’ente per @id', annuncio.hiringOrganization['@id'] === ente['@id']);
prova('nessuna retribuzione semplificata in un numero solo',
  !('baseSalary' in annuncio),
  'la retribuzione si dichiara come intervallo con livello CCNL, nel testo');

/* -------------------------------------------------------- il risultato - */

if (errori) {
  console.error(`\n✗ Dati strutturati: ${errori} regole violate su ${prove} controlli.`);
  process.exit(1);
}
console.log(`✓ Dati strutturati: ${prove} controlli, tutte le regole rispettate.`);
