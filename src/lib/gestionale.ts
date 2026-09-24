/**
 * Il livello di lettura del gestionale (voce F-030 del registro).
 *
 * Due principi, che sono decisioni e non dettagli tecnici.
 *
 * 1. IL BROWSER NON PARLA MAI COL GESTIONALE. Tutto passa da qui, lato
 *    server, in fase di costruzione delle pagine o dentro un endpoint. La
 *    chiave non finisce mai in una pagina.
 *
 * 2. LA PRIVACY È APPLICATA ALLA FONTE. Se un indirizzo non è pubblicabile,
 *    le coordinate NON ARRIVANO — non arrivano vuote. Se manca il consenso,
 *    il referente non compare. Un dato che non viaggia non può essere
 *    pubblicato per errore da una riga di codice sbagliata. Qui non si
 *    filtra niente: si controlla soltanto che il gestionale abbia filtrato.
 *
 * Il contratto completo sta in `anteo-erp-api.yaml`, fra i documenti di
 * progetto: otto risorse, due ambiti (`pubblico` e `partner`), letture
 * incrementali con `aggiornatoDopo` ed ETag, e una notifica firmata HMAC
 * quando la disponibilità cambia.
 *
 * Finché le API non esistono, questo modulo risponde con dati vuoti e lo
 * dichiara: il sito resta navigabile e nessuno scambia un segnaposto per un
 * dato vero.
 */

const BASE = import.meta.env.ERP_BASE_URL ?? '';
const TOKEN = import.meta.env.ERP_TOKEN ?? '';

export const gestionaleConfigurato = Boolean(BASE && TOKEN);

/** Quanto può essere vecchio un dato prima che si dichiari non aggiornato. */
export const SOGLIE_FRESCHEZZA = {
  /** L'anagrafica si legge una volta al giorno. */
  anagrafica: 24 * 60 * 60 * 1000,
  /** La disponibilità cambia di continuo: ogni 5-15 minuti. */
  disponibilita: 15 * 60 * 1000,
} as const;

export interface Sede {
  id: string;
  denominazione: string;
  comune: string;
  provincia: string;
  regione: string;
  /** Assente quando la sede non è pubblicabile. Non vuoto: assente. */
  indirizzo?: string;
  latitudine?: number;
  longitudine?: number;
  telefono?: string;
  email?: string;
  /** Assente senza consenso alla pubblicazione del nome. */
  direttoreNome?: string;
  /** Assente senza consenso alla fotografia, che è un consenso distinto. */
  direttoreFotoUrl?: string;
  aggiornatoIl: string;
}

export interface Disponibilita {
  servizioId: string;
  /** Nullo quando il gestionale non può garantirne l'attendibilità. */
  postiLiberi: number | null;
  fascia?: 'nessuno' | 'pochi' | 'alcuni' | 'molti';
  lettoIl: string;
}

interface EsitoLettura<T> {
  dati: T;
  /** Falso quando serviamo l'ultimo dato valido invece di uno fresco. */
  fresco: boolean;
  /** Presente quando il gestionale non ha risposto: il sito lo dichiara. */
  avviso?: string;
}

async function leggi<T>(percorso: string, vuoto: T): Promise<EsitoLettura<T>> {
  if (!gestionaleConfigurato) {
    return {
      dati: vuoto,
      fresco: false,
      avviso: 'Il collegamento al gestionale non è ancora configurato.',
    };
  }

  try {
    const risposta = await fetch(`${BASE}${percorso}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!risposta.ok) {
      // 403 e mai 404 quando un ente chiede dati non suoi: un 404
      // rivelerebbe l'esistenza della persona. Qui ci limitiamo a non
      // fidarci di nulla che non sia una risposta buona.
      return {
        dati: vuoto,
        fresco: false,
        avviso: `Il gestionale ha risposto ${risposta.status}.`,
      };
    }

    return { dati: (await risposta.json()) as T, fresco: true };
  } catch (errore) {
    // Degrado controllato (F-036): col gestionale spento il sito resta
    // navigabile e dice che il dato non è aggiornato, invece di mostrare
    // una pagina rotta o, peggio, un numero vecchio spacciato per fresco.
    return {
      dati: vuoto,
      fresco: false,
      avviso: 'Il gestionale non risponde: mostriamo l’ultimo dato disponibile.',
    };
  }
}

export const sedi = () => leggi<Sede[]>('/v1/sedi', []);
export const disponibilita = () => leggi<Disponibilita[]>('/v1/disponibilita', []);

/** Vero quando il dato va marcato come non aggiornato accanto alla cifra. */
export function scaduto(lettoIl: string, soglia: number): boolean {
  return Date.now() - new Date(lettoIl).getTime() > soglia;
}
