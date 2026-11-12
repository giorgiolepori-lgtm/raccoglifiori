const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const d = devices['iPhone 13']; const ctx = await b.newContext({ ...d, viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForTimeout(3000);
  const shot = async n => p.screenshot({ path: process.argv[2] + n + '.png' });
  await shot('m1');
  await p.tap('text=Arcade'); await p.waitForTimeout(800); await shot('m2');
  await p.tap('#go'); await p.waitForTimeout(1200); await shot('m3');
  await p.tap('#go'); await p.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) { await p.tap('canvas', { position: { x: 420, y: 200 } }).catch(() => {}); await p.waitForTimeout(700); }
  await p.waitForFunction(() => App.match && App.match.phase === 'fight', null, { timeout: 25000 }).catch(e => errs.push('nofight'));
  await p.waitForTimeout(500);
  await p.evaluate(() => { App.match.f[0].hp = 20; });
  await p.waitForTimeout(300); await shot('m4');
  await p.tap('.b-lp'); await p.waitForTimeout(80); await p.tap('.b-rk'); await p.waitForTimeout(400); await shot('m5');
  await p.tap('.b-pause'); await p.waitForTimeout(300); await shot('m6');
  console.log(errs.join('\n') || 'nessun errore');
  await b.close();
})();
