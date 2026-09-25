/**
 * Il contenuto delle sette schermate che mancavano.
 *
 * Mancavano perché nella prima anteprima avevo costruito sei pagine e due
 * delle quattro porte della home non portavano da nessuna parte. Un sito in
 * cui metà degli ingressi è finta non si può giudicare.
 *
 * Regole che valgono per tutti i testi qui dentro:
 *  · nessun importo, mai, tranne la retribuzione negli annunci di lavoro;
 *  · "Anteo Impresa Sociale" per esteso;
 *  · le sigle si sciolgono alla prima occorrenza;
 *  · fra parentesi quadre ciò che deve arrivare dal gestionale o dalla
 *    redazione: non si inventa.
 */
import { NUMERI } from './anteo.js';

/* ===================================================== LAVORA CON NOI === */
export const LAVORO = {
  occhiello: 'Lavora con noi',
  titolo: 'Qui non mancano i posti di lavoro. Mancano le persone.',
  intro:
    'Per questo diciamo prima quanto si guadagna, in che turni si lavora e in quanti giorni rispondiamo. Cerchiamo operatori socio-sanitari, infermieri, educatori, psicologi, fisioterapisti e coordinatori in 21 province.',
  promesse: [
    ['Retribuzione scritta nell’annuncio', 'Range, livello CCNL, indennità. Non «retribuzione commisurata all’esperienza».'],
    ['Risposta sempre, anche quando è no', 'Entro 24 ore ti richiamiamo. Entro 10 giorni sai l’esito, motivato.'],
    ['Formazione pagata, in orario', 'L’affiancamento dura settimane, non un pomeriggio.'],
    ['Dopo tre anni puoi diventare socio', 'Con quello che comporta — quota, diritti, responsabilità — spiegato prima e non dopo.'],
  ],
  professioni: [
    ['OSS', 'Operatore socio-sanitario', 'anziani', 'Il mestiere più richiesto e il più frainteso: non è assistenza generica, è la persona che conosce per nome chi assiste.'],
    ['IP', 'Infermiere', 'anziani', 'In RSA la responsabilità clinica è vera e l’autonomia pure. Turni su tre fasce, équipe stabile.'],
    ['EP', 'Educatore professionale', 'minori', 'Nelle comunità, nei centri diurni, nei servizi per l’autonomia. Si lavora su progetti, non su prestazioni.'],
    ['TeRP', 'Tecnico della riabilitazione psichiatrica', 'salute-mentale', 'Il nostro settore più grande. Si accompagna una persona a riprendersi la sua giornata.'],
    ['PSI', 'Psicologo', 'dipendenze', 'Comunità terapeutiche, servizi a bassa soglia, sostegno alle famiglie.'],
    ['COORD', 'Coordinatore di struttura', 'disabilita', 'Si entra quasi sempre dall’interno: la maggior parte dei nostri coordinatori ha cominciato in reparto.'],
  ],
  percorsi: {
    titolo: 'Se parti da zero',
    testo:
      'Tirocini, servizio civile, corso per operatore socio-sanitario con assunzione al superamento dell’esame, nelle sedi dove c’è posto. E una guida per chi arriva dall’estero e deve farsi riconoscere il titolo: è un bacino reale, e nessuno se ne occupa.',
  },
  amico: {
    titolo: 'Porta un amico',
    testo:
      'Il nostro reclutatore migliore è un operatore che si trova bene e ha un’amica che cerca lavoro. Segnali, e vedi a che punto è la sua candidatura.',
  },
  voce: {
    testo: '[CITAZIONE REALE DI CHI CI LAVORA — raccolta in intervista, non scritta dal marketing]',
    autore: '[NOME] · [QUALIFICA], [SEDE], da [N] anni',
  },
};

