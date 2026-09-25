/**
 * Chi è Anteo Impresa Sociale, in breve.
 *
 * Erano i contenuti della home del prototipo, che in una prima riscrittura
 * avevo tolto senza sostituirli: il titolo che dice che cosa fate, il
 * paragrafo di identità, i numeri grandi, le descrizioni concrete dei
 * settori. Sono i pezzi che rendono la pagina vostra e non di chiunque
 * altro, quindi stanno in un file con un nome che si capisce.
 *
 * I numeri sono quelli dichiarati. Quando il sito sarà agganciato al
 * gestionale nessuno di questi andrà più scritto a mano, ed è anche
 * l'unico modo perché restino veri.
 */

export const CONTATTI = {
  claim: 'Servizi socio-sanitari ed educativi in 21 province',
  numeroVerde: '800 127 996',
  orari: 'lun-ven 9-18',
  indirizzo: 'Via Piacenza 11, 13900 Biella',
  telefono: '015 813401',
  email: 'anteo@gruppoanteo.it',
};

export const IDENTITA = {
  occhiello: 'Cooperativa sociale',
  // Gli spazi insecabili tengono insieme «347 servizi» e «21 province»:
  // un numero separato dalla sua unità a fine riga si legge male.
  titolo: 'Salute mentale, anziani, disabilità, dipendenze, infanzia. In 347\u00a0servizi, 21\u00a0province.',
  testo:
    'Aiutiamo 17.477 persone e le loro famiglie. Alcune ci cercano, altre le manda il servizio pubblico che le ha in carico, altre entrano da sole. Qui trovi in due minuti che cosa esiste vicino a te e chi ti risponde.',
  foto: '[FOTOGRAFIA REALE]',
  fotoDidascalia:
    'Professionisti di Anteo Impresa Sociale al lavoro. Mai immagini di repertorio: qui si decide la credibilità.',
};

/** I quattro numeri. Grandi, in Fraunces: è il gesto che vi rende riconoscibili. */
/**
 * I quattro numeri grandi. Stanno qui una volta sola perché compaiono in due
 * pagine: la home e «chi siamo». Prima erano due elenchi scritti a mano, con
 * lo stesso valore in ordine diverso e con due etichette diverse per la
 * stessa cosa — «persone assistite» di qua, «persone assistite in un anno»
 * di là. Chi legge non se ne accorge; chi decide di fidarsi, sì.
 *
 * «In un anno» è l'etichetta esatta ed è quella che resta, in tutte e due.
 */
export const NUMERI = [
  ['347', 'servizi attivi'],
  ['21', 'province, in 8 regioni'],
  ['17.477', 'persone assistite in un anno'],
  ['2.038', 'professionisti'],
];

/**
 * Le quattro porte. Ogni icona è disegnata a mano, in tratto, e prende il
 * colore dal contesto: niente icon font, e niente decorazioni che gli
 * assistenti vocali debbano leggere.
 */
export const PORTE = [
  {
    href: '/servizi',
    occhiello: 'Per me o per una persona a cui tengo',
    titolo: 'Cerco aiuto',
    testo:
      'Un genitore che non può più stare solo, un figlio in difficoltà, un posto al nido. Ti aiutiamo a capire che cosa esiste vicino a te.',
    azione: 'Trova un servizio',
    icona: 'cuore',
  },
  {
    href: '/invianti',
    occhiello: 'Lavoro in un servizio pubblico',
    titolo: 'Cerco un posto per un utente',
    testo:
      'Centri di salute mentale, servizi per le dipendenze (SerD), servizi sociali, tutela minori. Disponibilità aggiornata, requisiti di ammissione, referente clinico con il numero diretto.',
    azione: 'Area servizi invianti',
    icona: 'cartella',
  },
  {
    href: '/lavora-con-noi',
    occhiello: 'Cerco lavoro',
    titolo: 'Voglio lavorare con voi',
    testo:
      'OSS, infermieri, educatori, psicologi, coordinatori. Ogni annuncio dice sede, turni e retribuzione.',
    azione: 'Vedi le posizioni aperte',
    icona: 'persona',
  },
  {
    href: '/enti',
    occhiello: 'Rappresento un ente o un’impresa',
    titolo: 'Valuto Anteo Impresa Sociale',
    testo:
      'Gare, affidamenti, coprogettazione, partnership. Numeri, referenze, autorizzazioni e chi contattare.',
    azione: 'Come lavoriamo con la PA',
    icona: 'edificio',
  },
];

/** Sei settori. Le descrizioni portano numeri veri, non aggettivi. */
export const SETTORI = [
  {
    codice: 'salute-mentale',
    nome: 'Salute mentale',
    sedi: 47,
    testo:
      'Comunità, gruppi appartamento, centri diurni, riabilitazione lavorativa. Il nostro settore più grande.',
    accessoDiretto: false,
  },
  {
    codice: 'anziani',
    nome: 'Anziani',
    sedi: 36,
    testo: '[N] RSA, [N] case di riposo, [N] nuclei Alzheimer, [N] centri diurni, [N] soggiorni di sollievo. In tutto 5.240 posti.',
    accessoDiretto: true,
  },
  {
    codice: 'disabilita',
    nome: 'Disabilità',
    sedi: 28,
    testo: 'Comunità, RSD e RAF, centri diurni e socio-educativi, servizi per l’autonomia.',
    accessoDiretto: true,
  },
  {
    codice: 'minori',
    nome: 'Infanzia e adolescenza',
    sedi: 13,
    testo: '9 asili nido e scuole, comunità educative, doposcuola, centri estivi.',
    accessoDiretto: false,
  },
  {
    codice: 'dipendenze',
    nome: 'Dipendenze',
    sedi: 8,
    testo: 'Comunità terapeutiche e servizi a bassa soglia, dentro Saman, la rete storica delle comunità per le dipendenze. Si può entrare senza invio.',
    accessoDiretto: true,
  },
  {
    codice: 'sociale',
    nome: 'Servizi sociali territoriali',
    sedi: 8,
    testo: 'Accoglienza donne, domiciliarità, inserimento lavorativo, sportelli informativi.',
    accessoDiretto: true,
  },
];

export const NAVIGAZIONE = [
  ['/servizi', 'I servizi'],
  ['/invianti', 'Per i servizi invianti'],
  ['/lavora-con-noi', 'Lavora con noi'],
  ['/enti', 'Per enti e imprese'],
  ['/chi-siamo', 'Chi siamo'],
];

export const PIEDE = [
  {
    titolo: 'I servizi',
    voci: ['Salute mentale', 'Anziani', 'Disabilità', 'Infanzia e adolescenza', 'Dipendenze', 'Servizi sociali territoriali'],
  },
  {
    titolo: 'L’impresa',
    voci: ['Chi siamo', 'Bilancio sociale', 'Amministrazione trasparente', 'Certificazioni e modello 231', 'Whistleblowing'],
  },
  {
    titolo: 'Professionisti ed enti',
    voci: ['Area servizi invianti', 'Posizioni aperte', 'Diventare socio', 'Enti e gare', 'Area soci'],
  },
];
