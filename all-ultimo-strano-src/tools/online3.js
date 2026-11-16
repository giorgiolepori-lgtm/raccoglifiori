// prova online con perdita di messaggi: node online3.js <drop>
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 640, height: 360 } }); const errs = [];
  const url = 'http://localhost:8765/game/all-ultimo-strano.html?broker=local&drop=' + process.argv[2];
  const open = async tag => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(tag + ' ' + e.message)); await p.goto(url); await p.waitForFunction(() => !document.querySelector('#loading'), null, { timeout: 60000 }); return p; };
  const A = await open('A'), B = await open('B');
  const toLobby = async p => { await p.click('text=Online'); await p.waitForTimeout(300); await p.click('#go'); await p.waitForTimeout(300); await p.fill('#lobCode', 'prova'); await p.click('#lobGo'); await p.waitForTimeout(600); };
  await toLobby(A); await toLobby(B); await A.waitForTimeout(2500);
  await A.click('#lobList [data-ch]'); await B.waitForSelector('#lobPop [data-a="1"]', { timeout: 10000 }); await B.click('#lobPop [data-a="1"]');
  const st = p => p.evaluate(() => App.match ? App.match.phase + ' f' + App.match.frame + ' hp' + App.match.f.map(f => f.hp).join('/') + ' w' + App.match.f.map(f => f.wins).join('-') : 'nomatch');
  for (let i = 0; i < 14; i++) { for (const P of [A, B]) await P.evaluate(() => { App.tapped = true; Controls.pressed[['LP','RP','LK','RK'][Math.floor(Math.random()*4)]] = true; Controls.keys.ArrowRight = Math.random() < .5; }); await A.waitForTimeout(2500); console.log('t' + (i * 2.5 + 2.5) + 's  host ' + await st(A) + ' | invitato ' + await st(B)); }
  console.log(errs.join('\n') || 'nessun errore'); await b.close();
})();
