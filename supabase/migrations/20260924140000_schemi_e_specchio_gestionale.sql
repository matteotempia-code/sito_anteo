-- migrazione 01 — schemi e specchio del gestionale
-- =====================================================================
-- Nuovo sito di Anteo Impresa Sociale — schema della base dati
-- Progetto Supabase: sito-anteo (vvrnabzkncbggpragcvq), eu-west-1
-- Applicato in tre migrazioni il 24 settembre 2026.
--
-- REGOLA ARCHITETTURALE: i FATTI stanno nel gestionale, le PAROLE nel CMS.
-- Lo schema "erp" e' uno SPECCHIO in sola lettura del gestionale: nessuno
-- lo modifica a mano, nemmeno un amministratore. Se un dato e' sbagliato
-- si corregge alla fonte e il sincronizzatore lo riporta qui.
--
-- REGOLA DI PRODOTTO: nessun importo, nessuna retta, nessun listino
-- compare da nessuna parte in questo schema. Di soldi si parla di persona.
-- L'unica cifra pubblicata e' la retribuzione negli annunci di lavoro.
--
-- RLS attiva su tutte le tabelle SENZA policy: chiusura totale, voluta.
-- Il sito legge lato server con la chiave di servizio; il browser non parla
-- mai ne' con la base dati ne' con il gestionale.
-- =====================================================================


create schema if not exists erp;
comment on schema erp is
  'Specchio in sola lettura del gestionale. Popolato dal sincronizzatore. Mai scritto a mano.';

create schema if not exists cms;
comment on schema cms is 'I testi redazionali. Le parole, non i fatti.';

create schema if not exists sito;
comment on schema sito is 'Dati di esercizio del sito: ricerche, richiamate, reindirizzamenti, eventi.';

create type erp.settore as enum (
  'salute-mentale', 'anziani', 'disabilita', 'minori', 'dipendenze', 'sociale'
);
create type erp.esito_sync as enum ('ok', 'parziale', 'errore');

create table erp.tassonomia (
  codice        text primary key,
  tipo          text not null check (tipo in ('settore','tipologia','qualifica','provincia','regione')),
  etichetta     text not null,
  settore       erp.settore,
  ordine        integer not null default 0,
  attiva        boolean not null default true,
  aggiornato_il timestamptz not null default now()
);
create index on erp.tassonomia (tipo, ordine);

create table erp.sede (
  id_gestionale           text primary key,
  denominazione           text not null,
  comune                  text not null,
  provincia               text not null,
  regione                 text not null,
  cap                     text,
  indirizzo               text,
  indirizzo_pubblicabile  boolean not null default false,
  latitudine              numeric(9,6),
  longitudine             numeric(9,6),
  telefono                text,
  email                   text,
  direttore_nome          text,
  direttore_foto_url      text,
  consenso_pubblicazione  boolean not null default false,
  consenso_foto           boolean not null default false,
  attiva                  boolean not null default true,
  aggiornato_il           timestamptz not null default now(),
  letto_il                timestamptz not null default now(),
  etag                    text
);
-- indirizzo_pubblicabile: falso per gruppi appartamento in condominio, case di
-- accoglienza e ogni tipologia dove la riservatezza protegge le persone. Quando
-- e' falso, indirizzo/lat/lon non vengono nemmeno restituiti dal gestionale.
-- consenso_foto: distinto dal consenso alla pubblicazione del nome. Due consensi
-- separati, mai uno solo.
create index on erp.sede (provincia) where attiva;
create index on erp.sede (regione) where attiva;

create table erp.servizio (
  id_gestionale          text primary key,
  sede_id                text not null references erp.sede(id_gestionale) on delete restrict,
  tipologia_codice       text not null references erp.tassonomia(codice) on delete restrict,
  settore                erp.settore not null,
  denominazione          text not null,
  posti_autorizzati      integer check (posti_autorizzati >= 0),
  autorizzazione_estremi text,
  autorizzazione_data    date,
  accreditato            boolean not null default false,
  ente_committente       text,
  accesso_diretto        boolean not null default true,
  attivo                 boolean not null default true,
  aggiornato_il          timestamptz not null default now(),
  letto_il               timestamptz not null default now()
);
-- accesso_diretto: falso per comunita' psichiatriche, terapeutiche e per minori:
-- si entra tramite il servizio pubblico inviante, non chiamando noi.
create index on erp.servizio (sede_id);
create index on erp.servizio (settore, tipologia_codice) where attivo;

create table erp.disponibilita (
  servizio_id   text primary key references erp.servizio(id_gestionale) on delete cascade,
  posti_liberi  integer check (posti_liberi >= 0),
  fascia        text check (fascia in ('nessuno','pochi','alcuni','molti')),
  attendibile   boolean not null default true,
  letto_il      timestamptz not null default now()
);
-- posti_liberi nullo quando il numero esatto non e' affidabile: in quel caso si
-- pubblica la fascia, mai un numero inventato.

create table erp.personale (
  id_gestionale          text primary key,
  sede_id                text references erp.sede(id_gestionale) on delete cascade,
  nome                   text,
  ruolo                  text,
  qualifica_codice       text references erp.tassonomia(codice),
  foto_url               text,
  consenso_pubblicazione boolean not null default false,
  consenso_foto          boolean not null default false,
  aggiornato_il          timestamptz not null default now()
);
create index on erp.personale (sede_id);

create table erp.sync_log (
  id            bigint generated always as identity primary key,
  risorsa       text not null,
  iniziato_il   timestamptz not null default now(),
  finito_il     timestamptz,
  esito         erp.esito_sync,
  record_letti  integer,
  etag          text,
  messaggio     text
);
create index on erp.sync_log (risorsa, iniziato_il desc);

alter table erp.tassonomia    enable row level security;
alter table erp.sede          enable row level security;
alter table erp.servizio      enable row level security;
alter table erp.disponibilita enable row level security;
alter table erp.personale     enable row level security;
alter table erp.sync_log      enable row level security;
