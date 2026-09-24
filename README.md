# Nuovo sito di Anteo Impresa Sociale

Astro + TypeScript. Le pagine sono contenuto, non applicazione: si generano in HTML e non
spediscono JavaScript se non dove serve davvero.

---

## Far partire il progetto su GitHub e Vercel

Tre passaggi, una volta sola. Da lì in poi ogni `git push` pubblica un'anteprima e ogni merge
sul ramo principale va in produzione.

### 1 · Il repository

Il progetto ha già un primo commit. Serve solo un repository vuoto su GitHub — **privato**, e
intestato ad Anteo Impresa Sociale, non a una persona — e poi:

```bash
git remote add origin git@github.com:<organizzazione>/sito-anteo.git
git push -u origin main
```

Il codice deve stare in un repository vostro dal primo giorno, e non deve contenere componenti
proprietari di un fornitore. Altrimenti fra tre anni cambiare fornitore costa quanto rifare il
sito — che è esattamente il punto in cui siete oggi.

### 2 · Vercel

Su Vercel: **Add New → Project → Import Git Repository**, si sceglie `sito-anteo`.

Vercel riconosce Astro da solo. `vercel.json` è già nel progetto e imposta la regione europea
(`fra1`) e le intestazioni di sicurezza: HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Frame-Options`.

### 3 · Le variabili d'ambiente

Nelle impostazioni del progetto Vercel, da `.env.example`:

| Variabile | Dove si trova | Note |
| --- | --- | --- |
| `PUBLIC_SUPABASE_URL` | già compilata in `.env.example` | progetto `sito-anteo`, eu-west-1 |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | pubblica |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **segreta**, tipo *Sensitive*, mai in una variabile `PUBLIC_` |
| `ERP_BASE_URL`, `ERP_TOKEN`, `ERP_WEBHOOK_SECRET` | dal gestionale | quando le API esisteranno |

Senza le variabili del gestionale il sito si costruisce lo stesso: il livello di lettura risponde
vuoto e lo dichiara, invece di rompersi.

---

## Comandi

```bash
npm install
npm run dev        # sviluppo in locale
npm run build      # produzione, in dist/
npm run verifica   # i due controlli qui sotto
```

### I due controlli

**`npm run verifica:contrasto`** ricalcola novanta coppie di colore a ogni modifica: testo su
fondo sopra 4,5:1, bordi di controllo sopra 3:1, in entrambi i temi. Se qualcuno schiarisce un
testo o scurisce un fondo, la verifica fallisce qui invece che in un audit fra sei mesi.

**`npm run verifica:token`** rifiuta ogni colore, corpo, raggio o spaziatura scritto a mano nei
componenti. Il prototipo aveva 26 corpi tipografici, 31 valori di spaziatura, 12 raggi e 49
colori su otto schermate: non era distrazione, era l'assenza di un controllo che dicesse di no.

Vanno messi nella pipeline di pubblicazione: una modifica che li fa fallire non deve arrivare in
produzione.

---

## Com'è fatto

```
src/
  styles/token.css      i token: colore, tipografia, spaziatura, raggi
  styles/base.css       gli elementi di base
  components/           Azione · Pillola · Scheda · Campo · Testata · Piede
  layouts/Base.astro    lo scheletro di ogni pagina
  lib/settori.ts        i sei settori, elencati una volta sola
  lib/supabase.ts       la base dati, solo lato server
  lib/gestionale.ts     la lettura dal gestionale
  pages/                index · sistema
scripts/                i due controlli, più il generatore della pagina del sistema
supabase/migrations/    lo schema, nelle tre migrazioni applicate
```

`/sistema` è la pagina che mostra il sistema a chi deve giudicarlo. Sta fuori dall'indice: non è
una pagina del sito, è uno strumento.

---

## Le regole che il codice fa rispettare

- **Nessun valore letterale nei componenti.** Colore, corpo, spaziatura e raggio vengono dai token.
- **Il colore significa settore**, in tutto il sito, e nient'altro. Il pubblico si distingue per
  posizione e forma, non per tinta.
- **Una sola navigazione**, identica ovunque, con l'area invianti sempre presente.
- **Nessun importo, da nessuna parte** sul sito pubblico. L'unica cifra pubblicata è la
  retribuzione negli annunci di lavoro.
- **Il browser non parla mai con il gestionale né con la base dati.** Tutto passa dal server.
- **La privacy è applicata alla fonte:** un indirizzo non pubblicabile non arriva, non arriva vuoto.
- **Anteo Impresa Sociale, per esteso, sempre.**

---

## Lo stato dei lavori

Il registro vivo delle 96 voci di sviluppo è la fonte di verità. Il documento
`stato-del-progetto.md`, fra i documenti del Progetto, tiene le decisioni prese e quelle ancora
aperte.
