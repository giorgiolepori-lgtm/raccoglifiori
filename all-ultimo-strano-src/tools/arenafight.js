// combattimento CPU vs CPU in ogni arena, foto dalla telecamera di gioco
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 960, height: 540 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8765/game/all-ultimo-strano.html'); await p.waitForTimeout(3000);
  const pairs = JSON.parse(process.argv[3]);
  for (const [a, c, ar, steps] of pairs) {
    await p.evaluate(([a, c, ar, steps]) => { App.endMatch(); App.clearBackdrop(); App.setScreen(null); ARENA.build(ar);
      const M = App.match = new Match({ mode: 'free', p1: { def: CHAR[a], costume: 0 }, p2: { def: CHAR[c], costume: 0 }, arena: ar, cpu: ['normale', 'normale'] });
      M.phase = 'fight'; M.pt = 0; for (let i = 0; i < steps; i++) { M.step([null, null]); if (i % 4 === 0) M.render(1 / 15); } for (let i = 0; i < 20; i++) M.render(1 / 60); R.render(scene, camera); }, [a, c, ar, steps]);
    await p.waitForTimeout(300); await p.screenshot({ path: process.argv[2] + ar + '_' + a + '.png' });
  }
  console.log(errs.slice(0, 10).join('\n') || 'nessun errore'); await b.close();
})();
