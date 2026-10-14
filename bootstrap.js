/* Kotoba 3.1.11 - HTTPS PWA boot, no runtime AI or external server calls. */
(() => {
  document.body.classList.add('kotoba-web');
  const status=(message)=>{
    const app=document.querySelector('#app');
    if(app)app.innerHTML='<div class="fatal"><h2>Kotoba Offline</h2><p>'+String(message).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</p></div>';
  };
  const DB_NAME='kotoba-pwa-progress-v1',STORE='kv';
  function openDb(){return new Promise((resolve,reject)=>{
    if(!window.indexedDB)return reject(new Error('IndexedDB non disponibile'));
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });}
  function get(db,key){return new Promise((resolve,reject)=>{
    const req=db.transaction(STORE,'readonly').objectStore(STORE).get(key);
    req.onsuccess=()=>resolve(req.result??null);req.onerror=()=>reject(req.error);
  });}
  function transact(db,mode,operation){return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
    try{operation(store);}catch(e){tx.abort();reject(e);return;}
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Transazione annullata'));
  });}
  const main=async()=>{
    status('Caricamento del dizionario e verifica dell’archivio offline…');
    let db;
    try{db=await openDb();}catch(e){throw new Error('Impossibile avviare l’archivio locale del browser: '+e.message);}
    let chain=Promise.resolve();
    const enqueue=(op)=>{chain=chain.catch(()=>{}).then(op);return chain;};
    window.__KOTOBA_IDB_API__={
      put:(key,value)=>enqueue(()=>transact(db,'readwrite',store=>store.put(value,key))),
      remove:(key)=>enqueue(()=>transact(db,'readwrite',store=>store.delete(key))),
      flush:()=>chain,
      importState:(backup,newState,newKana)=>enqueue(()=>transact(db,'readwrite',store=>{
        store.put(backup,'pre-import-backup');store.put(newState,'main');store.put(newKana,'kana');
      }))
    };
    // Existing PWA localStorage remains an optional one-time migration source.
    const previousMain=await get(db,'main'),previousKana=await get(db,'kana');
    if(previousMain)window.__KOTOBA_BOOT_MAIN__=JSON.stringify(previousMain);
    if(previousKana)window.__KOTOBA_BOOT_KANA__=JSON.stringify(previousKana);
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(e=>console.warn('SW registration failed:',e));
    }
    const paths=['./assets/data/vocabulary.json','./assets/data/learning-priority.json','./assets/data/legacy-compat.json'];
    const responses=await Promise.all(paths.map(p=>fetch(p,{cache:'default'})));
    if(responses.some(r=>!r.ok))throw new Error('Dati del dizionario non disponibili: apri una volta Kotoba online per completare l’installazione.');
    const data=await Promise.all(responses.map(r=>r.json()));
    window.__KOTOBA_VOCABULARY__=data[0];
    window.__KOTOBA_LEARNING_PRIORITY__=data[1];
    window.__KOTOBA_LEGACY_COMPAT__=data[2];
    const script=document.createElement('script');script.src='./app.js';script.defer=true;
    script.onerror=()=>status('Impossibile avviare l’app. Verifica la connessione e ricarica la pagina.');
    document.body.appendChild(script);
    navigator.storage?.persist?.().catch(()=>{});
  };
  main().catch(e=>{console.error(e);status(e.message||'Errore caricamento.');});
})();
