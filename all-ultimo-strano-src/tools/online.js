const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 480 } }); const errs = [];
  const open = async (tag) => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(tag + ' ' + e.message + ' ' + (e.stack || '').split('\n')[1])); p.on('console', m => { if (m.type() === 'error') errs.push(tag + ' ' + m.text()); }); await p.goto('http://localhost:8765/game/all-ultimo-strano.html?broker=local'); await p.waitForTimeout(3000); return p; };
  const A = await open('A'), B = await open('B');
  const toLobby = async (p, slot, name) => { await p.click('text=Online'); await p.waitForTimeout(500); await p.click('.slot[data-id=' + slot + ']'); await p.waitForTimeout(300); await p.click('#go'); await p.waitForTimeout(500); await p.fill('#lobName', name); await p.fill('#lobCode', 'prova'); await p.click('#lobGo'); await p.waitForTimeout(800); };
  await toLobby(A, 'bruno', 'Giorgio'); await toLobby(B, 'gio', 'Amico');
  await A.waitForTimeout(2500); await A.screenshot({ path: process.argv[2] + 'lobbyA.png' });
  await A.click('#lobList [data-ch]'); await B.waitForTimeout(1000); await B.screenshot({ path: process.argv[2] + 'popB.png' });
  await B.click('#lobPop [data-a="1"]');
  await A.waitForTimeout(800); await A.screenshot({ path: process.argv[2] + 'vsA.png' });
  await A.waitForFunction(() => App.match && App.match.phase === 'fight', null, { timeout: 30000 }).catch(() => errs.push('A no fight'));
  for (let i = 0; i < 3 && !(await A.evaluate(() => App.match && App.match.phase === 'fight')); i++) { await A.mouse.click(450, 240); await B.mouse.click(450, 240); await A.waitForTimeout(800); }
  await A.waitForFunction(() => App.match && App.match.phase === 'fight', null, { timeout: 30000 }).catch(() => errs.push('A no fight 2'));
  await B.waitForFunction(() => App.match && App.match.phase === 'fight', null, { timeout: 30000 }).catch(() => errs.push('B no fight'));
  const seq = ['ArrowRight', 'KeyU', 'KeyI', 'KeyK', 'KeyJ', 'KeyO', 'ArrowLeft'];
  for (let i = 0; i < 40; i++) { const pg = i % 2 ? A : B; const k = seq[i % seq.length]; if (k.startsWith('Arrow')) { await pg.keyboard.down(k); await pg.waitForTimeout(250); await pg.keyboard.up(k); } else { await pg.keyboard.press(k); await pg.waitForTimeout(160); } }
  await A.waitForTimeout(1500);
  const st = p => p.evaluate(() => { const M = App.match; return { fr: M.frame, ph: M.phase, f: M.f.map(f => [f.pos.x.toFixed(3), f.pos.z.toFixed(3), f.hp, f.state, f.wins]) }; });
  const sa = await st(A), sb = await st(B); console.log('A', JSON.stringify(sa)); console.log('B', JSON.stringify(sb));
  await A.screenshot({ path: process.argv[2] + 'fightA.png' }); await B.screenshot({ path: process.argv[2] + 'fightB.png' });
  // chat
  await B.click('.chatbtn .cbtn'); await B.waitForTimeout(200); await B.click('.cpanel .qc'); await A.waitForTimeout(500); await A.screenshot({ path: process.argv[2] + 'chatA.png' });
  // fine incontro: l'host porta a KO l'altro
  await B.keyboard.down('ArrowLeft'); await A.keyboard.down('ArrowRight'); await A.waitForTimeout(1500); await A.keyboard.up('ArrowRight'); await B.keyboard.up('ArrowLeft');
  for (let i = 0; i < 25; i++) { await A.evaluate(() => { Controls.pressed[['LP','RP','RK','LK'][Math.floor(Math.random()*4)]] = true; }); await A.waitForTimeout(260); }
  console.log('scambio', JSON.stringify(await st(A)), JSON.stringify(await st(B)));
  await A.waitForTimeout(500); await A.screenshot({ path: process.argv[2] + 'hitA.png' }); await B.screenshot({ path: process.argv[2] + 'hitB.png' });
  console.log('dopo KO', JSON.stringify(await st(A)), JSON.stringify(await st(B)));
  console.log(errs.slice(0, 15).join('\n') || 'nessun errore');
  await b.close();
})();
