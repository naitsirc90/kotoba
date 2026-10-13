/* Kotoba offline-first: retain previous caches until the new package is complete. */
const VERSION='3.1.10-r1';
const CACHE='kotoba-shell-'+VERSION;
const ASSETS=[
 './','./index.html','./styles.css','./bootstrap.js','./app.js','./manifest.webmanifest',
 './assets/data/vocabulary.json','./assets/data/learning-priority.json','./assets/data/legacy-compat.json',
 './icons/icon-192.png','./icons/icon-512.png','./README-LICENSES.txt',
 './licenses/JAPANESE_WORDNET_NICT_LICENSE.txt','./licenses/JLPT_DATA.txt','./licenses/LEXICAL_SOURCES_2.7.6.txt',
 './licenses/MULTIWORDNET_IT_CC_BY_3.0.txt','./licenses/KOTOBA_3_1_6_SOURCES_AND_ATTRIBUTIONS.txt',
 './licenses/KOTOBA_3_1_7_PRIORITY_SOURCE_NOTE.txt','./licenses/KOTOBA_3_1_8_EXPERIENCE_NOTICE.txt'
];
self.addEventListener('install',event=>{
  // No skipWaiting: an update must never replace the files mid-session.
  event.waitUntil(caches.open(CACHE).then(async cache=>{await cache.addAll(ASSETS);}));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('kotoba-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
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