/* ================================================== ENTI E IMPRESE ====== */
export const ENTI = {
  occhiello: 'Per enti, imprese e stazioni appaltanti',
  titolo: 'I numeri dove servono, non sepolti nella pagina carriere.',
  intro:
    'Se state valutando Anteo Impresa Sociale per una gara, un affidamento o una coprogettazione, qui c’è quello che serve a una commissione: cosa sappiamo gestire, da quanto, con quali atti, e chi risponde entro quando.',
  capacita: [
    ['salute-mentale', 'Salute mentale', '47 sedi · dal [ANNO]', 'Comunità protette e socio-riabilitative, gruppi appartamento, centri diurni, riabilitazione lavorativa.'],
    ['anziani', 'Anziani', '36 sedi · 5.240 posti letto', 'RSA e case di riposo, nuclei Alzheimer, centri diurni, soggiorni di sollievo, domiciliarità.'],
    ['disabilita', 'Disabilità', '28 sedi · dal [ANNO]', 'RSD e RAF, centri socio-educativi e socio-terapeutici, progetti per il dopo di noi.'],
    ['minori', 'Infanzia e adolescenza', '13 sedi · 9 asili nido', 'Comunità educative, nidi e scuole dell’infanzia, doposcuola, centri estivi, tutela.'],
    ['dipendenze', 'Dipendenze', '8 sedi · rete Saman', 'Comunità terapeutiche residenziali e servizi a bassa soglia.'],
    ['sociale', 'Servizi sociali', '8 sedi', 'Accoglienza donne, inserimento lavorativo, sportelli, domiciliarità sociale.'],
  ],
  atti: {
    titolo: 'Autorizzazioni e accreditamenti',
    testo:
      'Estremi degli atti per ogni sede attiva, filtrabili per regione e tipologia. È lavoro di raccolta, non di sviluppo: esistono già, semplicemente oggi bisogna chiederveli.',
  },
  esiti: {
    titolo: 'Dati di esito',
    testo:
      'Pochi indicatori, veri, aggiornati. Pubblicarli in questo settore è raro, scomodo e rischioso: espone al confronto e ai periodi storti. È anche l’unica affermazione di qualità che non sia autoreferenziale, e l’unica che una stazione appaltante non può ignorare.',
    stato: 'Primi tre indicatori pubblicati entro [MESE ANNO].',
  },
  referente: {
    titolo: 'Gare e affidamenti',
    nome: '[NOME]',
    ruolo: 'Referente gare',
    contatti: '[TELEFONO DIRETTO] · [EMAIL]',
    impegno: 'Risposta entro 2 giorni lavorativi, anche solo per dire che non partecipiamo.',
  },
  identificativi: [
    ['Ragione sociale', 'Anteo Impresa Sociale — società cooperativa sociale'],
    ['Sede legale', 'Via Piacenza 11, 13900 Biella'],
    ['Partita IVA e codice fiscale', '[NUMERO]'],
    ['Iscrizione Albo cooperative', '[NUMERO], sezione [SEZIONE]'],
    ['PEC', '[INDIRIZZO PEC]'],
    ['Codice destinatario / SDI', '[CODICE]'],
  ],
  documenti: [
    'Bilancio sociale, navigabile e in PDF accessibile',
    'Amministrazione trasparente — contributi pubblici, legge 124/2017',
    'Certificazioni ISO e sistema di gestione',
    'Codice etico e modello organizzativo 231',
    'Certificazione della parità di genere',
    'Canale whistleblowing conforme al decreto 24/2023',
  ],
};

/* ======================================================= CHI SIAMO ====== */
export const CHI_SIAMO = {
  occhiello: 'Chi siamo',
  titolo: 'Una cooperativa in cui chi lavora può diventare proprietario.',
  intro:
    'Anteo Impresa Sociale è una cooperativa sociale: non ha azionisti da remunerare, e chi ci lavora dopo tre anni può chiedere di diventare socio. È la differenza che quasi nessuno vi spiega, e che cambia come si prendono le decisioni.',
  /* Gli stessi quattro numeri della home, nello stesso ordine e con le
     stesse etichette: vengono da lì, non si ricopiano. Vedi NUMERI in
     src/content/anteo.js. */
  numeri: NUMERI,
  storia: {
    titolo: 'Da dove veniamo',
    testo:
      '[LA STORIA, IN QUINDICI RIGHE — non un elenco di date: come si è passati da un servizio a 347, e che cosa si è imparato per strada. Va scritta da chi c’era.]',
  },
  governance: {
    titolo: 'Come si decide',
    testo:
      'Assemblea dei soci, consiglio di amministrazione, direzione. I verbali e le delibere che riguardano i soci stanno nell’area riservata; quelli dovuti per legge stanno in amministrazione trasparente.',
  },
  valori: [
    ['Le persone prima dei posti', 'Un posto letto occupato non è un obiettivo raggiunto. Se il servizio giusto non è nostro, lo diciamo.'],
    ['Nessun prezzo in vetrina', 'Di costi si parla di persona, con il caso davanti, prima di qualsiasi firma. Non è reticenza: è che un listino sarebbe un numero falso.'],
    ['Riservatezza come diritto, non come favore', 'Chi vive in un nostro gruppo appartamento ha diritto alla stessa privacy di chiunque altro sul proprio pianerottolo.'],
  ],
};

