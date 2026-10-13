KOTOBA OFFLINE - LICENZE, FONTI E ATTRIBUZIONI
Ultimo aggiornamento: 13 ottobre 2026

1. CODICE ORIGINALE DELL'APPLICAZIONE

Il codice software originale di Kotoba Offline, nella misura in cui i relativi
intestatari detengono i diritti necessari, e' distribuito con licenza MIT:
https://opensource.org/license/mit

Il testo della licenza e' disponibile nel file LICENSE del repository.
Copyright (c) 2026 naitsirc90.

La licenza MIT NON si estende automaticamente ai dizionari, ai dati lessicali,
ai metadati derivati da terzi, alle licenze di terzi o ad altre risorse sulle
quali l'autore di Kotoba non detenga i necessari diritti.

In particolare, i file in assets/data/ (vocabulary.json,
learning-priority.json e legacy-compat.json) contengono o possono incorporare
materiali rielaborati a partire da fonti soggette alle condizioni riportate
qui sotto. Non devono essere trattati come dati rilasciati integralmente
sotto MIT o CC0. Anche le eventuali risorse grafiche di terzi mantengono le
rispettive condizioni di utilizzo.

2. PRINCIPALI FONTI LESSICALI E DIDATTICHE

- FreeDict, dizionario italiano-giapponese (ita-jpn), release 2025.11.23.
  Fonte del corpus lessicale di base. Licenza riportata nelle attribuzioni
  del progetto: Creative Commons Attribution-ShareAlike 3.0 Unported
  (CC BY-SA 3.0).
  https://freedict.org/
  https://freedict.org/downloads/index.html
  https://creativecommons.org/licenses/by-sa/3.0/

- JMdict / EDRDG (Electronic Dictionary Research and Development Group;
  James W. Breen), usato per la verifica delle forme giapponesi, delle
  letture e di altri metadati. Licenza dichiarata attualmente da EDRDG:
  Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0),
  con ulteriori condizioni di attribuzione e aggiornamento nella licenza
  del progetto.
  https://www.edrdg.org/edrdg/licence.html
  https://creativecommons.org/licenses/by-sa/4.0/

- JmdictFurigana, risorsa derivata da JMdict utilizzata nella lavorazione
  delle letture. Eventuali dati incorporati conservano gli obblighi
  applicabili della fonte e dell'opera derivata.
  https://github.com/Doublevil/JmdictFurigana

- Japanese WordNet / Open Multilingual Wordnet (NICT), utilizzato per
  confronti e controlli semantici. Si applica la licenza specifica NICT,
  conservata in licenses/JAPANESE_WORDNET_NICT_LICENSE.txt; non e'
  coperto automaticamente dalla MIT del codice.

- MultiWordNet italiano, utilizzato per controlli semantici.
  Licenza: Creative Commons Attribution 3.0 Unported (CC BY 3.0).
  Si conserva la citazione della fonte e la relativa licenza in
  licenses/MULTIWORDNET_IT_CC_BY_3.0.txt.
  https://creativecommons.org/licenses/by/3.0/

- Dati indicativi dei livelli JLPT: Jonathan Waller (CC BY 4.0),
  con rielaborazioni e distribuzione tramite stephenmk/yomitan-jlpt-vocab
  (CC BY-SA 4.0), secondo gli avvisi presenti in licenses/JLPT_DATA.txt.
  https://github.com/stephenmk/yomitan-jlpt-vocab

- Wiktionary in italiano e giapponese e' stato consultato durante alcune
  verifiche editoriali. La consultazione non implica automaticamente
  l'incorporazione dei suoi contenuti. Qualora contenuti protetti di
  Wiktionary vengano riutilizzati nei dati pubblicati, devono essere
  rispettate le relative condizioni e attribuzioni (in particolare
  CC BY-SA 4.0 per i contenuti ai quali essa si applica).
  https://it.wiktionary.org/
  https://ja.wiktionary.org/

3. ELABORAZIONI E DATI DISTRIBUITI

Le voci sono state filtrate, normalizzate, riclassificate e integrate con
metadati didattici (argomenti, livelli JLPT indicativi, priorita' di studio,
associazioni e identificativi storici). Tali elaborazioni non eliminano i
diritti e gli obblighi relativi ai materiali originali.

Non viene dichiarata una singola licenza MIT, CC0 o CC BY-SA per l'intero
corpus composito. La liceita' della redistribuzione delle singole porzioni
rielaborate dipende dalle fonti effettivamente incorporate e dalle loro
licenze, comprese eventuali condizioni ShareAlike. Chi redistribuisce o
modifica il corpus deve verificare le licenze pertinenti e conservare
attribuzioni, avvisi di modifica e testi di licenza ove richiesti.

4. DOCUMENTAZIONE E CREDITI DISPONIBILI

Il repository contiene altri dettagli e avvisi nella cartella licenses/,
fra cui:
- KOTOBA_3_1_6_SOURCES_AND_ATTRIBUTIONS.txt
- LEXICAL_SOURCES_2.7.6.txt
- JLPT_DATA.txt
- JAPANESE_WORDNET_NICT_LICENSE.txt
- MULTIWORDNET_IT_CC_BY_3.0.txt
- KOTOBA_3_1_7_PRIORITY_SOURCE_NOTE.txt

Le attribuzioni sono consultabili anche nell'app, nella sezione
Impostazioni > Informazioni e dati.

5. AGGIORNAMENTO DELLE FONTI

Le condizioni EDRDG richiedono una procedura di aggiornamento regolare dei
dati derivati da JMdict; per i servizi di dizionario via web indicano,
a titolo di esempio, aggiornamenti almeno mensili. L'uso di versioni
congelate richiede quindi una verifica periodica delle condizioni e delle
fonti. Questo documento non attesta, da solo, il rispetto di tutti gli
obblighi di licenza.

Per segnalazioni relative a diritti, attribuzioni o fonti, utilizzare le
Issues del repository: https://github.com/naitsirc90/kotoba/issues
