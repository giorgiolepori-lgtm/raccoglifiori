// Genera le mesh compatte dei personaggi: node avatars.js
const { chromium } = require('playwright'); const fs = require('fs');
const AV = { a01: 'Adults__Male_Adult_01__Export__Male_Adult_01', a04: 'Adults__Male_Adult_04__Export__Male_Adult_04', a06: 'Adults__Male_Adult_06__Export__Male_Adult_06', a07: 'Adults__Male_Adult_07__Export__Male_Adult_07',
  a09: 'Adults__Male_Adult_09__Export__Male_Adult_09', a10: 'Adults__Male_Adult_10__Export__Male_Adult_10', b06: 'Professions__Business_Male_06__Export__Business_Male_06', s02: 'Professions__Sports_Male_02__Export__Sports_Male_02' };
const LIST = JSON.parse(fs.readFileSync(__dirname + '/meshes.json', 'utf8'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://localhost:8765/build/viewer.html');
  const out = await p.evaluate(async ({ LIST, AV }) => {
    const cache = {}; const ex = async k => cache[k] || (cache[k] = extract(await loadFBX(AV[k])));
    const res = {};
    for (const [id, d] of Object.entries(LIST)) { const C = compose(await ex(d.body), d.head ? await ex(d.head) : null, d.opts || {}); res[id] = pack(C); }
    return res;
  }, { LIST, AV });
  fs.writeFileSync(__dirname + '/../build/out/meshes.json', JSON.stringify(out));
  for (const k in out) console.log(k, out[k].data.length, out[k].meta.n);
  await b.close();
})();