/* =================================================== PAGINA SETTORE ===== */
export const SETTORE = {
  codice: 'anziani',
  nome: 'Anziani',
  occhiello: 'Settore',
  titolo: 'Quando a casa non ce la si fa più.',
  intro:
    'Trentasei sedi fra RSA, case di riposo, nuclei Alzheimer, centri diurni e soggiorni brevi, per 5.240 posti letto in 21 province. Questa pagina serve a capire quale di queste cose serve davvero, prima di cercare un posto.',
  tipologie: [
    ['Residenza sanitaria (RSA)', 'Per chi non è più autosufficiente e ha bisogno di assistenza medica e infermieristica anche di notte.', '[N] sedi'],
    ['Casa di riposo', 'Per chi è ancora parzialmente autonomo ma non può stare solo. Meno sanitaria, più residenziale.', '[N] sedi'],
    ['Nucleo Alzheimer', 'Reparti protetti per le demenze, con personale formato e spazi pensati per il vagabondaggio.', '[N] sedi'],
    ['Centro diurno', 'Si va la mattina e si torna a casa la sera. Spesso è la cosa giusta prima della residenza.', '[N] sedi'],
    ['Soggiorno di sollievo', 'Da due settimane a due mesi, per dare respiro a chi assiste in famiglia.', '[N] sedi'],
  ],
  domanda: {
    titolo: 'La domanda che conviene farsi per prima',
    testo:
      'Non è «quale struttura», è «quanta assistenza serve». Se la persona si muove da sola e ha bisogno soprattutto di compagnia, una RSA è troppo: un centro diurno o l’assistenza a casa funzionano meglio, costano meno e la lasciano a casa sua. Se invece serve un infermiere di notte, il centro diurno non basta e rimandare la decisione la rende più dura.',
  },
  province: ['Biella', 'Vercelli', 'Torino', 'Novara', 'Alessandria', 'Milano', 'Monza e Brianza', 'Genova', 'Savona', 'Parma', 'Siena', '[ALTRE]'],
  guide: [
    ['Come si entra in una RSA', 'Documenti, valutazione, tempi reali di attesa.'],
    ['Cosa chiedere durante una visita', 'Quattordici domande che nessuno pensa di fare.'],
    ['Chi paga che cosa', 'Quota sanitaria, quota alberghiera, detrazioni, contributi regionali.'],
  ],
};

/* ================================================ PAGINA TERRITORIO ===== */
export const TERRITORIO = {
  settore: 'anziani',
  provincia: 'Torino',
  occhiello: 'Anziani · provincia di Torino',
  titolo: 'RSA e servizi per anziani in provincia di Torino',
  intro:
    '[N] sedi in provincia di Torino, fra residenze sanitarie, case di riposo e centri diurni. La disponibilità dei posti è quella che vedi accanto a ogni scheda, con la data in cui è stata aggiornata.',
  locale:
    '[PARAGRAFO LOCALE — come funziona l’accesso in questo territorio: quale UVG valuta, quali sono i tempi medi dell’ASL, se ci sono convenzioni comunali. Senza questo la pagina è un doppione generato e non si pubblica.]',
  sedi: [
    ['RSA Gran Torino', 'Residenza sanitaria · Torino', '120 posti letto', '[N] posti disponibili', 'libero'],
    ['Casa di riposo [NOME]', 'Casa di riposo · [COMUNE]', '[N] posti letto', 'Lista d’attesa', 'attesa'],
    ['Centro diurno [NOME]', 'Centro diurno · [COMUNE]', '[N] posti', '[N] posti disponibili', 'libero'],
    ['RSA [NOME]', 'Residenza sanitaria · [COMUNE]', '[N] posti letto', '[N] posti disponibili', 'libero'],
  ],
  vicino: ['Vercelli', 'Biella', 'Novara', 'Alessandria'],
};

