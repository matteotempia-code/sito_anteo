/**
 * I sei settori di Anteo Impresa Sociale.
 *
 * Questo file è l'unico posto dove i settori sono elencati. I codici
 * coincidono con il tipo `erp.settore` della base dati e con l'enum
 * `settore` della specifica OpenAPI del gestionale: se cambia uno,
 * cambiano tutti e tre insieme.
 *
 * Il conteggio delle SEDI è quello censito sul sito attuale (140 in tutto).
 * Il numero ufficiale dei SERVIZI è 347 e arriva dal gestionale: sono due
 * grandezze diverse e non vanno mai mescolate in una stessa frase.
 */

export const SETTORI = [
  {
    codice: 'salute-mentale',
    nome: 'Salute mentale',
    descrizione: 'Comunità, gruppi appartamento e centri diurni per chi attraversa un disturbo psichico.',
    sedi: 47,
    accessoDiretto: false,
  },
  {
    codice: 'anziani',
    nome: 'Anziani',
    descrizione: 'RSA, case di riposo, centri diurni e soggiorni di sollievo.',
    sedi: 36,
    accessoDiretto: true,
  },
  {
    codice: 'disabilita',
    nome: 'Disabilità',
    descrizione: 'Residenze, centri diurni e servizi educativi per persone con disabilità.',
    sedi: 28,
    accessoDiretto: true,
  },
  {
    codice: 'minori',
    nome: 'Minori e famiglie',
    descrizione: 'Comunità per minori, servizi educativi e sostegno alla genitorialità.',
    sedi: 13,
    accessoDiretto: false,
  },
  {
    codice: 'dipendenze',
    nome: 'Dipendenze',
    descrizione: 'Comunità terapeutiche e servizi a bassa soglia.',
    sedi: 8,
    accessoDiretto: false,
  },
  {
    codice: 'sociale',
    nome: 'Interventi sociali',
    descrizione: "Accoglienza, inclusione e servizi sul territorio.",
    sedi: 8,
    accessoDiretto: true,
  },
] as const;

export type CodiceSettore = (typeof SETTORI)[number]['codice'];

export function settore(codice: CodiceSettore) {
  const s = SETTORI.find((x) => x.codice === codice);
  if (!s) throw new Error(`Settore sconosciuto: ${codice}`);
  return s;
}

/** Le sedi censite: 140. I servizi, dal gestionale, sono 347. */
export const SEDI_TOTALI = SETTORI.reduce((n, s) => n + s.sedi, 0);

/** Dato ufficiale, dal gestionale. Non si scrive a mano altrove. */
export const SERVIZI_UFFICIALI = 347;
