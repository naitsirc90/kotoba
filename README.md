# Kotoba Web

**Kotoba** è un'app gratuita per studiare il vocabolario giapponese e i sillabari, con esercizi personalizzati, ripasso dilazionato e progressi salvati sul dispositivo.

**Accesso:** Kotoba Web è disponibile tramite link diretto condiviso con le persone invitate.

Kotoba è una **Progressive Web App (PWA)**: può essere utilizzata dal browser e aggiunta alla schermata Home di smartphone e tablet. Dopo il primo caricamento completo, i contenuti dell'app possono essere utilizzati anche offline.

## Funzionalità

- Studio del vocabolario in entrambe le direzioni: **italiano → giapponese** e **giapponese → italiano**.
- Ripasso dilazionato (**SRS**) e livelli di padronanza indipendenti per le due direzioni.
- Sessione quotidiana personalizzabile per durata e bilanciamento tra nuovi vocaboli e ripassi.
- Studio libero con scelta del numero di esercizi e delle parole nuove, pausa e conclusione anticipata.
- Trainer **Hiragana e Katakana** con esercizi e riepilogo dei risultati.
- Argomenti e livelli **JLPT indicativi**, utili per organizzare lo studio ma non equivalenti a elenchi ufficiali dell'esame.
- **Esportazione e importazione manuale dei progressi** tramite file JSON, per trasferirli fra dispositivi compatibili. L'importazione segnala i conflitti che non possono essere risolti automaticamente senza rischiare di perdere dati.

## Installazione della PWA

### Android

1. Apri il link diretto di Kotoba Web in Chrome.
2. Apri il menu del browser e scegli **Installa app** o **Aggiungi a schermata Home**, secondo il dispositivo.
3. Avvia Kotoba dall'icona aggiunta.

### iPhone e iPad

1. Apri il link diretto di Kotoba Web in Safari.
2. Tocca **Condividi** e scegli **Aggiungi alla schermata Home**.
3. Apri Kotoba dalla nuova icona.

### Computer

Apri l'indirizzo web in un browser aggiornato. Nei browser che lo supportano puoi installare la PWA anche sul computer.

**Importante:** per utilizzare Kotoba offline occorre completare almeno una volta il caricamento del dizionario con una connessione Internet. Il supporto all'installazione e alla conservazione dei dati locali dipende dal browser e dal sistema operativo.

## Progressi e trasferimento dei dati

I progressi di studio vengono conservati **localmente sul dispositivo**. Kotoba Web non richiede un account e non sincronizza automaticamente i progressi con Google Drive o con un server.

Per passare a un altro dispositivo:

1. Apri **Impostazioni → Backup e trasferimento** e usa **Esporta progressi**.
2. Trasferisci il file JSON sull'altro dispositivo.
3. Apri Kotoba sul secondo dispositivo e usa **Importa progressi**.
4. Controlla il riepilogo delle modifiche e risolvi eventuali conflitti prima di confermare.

I progressi non vengono sincronizzati automaticamente fra browser o dispositivi diversi: per trasferirli occorre esportare e importare manualmente il file di backup. I browser possono eliminare i dati locali in alcune circostanze: **si consiglia di esportare periodicamente un backup**.

## Funzionamento e pubblicazione

Questa PWA è composta da file statici HTML, CSS, JavaScript e dati locali, pubblicati tramite **GitHub Pages**. Non è necessario un server applicativo o un database online dei progressi.

I file principali del repository sono:

- `index.html`, `styles.css`, `app.js`, `bootstrap.js`: interfaccia e logica dell'applicazione.
- `manifest.webmanifest`, `sw.js`, `icons/`: installazione PWA e gestione delle risorse offline.
- `assets/data/`: corpus didattico, priorità di apprendimento e dati di compatibilità.
- `licenses/`, `README-LICENSES.txt`: fonti, attribuzioni e condizioni di utilizzo.

Per pubblicare una copia su GitHub Pages, carica i file mantenendo questa struttura e configura **Settings → Pages → Deploy from a branch**, selezionando il ramo e la cartella che contengono `index.html`.

## Licenze e attribuzioni

Il **codice originale** di Kotoba, nella misura in cui i relativi titolari possiedono i diritti per distribuirlo, è rilasciato sotto **licenza MIT**: consulta [`LICENSE`](LICENSE).

**I dati lessicali non sono automaticamente sotto licenza MIT.** Il dizionario e alcuni metadati derivano da risorse di terzi, tra cui FreeDict, JMdict/EDRDG e altre fonti con licenze proprie. La distribuzione e il riutilizzo dei dati devono rispettare le relative condizioni, comprese attribuzione e condivisione delle elaborazioni ove previste.

Per i dettagli consulta [`README-LICENSES.txt`](README-LICENSES.txt) e la cartella [`licenses/`](licenses/). Le informazioni sulle fonti sono disponibili anche nell'app.

Kotoba è un progetto indipendente, non affiliato agli enti organizzatori del JLPT. Le attribuzioni ai progetti lessicali non implicano che questi approvino o sponsorizzino Kotoba.

## Segnalazioni e contributi

Puoi segnalare problemi, suggerire miglioramenti o indicare correzioni linguistiche tramite le [Issues di GitHub](https://github.com/naitsirc90/kotoba/issues).

Il progetto è in sviluppo: verifica di avere un backup recente dei progressi prima di sperimentare nuove versioni.