/* ========================================================== GUIDA ======= */
export const GUIDA = {
  occhiello: 'Guida',
  titolo: 'Come si entra in una RSA',
  sommario:
    'Cosa serve, chi valuta, quanto si aspetta davvero. Vale in tutta Italia nelle linee generali; dove cambia da regione a regione lo diciamo.',
  aggiornata: 'Aggiornata il [DATA] · rivista ogni [N] mesi',
  passi: [
    ['La valutazione', 'Serve una valutazione che dica quanta assistenza occorre. La fa una commissione dell’ASL — in Piemonte si chiama UVG, Unità di valutazione geriatrica, altrove ha altri nomi. Si attiva tramite il medico di famiglia o i servizi sociali del Comune.'],
    ['Posto convenzionato o privato', 'Se il posto è convenzionato, una parte della retta la paga l’ASL e c’è una graduatoria. Se è privato si entra prima, ma paga tutto la famiglia. Quasi tutte le strutture hanno entrambi.'],
    ['I documenti', 'Documento d’identità, tessera sanitaria, verbale di invalidità se c’è, documentazione clinica recente, elenco dei farmaci. L’elenco completo lo diamo in una pagina sola.'],
    ['L’attesa', 'Sul convenzionato i tempi dipendono dalla graduatoria e non sono uguali fra territori: chiedete sempre il tempo medio reale, non quello teorico. Sul privato si entra in genere in pochi giorni.'],
    ['L’ingresso', 'I primi giorni sono i più delicati, per la persona e per chi resta a casa. Chiedete chi è il referente e se potete venire fuori dagli orari: la risposta dice molto della struttura.'],
  ],
  errori: {
    titolo: 'Tre errori che vediamo spesso',
    voci: [
      'Aspettare l’emergenza. La decisione presa in ospedale, di corsa, è quasi sempre peggiore di quella presa tre mesi prima.',
      'Guardare solo la retta. Due strutture con la stessa cifra possono avere un rapporto operatori-ospiti molto diverso: chiedetelo, e fatevelo dire in numeri.',
      'Non chiedere che succede se la persona peggiora. È la domanda che nessuno fa e quella che conta di più.',
    ],
  },
};

/* ====================================================== RICHIAMATA ====== */
export const RICHIAMATA = {
  occhiello: 'Parliamone',
  titolo: 'Ti richiamiamo noi',
  intro:
    'Lascia un recapito e la fascia oraria in cui ti fa comodo. Ti richiama una persona che conosce i servizi del tuo territorio, entro un giorno lavorativo.',
  campi: [
    ['nome', 'Il tuo nome', 'text', true, 'Serve solo per sapere come chiamarti.'],
    ['telefono', 'Telefono', 'tel', true, ''],
    ['fascia', 'Quando ti fa comodo', 'scelta', false, ''],
    ['bisogno', 'Di che cosa avresti bisogno', 'textarea', false, 'Anche due righe. Al nome tecnico ci pensiamo noi.'],
  ],
  fasce: ['Mattino', 'Pomeriggio', 'Sera', 'Indifferente'],
  consenso:
    'Ho letto l’informativa e acconsento al trattamento dei miei dati per essere ricontattato.',
  nota:
    'Quello che scrivi qui può riguardare la salute di una persona. Lo trattiamo come dato particolare ai sensi dell’articolo 9 del GDPR: lo vede solo chi ti richiama, non finisce in nessuno strumento di analisi, e si conserva per il tempo necessario e non oltre.',
  alternativa: {
    titolo: 'Se preferisci chiamare tu',
    testo: 'Numero verde 800 127 996, dal lunedì al venerdì dalle 9 alle 18. È gratuito anche da cellulare.',
  },
};
