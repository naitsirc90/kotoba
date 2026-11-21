// Browser smoke test: 3.1.18 first install, full offline reload and IndexedDB continuity.
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const item=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
  const file=path.resolve(root,'.'+decodeURIComponent(item));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{
    const stat=fs.statSync(file);if(!stat.isFile())throw Error('directory');
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Service-Worker-Allowed':'/'});
    fs.createReadStream(file).pipe(res);
  }catch(e){res.writeHead(404);res.end('not found '+item);}
});
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/';
  let browser;
  try{
    browser=await chromium.launch({headless:true,args:['--no-sandbox']});
    const context=await browser.newContext({serviceWorkers:'allow'});
    const page=await context.newPage();
    page.on('pageerror',e=>console.error('page error',e.message));
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>window.__KOTOBA_VOCABULARY__?.entries?.length===24538,null,{timeout:120000});
    const before=await page.evaluate(async()=>{
      const ready=await Promise.race([navigator.serviceWorker.ready,new Promise((_,rej)=>setTimeout(()=>rej(Error('SW ready timeout')),120000))]);
      if(!ready.active)throw Error('No active service worker');
      await new Promise((resolve,reject)=>{
        if(navigator.serviceWorker.controller)resolve();
        else navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});
        setTimeout(()=>reject(Error('No service worker controller')),60000);
      });
      const keys=await caches.keys();
      const active=keys.find(k=>k.includes('3.1.18-jmdict-v3-20261121'));
      if(!active)throw Error('Expected 3.1.18 cache missing');
      const cache=await caches.open(active);
      const parts=Array.from({length:8},(_,i)=>'./assets/data/vocabulary-v318.gz.part'+String(i+1).padStart(2,'0'));
      const assets=['./','./app.js',...parts,'./licenses/KOTOBA_3_1_17_WIKTIONARY_REFERENCES.json','./licenses/LICENSE-CC-BY-SA-4.0.txt'];
      for(const file of assets){const r=await cache.match(file);if(!r||!r.ok)throw Error('Offline asset missing '+file);}
      const voc=window.__KOTOBA_VOCABULARY__;
      if(voc.meta?.jmdictEditorialAlignmentVersion!=='2026-11-21-V3')throw Error('JMdict V3 metadata missing');
      const db=await new Promise((ok,fail)=>{const req=indexedDB.open('kotoba-pwa-progress-v1',1);req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error)});
      await new Promise((ok,fail)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put({sample:42},'offline-test-marker');tx.oncomplete=ok;tx.onerror=()=>fail(tx.error);});
      db.close();
      return {assets:assets.length,senses:voc.entries.length,cache:active};
    });
    await context.setOffline(true);
    await page.reload({waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>window.__KOTOBA_VOCABULARY__?.entries?.length===24538,null,{timeout:120000});
    const after=await page.evaluate(async()=>{
      const r=await fetch('./licenses/KOTOBA_3_1_17_LIVELLI_ATTRIBUZIONI.txt');
      if(!r.ok)throw Error('Offline attribution not available');
      const db=await new Promise((ok,fail)=>{const req=indexedDB.open('kotoba-pwa-progress-v1',1);req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error)});
      const marker=await new Promise((ok,fail)=>{const req=db.transaction('kv','readonly').objectStore('kv').get('offline-test-marker');req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error);});
      db.close();return {senses:window.__KOTOBA_VOCABULARY__.entries.length,marker:marker?.sample};
    });
    assert.equal(after.senses,before.senses);
    assert.equal(after.marker,42,'IndexedDB progress did not survive offline reload');
    console.log('PASS Kotoba 3.1.18 offline/IndexedDB E2E',JSON.stringify({firstInstall:before,offline:after}));
    await context.close();
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(err=>{console.error(err);process.exitCode=1;server.close();});
