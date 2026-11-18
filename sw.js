/* Kotoba offline-first: atomic pre-cache, keep previous active cache on failure. */
/* Staging fix for 3.1.17; not a public release. */
const VERSION='3.1.17-license-recovery-20261118';
const CACHE='kotoba-shell-'+VERSION;
const ASSETS=[
  "./",
  "./index.html",
  "./styles.css",
  "./desktop.css",
  "./bootstrap.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/data/vocabulary.json",
  "./assets/data/learning-priority.json",
  "./assets/data/legacy-compat.json",
  "./assets/data/operational-eligibility.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./README-LICENSES.txt",
  "./licenses/JAPANESE_WORDNET_NICT_LICENSE.txt",
  "./licenses/JLPT_DATA.txt",
  "./licenses/LEXICAL_SOURCES_2.7.6.txt",
  "./licenses/MULTIWORDNET_IT_CC_BY_3.0.txt",
  "./licenses/KOTOBA_3_1_6_SOURCES_AND_ATTRIBUTIONS.txt",
  "./licenses/KOTOBA_3_1_7_PRIORITY_SOURCE_NOTE.txt",
  "./licenses/KOTOBA_3_1_8_EXPERIENCE_NOTICE.txt",
  "./licenses/KOTOBA_3_1_9_PORTABILITY.txt",
  "./licenses/KOTOBA_3_1_17_M2_PROVA_SOURCES.txt",
  "./licenses/KOTOBA_3_1_17_WIKTIONARY_REFERENCES.json",
  "./licenses/KOTOBA_3_1_17_LIVELLI_ATTRIBUZIONI.txt",
  "./licenses/LICENSE-CC-BY-SA-4.0.txt"
]
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    try {
      await cache.addAll(ASSETS);
      for(const asset of ASSETS){
        if(!(await cache.match(asset))){
          throw new Error('Asset offline obbligatorio assente: '+asset);
        }
      }
    } catch(error) {
      await caches.delete(CACHE);
      throw error; // The previous active worker/cache stays intact.
    }
    // No skipWaiting: do not replace assets during an active study session.
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('kotoba-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const response=await cache.match(event.request,{ignoreSearch:true});
    if(response)return response;
    try{return await fetch(event.request);}catch(e){
      if(event.request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
      return Response.error();
    }
  })());
});
