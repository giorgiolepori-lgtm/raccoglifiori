const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 640, height: 360 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForFunction(() => !document.querySelector('#loading'));
  const [a, c, ar] = JSON.parse(process.argv[3]);
  await p.evaluate(([a, c, ar]) => { App.clearBackdrop(); App.setScreen(null); ARENA.build(ar); const M = App.match = new Match({ mode: 'free', p1: { def: CHAR[a], costume: 0 }, p2: { def: CHAR[c], costume: 0 }, arena: ar, cpu: [null, null] }); App.paused = true;
    M.phase = 'fight'; M.f[0].pos.set(-.8, 0, 0); M.f[1].pos.set(.8, 0, 0); M.f[0].hp = 20; for (let i = 0; i < 3; i++) M.step([null, null]); M.step([{ x: 0, y: 0, p: { SP: 1 }, h: {} }, null]); }, [a, c, ar]);
  for (const t of JSON.parse(process.argv[4])) {
    await p.evaluate(t => { const M = App.match; while (!M.special || M.special.t < t) { M.step([null, null]); M.render(1 / 60); if (!M.special && M.f[0].state !== 'spStart') break; } for (let i = 0; i < 3; i++) { M.updateCamera(1 / 60); M.render(1 / 60); } R.render(scene, camera); }, t);
    await p.screenshot({ path: process.argv[2] + String(t).padStart(3, '0') + '.png' });
  }
  console.log(errs.join('\n') || 'nessun errore'); await b.close();
})();
