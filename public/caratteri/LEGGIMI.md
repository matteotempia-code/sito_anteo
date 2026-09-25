# I caratteri

Questa cartella è vuota nel repository, ed è voluto.

Fraunces e Public Sans arrivano dai pacchetti npm `@fontsource-variable/*`,
dichiarati in `package.json`. Per metterli qui:

    npm install
    npm run caratteri

Lo script copia **solo il sottoinsieme latino** — i pacchetti contengono
anche cirillico, greco e vietnamita, circa 300 KB che nessun visitatore di
questo sito userà mai — insieme alle licenze SIL OFL, che vanno distribuite
con il carattere.

`npm run build` non parte se i file mancano. Non è pedanteria: senza i
`.woff2` il browser non protesta, ricade su Georgia e Arial e la pagina si
vede lo stesso — solo che non è più il sito. Nessun errore, nessuna
segnalazione, e ci si accorge del problema quando lo fa notare qualcuno da
fuori.

Perché auto-ospitati e non Google Fonts: un carattere caricato da un host
terzo fa partire una richiesta dal browser di chi legge verso un server che
non controlliamo, con il suo indirizzo IP e la pagina di provenienza. Su
questo sito la pagina di provenienza può essere `/servizi/dipendenze` o
`/servizi/salute-mentale`, e quel dato rivela una condizione di salute. Le
ragioni per esteso stanno in `src/styles/caratteri.css`.
