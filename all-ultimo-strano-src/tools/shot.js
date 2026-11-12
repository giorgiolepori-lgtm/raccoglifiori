// usage: node shot.js out.png "<js to run in page (async)>"
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 900, height: 600 } });
  p.on('console', m => { if (!m.text().includes('TGA loader')) console.log('[page]', m.text()); }); p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto(process.argv[4] || 'http://localhost:8765/build/viewer.html');
  const r = await p.evaluate(`(async()=>{ ${process.argv[3]} })()`);
  if (r) console.log(typeof r === 'string' ? r : JSON.stringify(r, null, 1));
  await p.waitForTimeout(1500);
  await p.evaluate('window.render && render()');
  await p.screenshot({ path: process.argv[2] });
  await b.close();
})();
