// node play.js <out-prefix> "<js steps>"  -- apre il gioco in orizzontale e scatta foto
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errs = [];
  p.on('console', m => { const t = m.text(); if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + t); });
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  await p.goto(process.env.URL || 'http://localhost:8765/game/all-ultimo-strano.html');
  await p.waitForTimeout(2500);
  const shot = async n => { await p.screenshot({ path: process.argv[2] + n + '.png' }); };
  const fn = new Function('p', 'shot', 'return (async () => {' + process.argv[3] + '})()');
  try { await fn(p, shot); } catch (e) { errs.push('STEP: ' + e.message); }
  console.log(errs.slice(0, 20).join('\n') || 'nessun errore');
  await b.close();
})();
