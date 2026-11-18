#!/usr/bin/env node
// Checks the *tracked* PWA deployment, never reads credentials or local user data.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sw = read('sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const scriptText = read('bootstrap.js');
const app = read('app.js');
assert.match(sw, /const ASSETS=\s*\[/);
const marker = sw.match(/const ASSETS=\s*(\[[\s\S]*?\]);/);
assert.ok(marker, 'Static ASSETS array not found');
const assets = JSON.parse(marker[1]);  // JSON array: no eval, no runtime code.
assert.ok(assets.includes('./'));
for (const asset of assets) {
  if (asset === './') continue;
  assert.ok(asset.startsWith('./') && !asset.includes('..'), 'Unsafe asset path: ' + asset);
  const file = path.join(root, asset);
  assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), 'Missing precache file: ' + asset);
  assert.ok(fs.statSync(file).size > 0, 'Empty precache file: ' + asset);
}
assert.equal(new Set(assets).size, assets.length, 'Duplicate ASSET entry');
for (const [label, item] of Object.entries({
  'index.html': './index.html', 'bootstrap.js': './bootstrap.js',
  'app.js': './app.js', 'vocabulary': './assets/data/vocabulary.json',
  'learning priority': './assets/data/learning-priority.json',
  'legacy compatibility': './assets/data/legacy-compat.json',
  'M3 safety': './assets/data/operational-eligibility.json'
})) assert.ok(assets.includes(item), 'Required shell dependency missing: ' + label);
for (const icon of manifest.icons || []) {
  assert.ok(fs.existsSync(path.join(root, icon.src)), 'Missing manifest icon: ' + icon.src);
  assert.ok(assets.includes(icon.src), 'Icon not precached: ' + icon.src);
}
assert.match(scriptText, /kotoba-pwa-progress-v1/, 'Persistence DB name changed!');
assert.match(app, /const KOTOBA_RELEASE = '3\.1\.17'/);
assert.ok(!sw.includes('skipWaiting('), 'Uncoordinated worker activation');
const voc = JSON.parse(read('assets/data/vocabulary.json'));
assert.ok(Array.isArray(voc.entries) && voc.entries.length > 10000, 'Unexpected vocabulary shape');
const ids = voc.entries.map(v => v.id);
assert.equal(new Set(ids).size, ids.length, 'Duplicate vocabulary IDs');
const priority = JSON.parse(read('assets/data/learning-priority.json'));
const eligibility = JSON.parse(read('assets/data/operational-eligibility.json'));
assert.equal(eligibility.schema, 'KOTOBA_M3_OP5C_OPERATIONAL_ELIGIBILITY_V1');
assert.equal(eligibility.blockedIdList.length, 68);
assert.equal(new Set(eligibility.blockedIdList).size, 68);
const byId = new Set(ids);
for (const id of eligibility.blockedIdList) assert.ok(byId.has(id), 'M3 ID missing from vocabulary: ' + id);
assert.ok(priority.scores && typeof priority.scores === 'object');
console.log('PASS static PWA preflight:', assets.length, 'offline assets,', ids.length, 'unique senses, 68 held IDs');
console.log('NOTE: browser offline install/update and IndexedDB continuity require runtime tests.');
