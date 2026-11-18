// End-to-end smoke test for first-install + offline reboot and IndexedDB continuity.
const {chromium} = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const item=url.pathname.endsWith('/') ? url.pathname+'index.html' : url.pathname;
  const file=path.resolve(root,'.'+decodeURIComponent(item));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{
    const stat=fs.statSync(file);
    if(!stat.isFile())throw Error('directory');
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Service-Worker-Allowed':'/'});
    fs.createReadStream(file).pipe(res);
  }catch(e){res.writeHead(404);res.end('not found '+item);}
});
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/';
  let browser;
  try {
    browser=await chromium.launch({headless:true,args:['--no-sandbox']});
    const context=await browser.newContext({serviceWorkers:'allow'});
    const page=await context.newPage();
    page.on('pageerror',e=>console.error('page error',e.message));
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=> Boolean(window.__KOTOBA_VOCABULARY__?.entries?.length>10000),null,{timeout:120000});
    const before=await page.evaluate(async()=>{
      const ready=await Promise.race([navigator.serviceWorker.ready,new Promise((_,rej)=>setTimeout(()=>rej(Error('SW ready timeout')),120000))]);
      if(!ready.active)throw Error('No active SW');
      await navigator.serviceWorker.ready;
      await new Promise((resolve,reject)=>{if(navigator.serviceWorker.controller)resolve();else navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(()=>reject(Error('No controller')),60000)});
      const keys=await caches.keys();
      const active=keys.find(k=>k.includes('3.1.17-license-recovery-20261118'));
      if(!active)throw Error('Expected activated cache missing');
      const cache=await caches.open(active);
      const arr=['./','./app.js','./assets/data/vocabulary.json','./licenses/KOTOBA_3_1_17_WIKTIONARY_REFERENCES.json','./licenses/LICENSE-CC-BY-SA-4.0.txt'];
      for(const p of arr){const r=await cache.match(p);if(!r||!r.ok)throw Error('Required uncached asset '+p);}
      const db=await new Promise((ok,fail)=>{const req=indexedDB.open('kotoba-pwa-progress-v1',1);req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error)});
      await new Promise((ok,fail)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put({sample:42},'offline-test-marker');tx.oncomplete=ok;tx.onerror=()=>fail(tx.error);});
      db.close();
      return {assets:arr.length,senses:window.__KOTOBA_VOCABULARY__.entries.length,cache:active};
    });
    await context.setOffline(true);
    await page.reload({waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=> Boolean(window.__KOTOBA_VOCABULARY__?.entries?.length>10000),null,{timeout:120000});
    const after=await page.evaluate(async()=>{
      const license=await fetch('./licenses/KOTOBA_3_1_17_LIVELLI_ATTRIBUZIONI.txt');
      if(!license.ok)throw Error('License not served offline');
      const db=await new Promise((ok,fail)=>{const req=indexedDB.open('kotoba-pwa-progress-v1',1);req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error)});
      const record=await new Promise((ok,fail)=>{const req=db.transaction('kv','readonly').objectStore('kv').get('offline-test-marker');req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error);});
      db.close();
      return {senses:window.__KOTOBA_VOCABULARY__.entries.length,marker:record?.sample};
    });
    assert.equal(after.senses,before.senses);
    assert.equal(after.marker,42,'IndexedDB marker did not persist through offline reload');
    console.log('PASS browser offline E2E',JSON.stringify({firstInstall:before,offline:after}));
    await context.close();
  } finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(err=>{console.error(err);process.exitCode=1;server.close();});
