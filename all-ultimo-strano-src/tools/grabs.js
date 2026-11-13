// fotogrammi di prese e braccio di ferro, da due angolazioni
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 480, height: 360 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForTimeout(3000);
  for (const [a, c, kind, frames] of JSON.parse(process.argv[3])) {
    await p.evaluate(([a, c, kind]) => { App.endMatch(); App.clearBackdrop(); App.setScreen(null); ARENA.build('quartello');
      const M = App.match = new Match({ mode: 'free', p1: { def: CHAR[a], costume: 0 }, p2: { def: CHAR[c], costume: 0 }, arena: 'quartello', cpu: [null, null] }); App.paused = true;
      M.phase = 'fight'; M.f[0].pos.set(-.5, 0, 0); M.f[1].pos.set(.5, 0, 0); for (let i = 0; i < 3; i++) { M.step([null, null]); M.render(1 / 60); }
      if (kind === 'grab') M.startThrow(M.f[0], M.f[1]); else { M.f[0].hp = 20; M.f[0].pos.set(-.8, 0, 0); M.f[1].pos.set(.8, 0, 0); M.step([{ x: 0, y: 0, p: { SP: 1 }, h: {} }, null]); }
      window.__k = 0; }, [a, c, kind]);
    for (const fr of frames) {
      await p.evaluate(fr => { const M = App.match; while (window.__k < fr) { M.step([null, null]); M.render(1 / 60); window.__k++; } M.hitstop = 0; for (let i = 0; i < 3; i++) M.render(1 / 60); }, fr);
      for (const [v, cp] of [['a', [0, 1.4, 3.2]], ['b', [2.6, 1.6, 1.6]]]) { await p.evaluate(cp => { const M = App.match; const mid = M.f[0].pos.clone().lerp(M.f[1].pos, .5); camera.position.set(mid.x + cp[0], cp[1], mid.z + cp[2]); camera.lookAt(mid.x, 1.1, mid.z); R.render(scene, camera); }, cp); await p.screenshot({ path: process.argv[2] + a + '_' + kind + '_' + String(fr).padStart(3, '0') + v + '.png' }); }
    }
  }
  console.log(errs.join('\n') || 'nessun errore'); await b.close();
})();
