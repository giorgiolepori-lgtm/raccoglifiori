const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 640, height: 360 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForTimeout(3000);
  for (const [w, l, kind, frames] of JSON.parse(process.argv[3])) {
    await p.evaluate(([w, l, kind]) => { App.endMatch(); App.clearBackdrop(); App.setScreen(null); const ar = CHAR[w].arenas[0]; ARENA.build(ar);
      const M = App.match = new Match({ mode: 'free', p1: { def: CHAR[w], costume: 0 }, p2: { def: CHAR[l], costume: 0 }, arena: ar, cpu: [null, null] }); App.paused = true;
      if (kind === 'intro') { M.phase = 'intro'; M.pt = 0; } else { M.winner = M.f[0]; M.phase = 'outro'; M.pt = 0; } window.__k = 0; }, [w, l, kind]);
    for (const fr of frames) {
      await p.evaluate((fr) => { const M = App.match; while (window.__k < fr) { M.step([null, null]); M.render(1 / 60); window.__k++; } for (let i = 0; i < 4; i++) M.render(1 / 60); R.render(scene, camera); }, fr);
      await p.screenshot({ path: process.argv[2] + w + '_' + kind + '_' + String(fr).padStart(4, '0') + '.png' });
    }
  }
  console.log(errs.slice(0, 10).join('\n') || 'nessun errore'); await b.close();
})();
