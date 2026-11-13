const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 480 } }); const errs = [];
  const open = async (tag) => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(tag + ' ' + e.message + ' ' + (e.stack || '').split('\n')[1])); await p.goto('http://localhost:8765/game/all-ultimo-strano.html?broker=local'); await p.waitForTimeout(3000); return p; };
  const A = await open('A'), B = await open('B');
  const toLobby = async (p, slot) => { await p.click('text=Online'); await p.waitForTimeout(400); await p.click('.slot[data-id=' + slot + ']'); await p.click('#go'); await p.waitForTimeout(400); await p.fill('#lobCode', ''); await p.click('#lobGo'); await p.waitForTimeout(600); };
  await toLobby(A, 'edo'); await toLobby(B, 'davidino');
  await A.click('#lobQuick'); await B.click('#lobQuick');
  await A.waitForFunction(() => App.match, null, { timeout: 20000 }).catch(() => errs.push('quick: nessuna partita'));
  console.log('host A', await A.evaluate(() => NET.host), 'host B', await B.evaluate(() => NET.host));
  const kill = async () => {
    await A.waitForFunction(() => App.match && App.match.phase === 'fight', null, { timeout: 40000 }).catch(async () => { errs.push('no fight'); });
    for (let i = 0; i < 3; i++) { await A.evaluate(() => { const M = App.match; const h = NET.host ? 1 : 0; }); }
    for (let r = 0; r < 4 && (await A.evaluate(() => App.match && App.match.phase !== 'outro' && App.match.phase !== 'done')); r++) {
      await A.waitForFunction(() => App.match.phase === 'fight', null, { timeout: 20000 }).catch(() => {});
      const H = (await A.evaluate(() => NET.host)) ? A : B;
      await H.evaluate(() => { const M = App.match; M.f[1].hp = 2; M.f[0].pos.set(M.f[1].pos.x - .9, 0, M.f[1].pos.z); });
      for (let i = 0; i < 8; i++) { await H.evaluate(() => { NET.remote.x = 1; Controls.pressed.RP = true; }); await H.waitForTimeout(300); } await H.evaluate(() => { NET.remote.x = 0; });
      await H.waitForTimeout(3500);
    }
  };
  // salta le introduzioni toccando
  for (let i = 0; i < 6; i++) { await A.mouse.click(450, 240); await B.mouse.click(450, 240); await A.waitForTimeout(600); }
  await kill();
  await A.waitForFunction(() => document.querySelector('#again'), null, { timeout: 40000 }).catch(() => errs.push('A nessun risultato'));
  await B.waitForFunction(() => document.querySelector('#again'), null, { timeout: 40000 }).catch(() => errs.push('B nessun risultato'));
  await A.screenshot({ path: process.argv[2] + 'resA.png' }); await B.screenshot({ path: process.argv[2] + 'resB.png' });
  const dbg = p => p.evaluate(() => ({ ph: App.match && App.match.phase, pt: App.match && App.match.pt, fr: App.match && App.match.frame, w: App.match && App.match.f.map(f => f.wins + '/' + f.hp + '/' + f.state), q: NET.queue.length, nf: NET.nextFrame, st: NET.state }));
  console.log('A', JSON.stringify(await dbg(A)), 'B', JSON.stringify(await dbg(B)));
  await A.click('#again'); await B.click('#again');
  await A.waitForFunction(() => App.match && App.match.frame > 5, null, { timeout: 20000 }).then(() => console.log('rivincita partita')).catch(() => errs.push('rivincita non partita'));
  await B.waitForTimeout(1500);
  // uscita di B: A deve tornare alla sala
  await B.evaluate(() => App.onlineMenu()); await B.click('#q'); await A.waitForTimeout(1500);
  console.log('A dopo uscita', await A.evaluate(() => ({ match: !!App.match, state: NET.state, lobby: !!document.querySelector('#lobby') })));
  console.log(errs.slice(0, 15).join('\n') || 'nessun errore'); await b.close();
})();
