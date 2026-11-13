const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  const t0 = Date.now(); await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForFunction(() => !document.querySelector('#loading'), null, { timeout: 60000 }); console.log('caricamento ms', Date.now() - t0);
  const sh = n => p.screenshot({ path: process.argv[2] + n + '.png' });
  await sh('0title'); await p.tap('text=Battaglia libera'); await p.waitForTimeout(800);
  await p.tap('.slot[data-id=josto]'); await p.waitForTimeout(500); await p.tap('#cr'); await p.waitForTimeout(800); await sh('1sel');
  await p.tap('#go'); await p.waitForTimeout(800); await sh('2sel2');
  await p.evaluate(() => App.title()); await p.waitForTimeout(400); await p.tap('text=Online'); await p.waitForTimeout(500); await p.tap('#go'); await p.waitForTimeout(800); await sh('3lobby');
  for (const id of ['alex', 'zonco', 'bruno', 'edo', 'pet', 'josto', 'davidino', 'gio']) { await p.evaluate(id => { NET.ui = null; App.clearBackdrop(); App.ending(CHAR[id], 0); }, id); await p.waitForTimeout(1200); await sh('4end_' + id); }
  console.log(errs.join('\n') || 'nessun errore'); await b.close();
})();
