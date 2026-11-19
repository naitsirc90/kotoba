# KOTOBA — Manuale canonico: manutenzione JMdict e allineamento dei sensi
Aggiornato: 19 novembre 2026 · Applicabilità: versione canonica Drive con SHA-256 ZIP `113da4082bb22c0401f1df31f20f668a041826fd2a627cbbefec0c8162ee84de`.

## 1. Dove si trova la procedura mensile
- Repository: https://github.com/naitsirc90/kotoba
- Workflow: `.github/workflows/jmdict-monthly.yml`
- Esecuzioni manuali: https://github.com/naitsirc90/kotoba/actions/workflows/jmdict-monthly.yml
- Comando di ricostruzione di riserva: `scripts/reconstruct-jmdict-mirror.sh`
- Controllo di integrità: `scripts/check-jmdict-current.py`
- Pianificazione: giorno **1** di ogni mese, ore **06:10 UTC**. GitHub Actions può ritardare le attività pianificate.
- Il workflow usa solo le autorizzazioni GitHub `contents: read`, nessuna password o chiave Android.

### Come si esegue
1. Aprire **Actions → JMdict monthly upstream check (read-only) → Run workflow** dal branch `main`, oppure leggere l'esecuzione pianificata.
2. Se raggiungibile, il workflow scarica `JMdict_e.gz` da `https://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz`.
3. Se il download non riesce, ricostruisce JMdict **legacy** usando la base e tutte le patch giornaliere, in ordine, da `https://github.com/Jitendex/edrdg-dictionary-archive`. Il GZIP così ottenuto può avere hash binario diverso dall'originale pur contenendo lo stesso XML; perciò registrare **SHA-256 XML**, data e commit dell'archivio.
4. Il controllo verifica GZIP, unicità degli `ent_seq`, hash, conteggi e copertura del corpus pubblico. **Il workflow non modifica Kotoba, non aggiorna la release, non certifica gli obblighi di licenza.**
5. Per un aggiornamento effettivo del canonico aprire il notebook in **Google Drive personale** `KOTOBA-COLAB-MANUTENZIONE-CORRENTE.ipynb`, ID `1wR2ZpeAuhy8f-bfXuBcQvBfkI9VyxKWU`. Utilizzare soltanto il Drive personale, mai quello comunale/aziendale.
6. Rileggere i sei segmenti correnti secondo `KOTOBA-CANONICO-CORRENTE-PARTI.json`, confermare ogni SHA-256, SHA complessivo, CRC ZIP, `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, poi elaborare il **delta ent_seq**. Nessun aggiornamento automatizzato dei significati italiani.
7. Prima della distribuzione: verificare i dati/ID M2-M3 e i blocchi OP5C, contare i sensi idonei allo studio, eseguire QA PWA/Android, aggiornare note/attribuzioni e registrare fonte effettivamente applicata. L'APK va firmato esclusivamente con certificato originale. Non promuovere a release una semplice modifica del controllo sorgenti.

## 2. Stato di riferimento JMdict e 92 eccezioni
- Fonte del 18/11/2026: legacy JMdict_e ricostruito da Jitendex/EDRDG, **XML SHA-256** `02c51639a138cfd874683b368f651d2d5a4108bf0054712c63913f3b25eef2a0`.
- Nel canonico: `KOTOBA-CANONICO/04-DOCUMENTAZIONE/LICENZE-E-FONTI/JMDICT-STATO-CORRENTE.json`, tabelle `k_jmdict_*` e relativo script `KOTOBA-CANONICO/02-INDICI/aggiorna_jmdict.py`.
- Identità pertinenti: 17.405 voci/`ent_seq`, 26.967 sensi collegati.
- Esito della ricognizione: **26.875** sensi invariati; **92** eccezioni: 86 modifiche di contenuto, 2 spostamenti d'indice, 4 indici non più esistenti.
- I 92 casi **sono sensi già presenti nel canonico**, non 92 nuovi lemmi automaticamente aggiungibili.
- Un sorgente del 19/11/2026 è già risultato diverso: valutare il delta temporale **prima** della prossima release; non sostituire silenziosamente il riferimento del 18/11.

### Estrarre i 92 record reali senza modificare SQLite

Nel notebook Colab corrente eseguire prima **Fase 10A** (ricostruzione, hash e test del canonico Drive). Poi, in una cella:

```python
import urllib.request, subprocess, sys
src = 'https://raw.githubusercontent.com/naitsirc90/kotoba/main/scripts/review_jmdict_92.py'
review_script = ROOT_K / 'review_jmdict_92.py'
urllib.request.urlretrieve(src, review_script)
review_report = ROOT_K / 'JMDICT-92-RAPPORTO-REVISIONE-CORRENTE.json'
subprocess.run([
    sys.executable, str(review_script), '--db', str(db),
    '--source-sha', '02c51639a138cfd874683b368f651d2d5a4108bf0054712c63913f3b25eef2a0',
    '--include-editorial-context',  # dati IT/decisioni, solo nella sessione Colab personale
    '--out', str(review_report),
], check=True)
print('Rapporto locale dei 92 sensi:', review_report)
```

L'estrattore non modifica la copia locale né quella Drive: esporta per ciascuna riga la struttura reale, gli ID rintracciabili e le informazioni associate, senza dichiarare che tutti siano studiabili. Esaminare integralmente questo rapporto prima di applicare modifiche semantiche. Non caricarlo su repository pubblico se contiene dati editoriali non ancora divulgati.

### Esito del rapporto locale del 19 novembre 2026 (92/92)
Il rapporto `KOTOBA_JMDICT_92_REVIEW_V1` del 19 novembre ha identificato **92 ID univoci**, tutti già presenti nel canonico: **62 schede con `study_enabled=1` e 30 con `study_enabled=0`**. I flag esistenti non sono stati modificati. Per 29 dei 30 casi esclusi non compare copertura OP5C nel rapporto; il trentesimo (`jmdict-2815550-3`) presenta un gate esplicito di esclusione. **La presenza di un nuovo gloss JMdict non autorizza lo sblocco.**

| Categoria di triage (non equivale ad approvazione) | Casi | Già studiabili |
|---|---:|---:|
| Gloss modificato, richiede confronto semantico con italiano e vecchia fonte | 65 | 47 |
| Indice spostato o non disponibile: ricostruire ancoraggio di identità | 6 | 4 |
| Restrizione di lettura `stagr` cambiata | 2 | 0 |
| Solo riferimento `xref` o etimologia `lsource` modificati: **candidati** a riallineamento dei metadati sorgente | 8 | 5 |
| POS, registro, uso o dominio senza gloss modificato | 11 | 6 |
| **Totale** | **92** | **62** |

**Sei casi d'indice con priorità alta:** `jmdict-1050590-2`, `jmdict-1050590-3` (copia; non studiabili), `jmdict-1362640-8` (深い), `jmdict-1385900-4` e `jmdict-1385900-5` (折り返す), `jmdict-1397620-2` (組合). Gli ultimi quattro sono *già abilitati* ma hanno un riferimento storico non più rintracciabile all'indice corrente. Per `jmdict-1050590-3`, il nuovo hash del senso coincide con l'hash precedente di `jmdict-1050590-2`, indizio di rinumerazione da validare, **non** licenza di rinominare un ID stabile.

Il rapporto originale esportato non includeva il testo della traduzione italiana né il contenuto pre-update dei sensi JMdict, solo hash e nuova fonte. L'estrattore GitHub è stato corretto per leggere `comparison_status` reale (in precedenza tutti i record risultavano `UNCLASSIFIED`). L'opzione locale `--include-editorial-context` aggiunge `senses`, `decisions`, collegamenti a esempi e temi se disponibili. Il report viene **sovrascritto nello stesso percorso locale** e non va copiato sul repository pubblico; non è un archivio di backup.

I soli 8 candidati con variazioni `xref/lsource` possono essere verificati *a livello di metadato* senza ritraduzione, ma necessitano comunque di controllo della fonte precedente, coerenza degli ancoraggi e integrità. Le 65 variazioni di gloss non vanno certificate senza l'italiano revisionato e il vecchio gloss. Nessun cambio a `study_enabled`, ID stabili, esempio, livello o progressi è consentito sulla base del rapporto 92 da solo.

## 3. Criteri rigorosi per allineare i 92
1. Ricavare le 92 righe da `k_jmdict_change`, verificando che gli ID siano univoci e siano riferiti a `k_jmdict_current_sense` e a un'identità canonica.
2. Per ogni caso conservare: `canonical_id` immutato, `ent_seq`, indice sorgente precedente, indice corrente, parole/scritture, lettura (in hiragana), parti del discorso, gloss originale, gloss corrente, traduzione italiana revisionata, decisione editoriale e SHA delle evidenze.
3. **Spostamenti (2)**: assegnare il nuovo indice **solo** se la corrispondenza delle due accezioni è univoca e verificata per ent_seq, scritture, lettura, POS e significato. Non rinominare l'ID Kotoba quando l'ordine JMdict cambia.
4. **Indice non più presente (4)**: identificare se il significato è stato fuso, spostato o eliminato. Se non c'è corrispondenza univoca, mantenere il contenuto revisionato ma **non spacciarlo per un nuovo senso ufficiale JMdict**, né riattivare HOLD automatici.
5. **Contenuto modificato (86)**: classificare ciascun cambiamento come solo metadato/punteggiatura, sinonimi/raffinamento equivalente, oppure differenza semantica. La promozione automatica è consentita solo per equivalenza dimostrabile; gli altri vanno revisionati individualmente nella relazione giapponese–italiano.
6. Distinguere gli stati `ALLINEATO_AUTO_VERIFICATO`, `ALLINEATO_EDITORIALMENTE`, `SORGENTE_STORICO_NON_PIU_PRESENTE` e `REVISIONE_RICHIESTA`, con motivazioni. Non segnare un dubbio come risolto per raggiungere un conteggio.
7. **Studiabilità:** una fonte allineata non basta: mantenere tutte le condizioni esistenti (livello indicativo, gloss IT affidabile, lettura valida, esempi/quiz, direzione IT→JP/JP→IT, blocchi M3/OP5C e stati HOLD). Consentire il passaggio a `studyEnabled` solo se la scheda supera gli stessi gate degli altri sensi; altrimenti registrare il motivo di esclusione. L'app futura deve rileggere il canonico e non reimpostare i progressi di studio locali.
8. Proteggere chiavi e progressi: `kotoba-pwa-progress-v1` (IndexedDB), export/import JSON, package Android `it.kotoba.offline.full`. Nessuna modifica di ID per variazioni dei source sense index.
9. Operare **in transazione SQLite**, verificando prima/dopo count/ID/SHA dei dati protetti, le 68 esclusioni M3, assenza di foreign key errors, `PRAGMA integrity_check=ok` e identità delle traduzioni e decisioni non autorizzate.
10. Salvare nel **medesimo canonico corrente**, riscrivere i sei segmenti e il manifesto solo dopo verifiche complete e aggiornare una sola copia Libreria quando il servizio lo permette. Non generare archivi di checkpoint a lungo termine.

## 4. Licenze e artefatti
La licenza e le attribuzioni JMdict/EDRDG restano obbligatorie. Mantenere la distinzione tra fonti *consultate* e contenuti effettivamente *ridistribuiti*. La ricostruzione Jitendex è un mezzo tecnico di acquisizione, non una nuova licenza dei contenuti. Le icone dell'app sono state dichiarate generate con ChatGPT per Kotoba: documentarne la provenienza senza qualificare impropriamente gli output come pubblico dominio.

### Gate di rilascio
Il completamento del confronto e la registrazione dei 92 casi non implicano di per sé che tutti siano già studiabili o che la prossima release possa essere pubblicata. I criteri di idoneità didattica e di conformità distributiva devono risultare superati per ogni scheda attivata.
