/**
 * Il contenuto delle schermate dell'anteprima.
 *
 * Sono le schermate del prototipo, riscritte dove le tre revisioni avevano
 * trovato qualcosa. Vivono qui perché le usano sia le pagine del sito sia il
 * generatore dell'anteprima statica.
 *
 * Fra parentesi quadre c'è ciò che deve arrivare dal gestionale o dalla
 * redazione. Non si inventa.
 */

export const SETTORI = [
  ['salute-mentale', 'Salute mentale', 47, 'Comunità, gruppi appartamento e centri diurni per chi attraversa un disturbo psichico.', false],
  ['anziani', 'Anziani', 36, 'RSA, case di riposo, centri diurni e soggiorni di sollievo.', true],
  ['disabilita', 'Disabilità', 28, 'Residenze, centri diurni e servizi educativi per persone con disabilità.', true],
  ['minori', 'Minori e famiglie', 13, 'Comunità per minori, servizi educativi e sostegno alla genitorialità.', false],
  ['dipendenze', 'Dipendenze', 8, 'Comunità terapeutiche e servizi a bassa soglia.', false],
  ['sociale', 'Interventi sociali', 8, 'Accoglienza, inclusione e servizi sul territorio.', true],
];

export const PORTE = [
  ['Per una persona cara', 'Cerco un servizio', 'Racconta la situazione. Al nome tecnico ci pensiamo noi, e ti diciamo anche quando il servizio adatto non è nostro.'],
  ['Per i servizi invianti', 'Devo segnalare una persona', 'Requisiti, capienze, tipologie autorizzative e il referente di settore con il suo numero diretto.'],
  ['Per chi cerca lavoro', 'Cerco lavoro', 'Ogni annuncio dichiara la retribuzione, il livello CCNL e i tempi della selezione. Ti rispondiamo sempre.'],
  ['Per enti e imprese', 'Valuto Anteo Impresa Sociale', 'Numeri, autorizzazioni, accreditamenti, referenze e un referente per le gare con i tempi di risposta.'],
];

/**
 * Il blocco di sicurezza.
 *
 * Nel prototipo l'opzione «una donna che non è al sicuro» esisteva senza
 * niente dietro: nessun 1522, nessuna uscita rapida, nessun avviso sulla
 * cronologia, e l'unico recapito era un numero verde attivo 9-18. La
 * violenza domestica non ha orari d'ufficio. Offrire quel bottone senza la
 * catena di sicurezza è peggio che non offrirlo.
 */
export const SICUREZZA = {
  titolo: 'Sei in pericolo adesso?',
  righe: [
    ['112', 'emergenze, sempre'],
    ['1522', 'violenza e stalking: gratuito, 24 ore su 24, anche in chat'],
  ],
  avviso: 'Questa pagina resta nella cronologia del telefono.',
  uscita: 'Esci subito',
};

export const RICERCA = {
  titolo: 'Di chi stiamo parlando, e cosa succede?',
  intro: 'Rispondi come ti viene. Al nome tecnico del servizio ci pensiamo noi — e se quello che serve non è nostro, te lo diciamo.',
  passi: [
    {
      legenda: 'Passo 1 · Di chi stiamo parlando',
      opzioni: [
        'Un genitore o un nonno anziano',
        'Una persona con disabilità',
        'Qualcuno che attraversa un disturbo psichico',
        'Qualcuno con un problema di sostanze o gioco',
        'Un minore, o una famiglia in difficoltà',
        'Me stesso',
      ],
    },
    {
      legenda: 'Passo 2 · Cosa succede',
      opzioni: [
        'Non riesce più a stare a casa da solo',
        'A casa non ce la facciamo più',
        'Esce dall’ospedale e non può tornare a casa',
        'Serve qualcuno solo di giorno',
        'Non so ancora, vorrei capire',
      ],
    },
    { legenda: 'Passo 3 · Dove', opzioni: ['Provincia', 'Comune o CAP'] },
  ],
  nota: 'Nessuna opzione è preselezionata e la ricerca viaggia in POST: quello che scegli non finisce in un indirizzo web, in un referrer o in uno strumento di analisi. Sono dati che rivelano una condizione di salute.',
  azione: 'Mostra i servizi',
  esito: '[N] servizi in [PROVINCIA]',
};

