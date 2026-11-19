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
