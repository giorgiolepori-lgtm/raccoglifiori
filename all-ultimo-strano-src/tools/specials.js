const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 640, height: 360 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1])); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForTimeout(3000);
  const list = JSON.parse(process.argv[3]); const shots = [];
  for (const [a, c, frames] of list) {
    await p.evaluate(([a, c]) => { App.endMatch(); App.clearBackdrop(); App.setScreen(null); const ar = CHAR[a].arenas[0]; ARENA.build(ar);
      const M = App.match = new Match({ mode: 'free', p1: { def: CHAR[a], costume: 0 }, p2: { def: CHAR[c], costume: 0 }, arena: ar, cpu: [null, null] });
      M.phase = 'fight'; M.f[0].pos.set(-.8, 0, 0); M.f[1].pos.set(.8, 0, 0); M.f[0].hp = 20; for (let i = 0; i < 5; i++) { M.step([null, null]); M.render(1 / 60); }
      M.step([{ x: 0, y: 0, p: { SP: 1 }, h: {} }, null]); window.__k = 0; }, [a, c]);
    for (const fr of frames) {
      await p.evaluate((fr) => { const M = App.match; while (window.__k < fr) { M.step([null, null]); M.render(1 / 60); window.__k++; } for (let i = 0; i < 3; i++) M.render(1 / 60); R.render(scene, camera); }, fr);
      const f = process.argv[2] + a + '_' + String(fr).padStart(3, '0') + '.png'; await p.screenshot({ path: f }); shots.push(f);
    }
  }
  console.log(errs.slice(0, 10).join('\n') || 'nessun errore'); await b.close();
})();
