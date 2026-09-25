/**
 * Contenuto della scheda di esempio: RSA Gran Torino.
 *
 * È lo stesso contenuto della schermata del prototipo, riscritto dove le
 * revisioni avevano trovato qualcosa da correggere. Vive in un file solo
 * perché lo usano due cose: la pagina vera del sito e l'anteprima statica
 * che serve a farla guardare senza avviare il progetto.
 *
 * Tutto ciò che sta fra parentesi quadre è un campo che deve arrivare dal
 * gestionale o dalla redazione. Non si inventa: un numero finto fa prendere
 * decisioni sbagliate.
 *
 * NOTA SUI COSTI. Rispetto al prototipo cambiano due cose, e sono entrambe
 * conseguenze di decisioni già prese.
 *  · Il link «Carta dei servizi: scarica il PDF» non c'è più. Quel documento
 *    contiene la retta, e sul sito pubblico di soldi non se ne parla: la
 *    carta si consegna al colloquio o su richiesta.
 *  · Il blocco sui costi dice CHI PAGA COSA senza dire QUANTO, e non dice
 *    più «contributi che quasi nessuno conosce per intero», che suonava
 *    condiscendente verso chi legge.
 */

export const scheda = {
  sede: 'rsa-gran-torino',
  settore: 'anziani',
  tipologia: 'Residenza sanitaria per anziani',
  nome: 'RSA Gran Torino',
  comune: 'Torino',
  provincia: 'TO',
  indirizzo: 'Strada San Mauro 158, Torino',
  indirizzoPubblicabile: true,
  postiLetto: 120,
  /**
   * La nostra guida «Come si entra in una RSA» dice ai familiari di
   * chiedere il rapporto fra operatori e ospiti e di farselo dire in
   * numeri. Una scheda che non lo dichiara rende quella guida un
   * autogol: insegna una domanda a cui poi rifiutiamo di rispondere.
   */
  rapportoGiorno: '[N]',
  rapportoNotte: '[N]',
  attesaMedia: '[N] giorni sul convenzionato · [N] sul privato',
  apertaNel: '[ANNO]',
  percorso: ['Home', 'Servizi', 'Anziani', 'Torino', 'RSA Gran Torino'],
  urlPercorso: ['/', '/servizi', '/servizi/anziani', '/servizi/anziani/torino'],

  disponibilita: {
    postiLiberi: null, // dal gestionale; nullo finché non arriva
    lettoIl: null,
    testoSegnaposto: '[N] posti disponibili',
  },

  galleria: {
    segnaposto: '[GALLERIA REALE — minimo 8 fotografie]',
    didascalia: 'camere, spazi comuni, giardino, sala da pranzo',
    nota:
      'Finché non ci sono le fotografie vere, qui non va una foto di repertorio: meglio un vuoto dichiarato che una casa che non è questa.',
  },

  perChi: {
    titolo: 'Per chi è, e per chi no',
    si:
      'Accogliamo persone anziane che non sono più autosufficienti e hanno bisogno di cure e di assistenza anche di notte. In struttura ci sono un medico, infermieri 24 ore su 24, fisioterapisti e operatori socio-sanitari.',
    no:
      'Non è il posto giusto se la persona si muove da sola e ha bisogno soprattutto di compagnia: in quel caso funzionano meglio un centro diurno o l’assistenza a casa, e possiamo indicarteli noi.',
  },

  /**
   * Prova della sostituzione: se una frase resta vera cambiando il nome
   * della struttura con quello di un'altra, non sta dicendo niente. «Una
   * giornata tipo» con sveglia, pranzo e cena la scrivono tutti uguale.
   *
   * Le righe qui sotto restano — le famiglie il ritmo lo vogliono sapere —
   * ma quello che le rende questa struttura e non un'altra sono tre
   * dettagli che ci sono già dentro: la sveglia non è a orario fisso, a
   * pranzo i familiari possono fermarsi, di notte c'è personale
   * infermieristico. Quella è la riga che va letta per prima.
   */
  giornataPremessa:
    'Il ritmo è quello di ogni residenza. Tre cose qui funzionano diversamente, e sono quelle su cui vale la pena farci domande: la sveglia non ha un orario fisso, a pranzo i familiari possono fermarsi, e di notte restano in servizio infermieri, non solo operatori.',

  giornata: [
    ['7:00', 'Sveglia con i tempi di ciascuno, igiene e colazione. Chi preferisce dormire, dorme.'],
    ['9:30', 'Fisioterapia, attività di gruppo, laboratori di memoria.'],
    ['12:30', 'Pranzo in sala. Menù stagionale, diete personalizzate, e i familiari possono fermarsi.'],
    ['15:00', 'Visite dei familiari, uscite in giardino, attività ricreative.'],
    ['19:00', 'Cena, poi serata libera. La notte restano infermiere e operatori.'],
  ],

  costi: {
    titolo: 'Di costi parliamo di persona',
    testo: [
      'Non pubblichiamo un listino, perché sarebbe un numero falso. Quanto si paga dipende da tre cose: quanta assistenza serve, se il posto è convenzionato con l’ASL o privato, e quali contributi spettano alla famiglia.',
      'La quota sanitaria è a carico dell’ASL. La quota alberghiera è della famiglia, e su quella esistono detrazioni fiscali e contributi regionali. La cifra esatta te la diamo scritta, voce per voce, entro 48 ore dalla visita: cosa comprende, cosa resta escluso, e quali domande possiamo aiutarti a presentare. Prima di qualsiasi firma, e senza impegno.',
    ],
    voci: [
      'Posti convenzionati con l’ASL',
      'Contributi regionali',
      'Detrazioni fiscali',
      'Aiuto con le pratiche',
    ],
  },

  ingresso: [
    ['Ci chiami', 'Raccontaci la situazione. Capiamo insieme se questa è la struttura adatta.'],
    ['Visiti la residenza', 'Con il direttore, negli orari che preferisci. Puoi venire più di una volta.'],
    [
      'Valutazione sanitaria',
      'Serve la documentazione medica. Se il posto è convenzionato valuta anche l’ASL: [TEMPI MEDI].',
    ],
    [
      'L’ingresso',
      'I primi giorni sono i più delicati: c’è un referente dedicato e puoi venire quando vuoi.',
    ],
  ],

  direttore: {
    nome: '[NOME DEL DIRETTORE]',
    ruolo: 'Direttore di struttura',
    dal: '[ANNO]',
    nota: 'Riceve i familiari su appuntamento, anche il sabato mattina.',
    foto: null, // solo con il consenso alla fotografia, distinto da quello al nome
  },

  autorizzazioni: [
    ['Autorizzazione al funzionamento', '[ESTREMI ATTO]'],
    ['Accreditamento', '[ESTREMI ATTO]'],
  ],

  cartaDeiServizi:
    'La carta dei servizi si consegna al colloquio o su richiesta: contiene le tariffe, e di quelle parliamo di persona.',

  telefono: {
    numero: '800 127 996',
    orari: 'lun-ven 9-18, chiamata gratuita',
  },

  visita: {
    titolo: 'Vieni a vedere',
    testo:
      'Il modo migliore per decidere è entrare. Ti richiamiamo entro un giorno lavorativo per fissare la visita.',
    impegno: 'un giorno lavorativo',
  },

  comeArrivare: ['Bus 56 e 77, fermata [NOME]', 'Parcheggio gratuito per i visitatori'],

  lavoro: 'In questa struttura cerchiamo [N] figure: OSS e infermieri, turni su tre fasce.',
};
