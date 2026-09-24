/**
 * Il collegamento alla base dati.
 *
 * Gli schemi `erp`, `cms` e `sito` hanno RLS attiva SENZA nessuna policy:
 * chiusura totale, voluta. Non si legge nulla se non con la chiave di
 * servizio, e quella vive solo lato server — mai in una pagina, mai in una
 * variabile con prefisso PUBLIC_.
 *
 * Se un giorno qualcuno volesse leggere dal browser, la risposta non è
 * esportare la chiave: è aprire una policy per quella tabella e sapere
 * esattamente cosa si sta aprendo.
 */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const chiaveServizio = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const baseDatiConfigurata = Boolean(url && chiaveServizio);

/**
 * Client lato server. Da usare solo in frontmatter di pagina, endpoint o
 * script di build: mai in codice che finisce nel browser.
 */
export function client(schema: 'erp' | 'cms' | 'sito' = 'sito') {
  if (!baseDatiConfigurata) {
    throw new Error(
      'Base dati non configurata: mancano PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
  return createClient(url, chiaveServizio, {
    db: { schema },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * La vista che il sito legge davvero: la sede con i testi già ereditati
 * dalla tipologia e l'indirizzo oscurato dove non è pubblicabile.
 * Non si leggono le tabelle direttamente.
 */
export async function schedeSede() {
  if (!baseDatiConfigurata) return [];
  const { data, error } = await client('sito').from('scheda_sede').select('*');
  if (error) throw error;
  return data ?? [];
}