export const GRUPPO = {
  tipologia: 'Gruppo appartamento · salute mentale',
  nome: 'Gruppo Appartamento Le Betulle',
  dove: 'Vercelli · 5 posti',
  riservatezza: {
    titolo: 'L’indirizzo lo diamo su appuntamento',
    testo: 'Chi vive qui ha diritto alla stessa riservatezza di chiunque altro sul proprio pianerottolo: nessuno deve sapere dal citofono che cosa sta attraversando. Il Comune, l’ASL e il CSM sanno esattamente dove siamo, e l’autorizzazione è pubblica.',
  },
  accesso: {
    titolo: 'Non si entra scrivendo a noi',
    testo: 'L’inserimento lo propone il Centro di salute mentale che ha in carico la persona. Se stai cercando per un familiare, il primo passo è parlare con il CSM del vostro territorio — e possiamo spiegarti come si fa.',
  },
  cosa: 'Cinque persone vivono in un appartamento come un altro, con gli operatori presenti in alcune fasce della giornata. Si fa la spesa, si cucina, si va al lavoro o al centro diurno. L’obiettivo è che ciascuno recuperi la sua autonomia, ai suoi tempi.',
  equipe: 'Psichiatra, psicologo, educatori professionali e tecnici della riabilitazione psichiatrica — i TeRP, che sono gli operatori che seguono la persona nelle attività di tutti i giorni.',
  progetto: 'Ogni persona ha un progetto scritto, concordato con il CSM e rivisto insieme a lei. In sigla si chiama PTRP: è il documento che dice a che cosa si sta lavorando, con quali tempi e chi fa che cosa.',
  costi: {
    titolo: 'Chi paga',
    testo: 'Per questa tipologia la retta è quasi sempre a carico dell’ASL, tramite il Centro di salute mentale. Alla famiglia in genere non viene chiesto nulla, ma dipende dalla situazione e dal territorio: te lo diciamo con precisione quando ci parliamo.',
  },
};

export const INVIANTI = {
  titolo: 'Per i servizi invianti',
  intro: 'Per 47 strutture di salute mentale, per le dipendenze e per buona parte di disabilità e minori, chi sceglie non è la famiglia: è l’operatore del CSM, del SerD o dei servizi sociali. Questa pagina è per lui.',
  impegni: [
    ['24 ore', 'per rispondere sulla disponibilità'],
    ['5 giorni', 'per fissare il colloquio di valutazione'],
    ['sempre', 'una risposta motivata, anche quando è no'],
  ],
  disponibilita: [
    ['Comunità protetta', 'Biella, Vercelli', '[N]'],
    ['Gruppo appartamento', 'Vercelli, Torino', '[N]'],
    ['Comunità terapeutica', 'Biella', '[N]'],
    ['Centro diurno', 'Torino', '[N]'],
  ],
  notaDisponibilita: 'Posti liberi per tipologia e provincia, senza dettaglio di sede e senza nessun dato di persona. Il dettaglio sta nell’area riservata, dove ogni ente vede soltanto i propri inseriti.',
  referenti: [
    ['Salute mentale', '[NOME]', '[TELEFONO DIRETTO]'],
    ['Dipendenze', '[NOME]', '[TELEFONO DIRETTO]'],
    ['Disabilità', '[NOME]', '[TELEFONO DIRETTO]'],
    ['Minori', '[NOME]', '[TELEFONO DIRETTO]'],
  ],
  procedure: 'Che cosa serve e a chi si manda, per ciascuno dei quattro settori. I moduli hanno una data di revisione visibile e un proprietario.',
};

export const ANNUNCIO = {
  ruolo: 'Operatore socio-sanitario (OSS)',
  dove: 'RSA Gran Torino · Torino',
  retribuzione: {
    range: '[RANGE] € lordi/mese',
    livello: 'CCNL Cooperative sociali, livello C1',
    extra: 'Indennità di turno e festivo, tredicesima, buoni pasto',
  },
  contratto: 'Tempo indeterminato, full time · turni su tre fasce',
  chiCerchiamo: 'Qualifica OSS. Se hai lavorato in RSA tanto meglio, ma formiamo anche chi arriva da altri contesti: l’affiancamento dura [N] settimane.',
  cosaFai: 'Igiene e mobilizzazione, aiuto ai pasti, accompagnamento nelle attività. Lavori in équipe con infermieri, fisioterapisti e educatori, e la persona che assisti la conosci per nome.',
  selezione: [
    ['Entro 3 giorni', 'ti richiamiamo, anche se la risposta è no'],
    ['Colloquio', 'con il direttore di struttura, in sede'],
    ['Entro 10 giorni', 'l’esito, sempre motivato'],
  ],
  socio: 'Dopo tre anni puoi chiedere di diventare socio della cooperativa. Cosa comporta e cosa si versa è spiegato prima, in una pagina dedicata.',
  candidatura: 'Nome, telefono, qualifica. Il curriculum è facoltativo: se ce l’hai lo carichi, altrimenti ne parliamo al colloquio.',
};
