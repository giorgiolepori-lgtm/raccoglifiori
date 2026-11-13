'use strict';
/* ===== Applicazione: schermate, flusso di gioco, ciclo principale ===== */
const SAVE_KEY = 'aus_save';
const store = { get() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); } catch (e) { return {}; } }, set(o) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(Object.assign(this.get(), o))); } catch (e) { } } };
const PORTRAITS = {};

const App = {
  screen: null, match: null, paused: false, bg: null, prefs: Object.assign({ diff: 'normale', music: true }, store.get()),
  setScreen(node) { if (this.screen) this.screen.remove(); this.screen = node; if (node) UI.appendChild(node); },
  /* --- sfondo 3D dei menù: arena con i personaggi --- */
  menuBackdrop(arenaId, chars) {
    this.clearBackdrop(); ARENA.build(arenaId);
    const avs = chars.map((c, i) => { const a = new Avatar(c.id, c.cos || 0); scene.add(a.obj); a.obj.position.set(i ? 1.75 : .35, 0, 0); a.obj.rotation.y = i ? -Math.PI / 2 + .6 : Math.PI / 2 - .6; return { a, c, t: rand(0, 100) }; });
    this.bg = { avs, t: 0, arenaId };
  },
  clearBackdrop() { if (this.bg && this.bg.cleanup) this.bg.cleanup(); this.endFx = null; if (this.bg) { this.bg.avs.forEach(o => { scene.remove(o.a.obj); o.a.dispose(); }); } this.bg = null; },
  updateBackdrop(dt) {
    const B = this.bg; if (!B) return; B.t += dt;
    for (const o of B.avs) { o.t += dt * 60; const b = Math.sin(o.t * .09) * .012; const p = clonePose(GUARD); p.hip = [0, GUARD.hip[1] + b, 0]; p.lh = [GUARD.lh[0], GUARD.lh[1] + b * 1.4, GUARD.lh[2]]; p.rh = [GUARD.rh[0], GUARD.rh[1] + b * 1.4, GUARD.rh[2]]; if (o.pose) Object.assign(p, o.pose(o.t)); o.a.apply(p); o.a.tickFace(dt); }
    const cam = B.cam || ((t) => ({ pos: new V3(Math.sin(t * .08) * .5 + .3, 1.45, 4.1), look: new V3(.3, 1.1, 0) }));
    const c = cam(B.t); camera.position.copy(c.pos); camera.lookAt(c.look);
    if (B.shift) { const r = new V3().setFromMatrixColumn(camera.matrixWorld, 0), d = c.pos.distanceTo(c.look) * B.shift; camera.position.addScaledVector(r, d); camera.lookAt(c.look.clone().addScaledVector(r, d)); }
  },
  /* --- titolo --- */
  title() {
    this.endMatch(); Controls.hide(); AU.music('menu');
    this.menuBackdrop('capoterra', [CHAR.alex, CHAR.zonco]);
    const s = el(`<div id="title" class="screen"><div class="title-col">
      <h1 class="logo">All'ultimo <span>strano</span></h1>
      <p class="tagline">La classifica degli strani</p>
      <nav class="menu">
        <button class="mbtn" data-a="arcade">Arcade</button>
        <button class="mbtn" data-a="free">Battaglia libera</button>
        <button class="mbtn" data-a="online">Online</button>
        <button class="mbtn" data-a="opts">Opzioni</button>
      </nav></div></div>`);
    s.querySelectorAll('.mbtn').forEach(b => b.addEventListener('click', () => { AU.init(); AU.sfx('select'); const a = b.dataset.a; if (a === 'arcade') this.select('arcade'); else if (a === 'free') this.select('free'); else if (a === 'online') this.select('online'); else if (a === 'opts') this.options(); }));
    this.setScreen(s);
    const foot = el(`<div class="foot">${READY.length} di ${CHARS.length} personaggi pronti</div>`); s.appendChild(foot);
  },
  options() {
    const p = this.prefs;
    const s = el(`<div class="screen"><div class="card"><p class="kick">Opzioni</p><h2>Impostazioni</h2>
      <p class="lbl" style="text-align:left">Musica</p><div class="chips" style="justify-content:flex-start"><button class="chip" data-m="1">Sì</button><button class="chip" data-m="0">No</button></div>
      <p class="lbl" style="text-align:left">Difficoltà del computer</p><div class="chips" style="justify-content:flex-start">${Object.keys(DIFF).map(d => `<button class="chip" data-d="${d}">${d}</button>`).join('')}</div>
      <p style="font-size:15px;color:var(--ink-dim)">Comandi da tastiera: frecce o WASD per muoverti, U/I pugni sinistro/destro, J/K calci sinistro/destro, O presa, L speciale, Esc pausa. Tocco breve su/giù = passo laterale, su tenuto = salto, doppio avanti = scatto.</p>
      <div class="row"><button class="cta" id="ok">Fatto</button></div></div></div>`);
    const paint = () => { s.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('on', (b.dataset.m === '1') === p.music)); s.querySelectorAll('[data-d]').forEach(b => b.classList.toggle('on', b.dataset.d === p.diff)); };
    s.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { p.music = b.dataset.m === '1'; AU.musicOn = p.music; if (!p.music) AU.music(null); else { AU.cur = null; AU.music('menu'); } store.set({ music: p.music }); paint(); AU.sfx('move'); }));
    s.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { p.diff = b.dataset.d; store.set({ diff: p.diff }); paint(); AU.sfx('move'); }));
    s.querySelector('#ok').addEventListener('click', () => { AU.sfx('back'); this.title(); });
    paint(); this.setScreen(s);
  },
  /* --- selezione personaggi --- */
  select(mode) {
    const st = { mode, step: 'p1', p1: READY[0].id, p2: READY[1] ? READY[1].id : READY[0].id, cos1: 0, cos2: 0, arena: null, diff: this.prefs.diff };
    this.menuBackdrop('quartello', [CHAR[st.p1]]);
    const s = el(`<div id="select" class="screen">
      <div class="topbar"><button class="back" aria-label="Indietro">‹</button><h2 class="h1" id="selT"></h2></div>
      <div class="roster">${CHARS.map(c => `<button class="slot ${c.ready ? '' : 'locked'}" data-id="${c.id}" style="background-image:url(${PORTRAITS[c.id] || ''})"><span class="nm">${esc(c.name)}</span></button>`).join('')}</div>
      <div class="info"><h3 class="bigname" id="bn"></h3><p class="style" id="bs"></p>
        <div class="costume"><button class="arrow" id="cl" aria-label="Vestito precedente">‹</button><span id="cn"></span><button class="arrow" id="cr" aria-label="Vestito successivo">›</button></div>
        <div id="extra"></div>
        <button class="cta" id="go">Scegli</button></div></div>`);
    const bigname = s.querySelector('#bn'), bstyle = s.querySelector('#bs'), cname = s.querySelector('#cn'), extra = s.querySelector('#extra'), title = s.querySelector('#selT');
    const cur = () => st.step === 'p1' ? st.p1 : st.p2, curCos = () => st.step === 'p1' ? st.cos1 : st.cos2;
    const refreshModels = () => {
      const list = st.step === 'p1' ? [{ ...CHAR[st.p1], cos: st.cos1 }] : [{ ...CHAR[st.p1], cos: st.cos1 }, { ...CHAR[st.p2], cos: st.cos2 }];
      this.menuBackdrop(st.step === 'p1' ? 'quartello' : (st.arena || 'quartello'), list);
      if (list.length === 1) { const o = this.bg.avs[0]; o.a.obj.position.set(-.2, 0, 0); o.a.obj.rotation.y = .35; this.bg.cam = t => ({ pos: new V3(.75, 1.35, 2.7), look: new V3(.3, 1.05, 0) }); }
      else { this.bg.avs[0].a.obj.position.set(-.85, 0, 0); this.bg.avs[0].a.obj.rotation.y = Math.PI / 2 - .4; this.bg.avs[1].a.obj.position.set(.85, 0, 0); this.bg.avs[1].a.obj.rotation.y = -Math.PI / 2 + .4; this.bg.cam = t => ({ pos: new V3(.4, 1.4, 3.5), look: new V3(.4, 1.05, 0) }); }
    };
    const paint = () => {
      const c = CHAR[cur()];
      title.innerHTML = st.step === 'p1' ? 'Scegli il tuo <em>strano</em>' : 'Scegli l\'<em>avversario</em>';
      bigname.textContent = c.name; bstyle.textContent = c.styleName; cname.textContent = c.costumes[curCos()].name;
      s.querySelectorAll('.slot').forEach(b => { b.classList.toggle('sel', b.dataset.id === cur()); b.classList.toggle('cpu', st.step === 'p2' && b.dataset.id === st.p1 && st.p1 !== st.p2); });
      s.querySelector('#cl').style.visibility = s.querySelector('#cr').style.visibility = c.costumes.length > 1 ? 'visible' : 'hidden';
      if (st.step === 'p2') {
        const arenas = Object.keys(ARENAS);
        extra.innerHTML = `<p class="lbl">Arena</p><div class="chips">${arenas.map(a => `<button class="chip" data-ar="${a}">${ARENAS[a].name}</button>`).join('')}</div><p class="lbl">Computer</p><div class="chips">${Object.keys(DIFF).map(d => `<button class="chip" data-df="${d}">${d}</button>`).join('')}</div>`;
        extra.querySelectorAll('[data-ar]').forEach(b => { b.classList.toggle('on', b.dataset.ar === st.arena); b.onclick = () => { st.arena = b.dataset.ar; AU.sfx('move'); paint(); refreshModels(); }; });
        extra.querySelectorAll('[data-df]').forEach(b => { b.classList.toggle('on', b.dataset.df === st.diff); b.onclick = () => { st.diff = b.dataset.df; AU.sfx('move'); paint(); }; });
        s.querySelector('#go').textContent = 'Combatti!';
      } else if (mode === 'arcade') {
        extra.innerHTML = `<p class="lbl">Difficoltà</p><div class="chips">${Object.keys(DIFF).map(d => `<button class="chip" data-df="${d}">${d}</button>`).join('')}</div>`;
        extra.querySelectorAll('[data-df]').forEach(b => { b.classList.toggle('on', b.dataset.df === st.diff); b.onclick = () => { st.diff = b.dataset.df; AU.sfx('move'); paint(); }; });
        s.querySelector('#go').textContent = 'Inizia';
      } else { extra.innerHTML = ''; s.querySelector('#go').textContent = mode === 'online' ? 'Vai alla sala' : 'Scegli'; }
    };
    s.querySelectorAll('.slot').forEach(b => b.addEventListener('click', () => {
      const c = CHAR[b.dataset.id]; if (!c.ready) { toast(c.name + ' arriva presto'); AU.sfx('back'); return; }
      if (st.step === 'p1') { st.p1 = c.id; st.cos1 = 0; } else { st.p2 = c.id; st.cos2 = 0; if (!st.arenaPicked) st.arena = pick(c.arenas); }
      AU.sfx('move'); paint(); refreshModels();
    }));
    const cyc = d => { const c = CHAR[cur()], n = c.costumes.length; if (st.step === 'p1') st.cos1 = (st.cos1 + d + n) % n; else st.cos2 = (st.cos2 + d + n) % n; AU.sfx('move'); paint(); refreshModels(); };
    s.querySelector('#cl').addEventListener('click', () => cyc(-1)); s.querySelector('#cr').addEventListener('click', () => cyc(1));
    s.querySelector('.back').addEventListener('click', () => { AU.sfx('back'); if (st.step === 'p2') { st.step = 'p1'; paint(); refreshModels(); } else this.title(); });
    s.querySelector('#go').addEventListener('click', () => {
      AU.sfx('confirm');
      if (mode === 'arcade') { this.prefs.diff = st.diff; store.set({ diff: st.diff }); this.arcadeStart(st.p1, st.cos1, st.diff); return; }
      if (mode === 'online') { Lobby.open(st.p1, st.cos1); return; }
      if (st.step === 'p1') { st.step = 'p2'; if (st.p2 === st.p1 && READY.length > 1) st.p2 = READY.find(c => c.id !== st.p1).id; st.arena = pick(CHAR[st.p2].arenas); paint(); refreshModels(); return; }
      this.prefs.diff = st.diff; store.set({ diff: st.diff });
      const cfg = { mode: 'free', p1: { def: CHAR[st.p1], costume: st.cos1 }, p2: { def: CHAR[st.p2], costume: st.cos2 }, arena: st.arena, cpu: [null, st.diff] };
      this.lastFree = cfg; this.startMatch(cfg);
    });
    this.setScreen(s); paint(); refreshModels();
  },
  /* --- arcade --- */
  arcadeStart(id, cos, diff) {
    const opp = READY.filter(c => c.id !== id).map(c => c.id).sort(() => Math.random() - .5);
    this.arcade = { id, cos, diff, ladder: opp, idx: 0 };
    const c = CHAR[id];
    this.menuBackdrop(c.arenas[0], [{ ...c, cos }]); const o = this.bg.avs[0]; o.a.obj.position.set(0, 0, 0); o.a.obj.rotation.y = .2; this.bg.cam = t => ({ pos: new V3(.35, 1.5, 2.5), look: new V3(.75, 1.32, 0) });
    const s = el(`<div class="screen"><div class="card" style="left:auto;right:calc(16px + var(--safe-r));transform:translateY(-50%);width:min(56vw,520px)">
      <p class="kick">La classifica degli strani</p><h2>${esc(c.name)}</h2>
      <p>Gli strani hanno deciso di sfidarsi per il titolo di <b>più strano</b>. In palio c'è anche un premio in denaro.</p>
      <p style="color:var(--gold)">${esc(c.motive)}</p>
      <div class="ladder">${opp.map((o, i) => `<span class="${i === 0 ? 'now' : ''}">${esc(CHAR[o].name)} · ${esc(ARENAS[CHAR[o].arenas[0]].name)}</span>`).join('')}</div>
      <div class="row"><button class="cta ghost" id="no">Indietro</button><button class="cta" id="go">Combatti</button></div></div></div>`);
    s.querySelector('#no').addEventListener('click', () => { AU.sfx('back'); this.select('arcade'); });
    s.querySelector('#go').addEventListener('click', () => { AU.sfx('confirm'); this.arcadeNext(); });
    this.setScreen(s);
  },
  arcadeNext() {
    const A = this.arcade, opp = CHAR[A.ladder[A.idx]];
    const ar = opp.arenas[(A.arenaTurn = (A.arenaTurn || 0) + 1) % opp.arenas.length] || opp.arenas[0];
    const cfg = { mode: 'arcade', p1: { def: CHAR[A.id], costume: A.cos }, p2: { def: opp, costume: Math.floor(Math.random() * opp.costumes.length) }, arena: ar, cpu: [null, A.diff] };
    this.startMatch(cfg);
  },
  /* --- incontro --- */
  startMatch(cfg) {
    this.clearBackdrop(); this.setScreen(null); this.endMatch(); AU.music(null);
    const A = ARENAS[cfg.arena];
    // schermata di sfida: i due nomi e il luogo, con l'arena sullo sfondo
    ARENA.build(cfg.arena);
    const sg = ARENA.sign || [0, -7];
    this.bg = { avs: [], t: 0, cam: t => ({ pos: new V3(sg[0] - 2.2 + t * .5, 1.3, sg[1] + 9.5), look: new V3(sg[0] + t * .25, .55, sg[1]) }) };
    const label = cfg.mode === 'arcade' ? 'Arcade · incontro ' + (this.arcade.idx + 1) + ' di ' + this.arcade.ladder.length : cfg.mode === 'online' ? 'Online · ' + cfg.names.join(' contro ') : 'Battaglia libera';
    const vs = el(`<div id="vs"><div class="mode">${esc(label)}</div><div class="names"><span class="n">${esc(cfg.p1.def.name)}</span><span class="v">vs</span><span class="n r">${esc(cfg.p2.def.name)}</span></div>
      <div class="at"><small>Si combatte a</small><div class="place">${esc(A.name)}</div></div></div>`);
    document.body.appendChild(vs); AU.sfx('blade');
    setTimeout(() => {
      this.bg = null;
      cfg.onEnd = r => this.afterMatch(cfg, r);
      this.match = new Match(cfg); this.match.local = cfg.local || 0; Controls.show(); this.paused = false;
      if (cfg.mode === 'online') { this.match.online = true; ChatBtn.show(); if (NET.host) this.match.onStep = (n, ins) => NET.hostStep(this.match, n, ins); }
      vs.remove();
    }, 2300);
  },
  endMatch() { document.body.classList.remove('touch'); ChatBtn.hide(); if (this.match) { this.match.dispose(); this.match = null; HUD.hide(); Controls.hide(); } this.paused = false; if (this.pauseEl) { this.pauseEl.remove(); this.pauseEl = null; } },
  onlineMenu() {
    if (this.pauseEl) { this.pauseEl.remove(); this.pauseEl = null; return; }
    const s = this.pauseEl = el(`<div class="screen" style="z-index:20;background:rgba(0,0,0,.35)"><div class="card"><p class="kick">Online</p><h2>L'incontro continua</h2><p>Online non si può mettere in pausa.</p>
      <div class="row"><button class="cta ghost" id="q">Esci dall'incontro</button><button class="cta" id="c">Torna a combattere</button></div></div></div>`);
    s.querySelector('#c').addEventListener('click', () => this.onlineMenu());
    s.querySelector('#q').addEventListener('click', () => { NET.leaveRoom(); this.endMatch(); if (this.lobbyArgs) Lobby.open(...this.lobbyArgs); else this.title(); });
    UI.appendChild(s);
  },
  afterMatch(cfg, r) {
    const win = r.winner === (cfg.local || 0);
    if (cfg.mode === 'online') {
      Controls.hide(); NET.inMatch = false;
      const s = el(`<div class="screen"><div class="card"><p class="kick">Online</p><h2>${win ? 'Hai <em>vinto</em>!' : 'Hai <em>perso</em>'}</h2><p>${esc(cfg.names[0])} contro ${esc(cfg.names[1])}</p>
        <div class="row"><button class="cta ghost" id="q">Esci</button><button class="cta ghost" id="l">Sala d'attesa</button><button class="cta" id="again">Rivincita</button></div></div></div>`);
      s.querySelector('#q').addEventListener('click', () => { AU.sfx('back'); NET.disconnect(); this.title(); });
      s.querySelector('#l').addEventListener('click', () => { AU.sfx('back'); NET.leaveRoom(); this.endMatch(); Lobby.open(...this.lobbyArgs); });
      s.querySelector('#again').addEventListener('click', () => { AU.sfx('confirm'); NET.again = true; NET.sendRoom({ t: 'again' }); this.netAgain(); });
      this.setScreen(s); return;
    }
    const M = this.match; Controls.hide();
    if (cfg.mode === 'arcade') {
      const A = this.arcade;
      if (win) { A.idx++; if (A.idx >= A.ladder.length) { this.ending(CHAR[A.id], A.cos); return; } }
      const s = el(`<div class="screen"><div class="card"><p class="kick">Arcade</p><h2>${win ? 'Hai <em>vinto</em>!' : 'Hai <em>perso</em>'}</h2>
        <div class="ladder">${A.ladder.map((o, i) => `<span class="${i < A.idx ? 'done' : i === A.idx ? 'now' : ''}">${esc(CHAR[o].name)}</span>`).join('')}</div>
        <div class="row"><button class="cta ghost" id="q">Menù</button><button class="cta" id="n">${win ? 'Prossimo incontro' : 'Riprova'}</button></div></div></div>`);
      s.querySelector('#q').addEventListener('click', () => { AU.sfx('back'); this.title(); });
      s.querySelector('#n').addEventListener('click', () => { AU.sfx('confirm'); this.arcadeNext(); });
      this.setScreen(s);
    } else {
      const s = el(`<div class="screen"><div class="card"><p class="kick">Battaglia libera</p><h2>Vince <em>${esc(M.f[r.winner].def.name)}</em></h2>
        <div class="row"><button class="cta ghost" id="q">Menù</button><button class="cta ghost" id="c">Cambia</button><button class="cta" id="n">Rivincita</button></div></div></div>`);
      s.querySelector('#q').addEventListener('click', () => { AU.sfx('back'); this.title(); });
      s.querySelector('#c').addEventListener('click', () => { AU.sfx('back'); this.endMatch(); this.select('free'); });
      s.querySelector('#n').addEventListener('click', () => { AU.sfx('confirm'); this.startMatch(Object.assign({}, cfg)); });
      this.setScreen(s);
    }
  },
  /* --- finale del personaggio --- */
  ending(c, cos) {
    this.endMatch(); this.clearBackdrop(); AU.music('victory');
    ARENA.build(c.arenas[0]);
    const av = new Avatar(c.id, cos); scene.add(av.obj); av.obj.position.set(0, 0, 0); av.obj.rotation.y = .3;
    const props = new THREE.Group(); scene.add(props);
    const E = c.ending, SC = ENDINGS[E.scene](av, props);
    this.endFx = SC.fx || null;
    this.bg = { avs: [{ a: av, t: 0, pose: SC.pose }], t: 0, cam: SC.cam, shift: .45 };
    this.bg.cleanup = () => { scene.remove(props); };
    const s = el(`<div class="screen"><div class="card" style="left:auto;right:calc(16px + var(--safe-r));transform:translateY(-50%);width:min(52vw,480px)">
      <p class="kick">Finale · ${esc(c.name)}</p><h2>${esc(E.title)}</h2><p>${esc(E.text)}</p>
      <div class="row"><button class="cta" id="ok">Fine</button></div></div></div>`);
    s.querySelector('#ok').addEventListener('click', () => { AU.sfx('back'); if (this.bg && this.bg.cleanup) this.bg.cleanup(); this.endFx = null; this.title(); });
    this.setScreen(s);
  },
  /* --- online --- */
  startOnline(c, host) {
    const cfg = { mode: 'online', p1: { def: CHAR[c.p1.ch], costume: c.p1.cos }, p2: { def: CHAR[c.p2.ch], costume: c.p2.cos }, arena: c.arena, cpu: [null, null], local: host ? 0 : 1, names: [c.p1.name, c.p2.name] };
    NET.ui = null; this.startMatch(cfg);
  },
  netGone(msg) {
    if (this.match && this.match.online) { this.endMatch(); }
    toast(msg); if (NET.lobby && this.lobbyArgs) Lobby.open(...this.lobbyArgs); else if (!NET.lobby) { NET.disconnect(); this.title(); }
  },
  netChat(who, text) { ChatBtn.bubble(who, text); },
  netAgain() { const b = document.querySelector('#again'); if (b) b.textContent = NET.again ? 'Si parte!' : 'Rivincita (ti aspetta)'; if (NET.again && NET.peerAgain && NET.host) { NET.sendRoom(Object.assign({ t: 'start' }, NET.startCfg)); NET.beginMatch(NET.startCfg); } },
  togglePause() {
    if (this.match && this.match.online) { this.onlineMenu(); return; }
    if (!this.match || this.match.phase === 'done') return;
    this.paused = !this.paused;
    if (this.paused) {
      const s = this.pauseEl = el(`<div class="screen" style="z-index:20;background:rgba(0,0,0,.45)"><div class="card"><p class="kick">Pausa</p><h2>In pausa</h2>
        <div class="row"><button class="cta ghost" id="q">Esci</button><button class="cta ghost" id="r">Ricomincia</button><button class="cta" id="c">Riprendi</button></div></div></div>`);
      s.querySelector('#c').addEventListener('click', () => this.togglePause());
      s.querySelector('#r').addEventListener('click', () => { const cfg = this.match.o; this.startMatch(Object.assign({}, cfg)); });
      s.querySelector('#q').addEventListener('click', () => this.title());
      UI.appendChild(s); if (window.speechSynthesis) speechSynthesis.cancel();
    } else if (this.pauseEl) { this.pauseEl.remove(); this.pauseEl = null; }
  },
};
/* scene finali dell'Arcade */
const sprite = (col, pos, vel, life, size) => FX.add(new THREE.SpriteMaterial({ map: SPR.glow, color: col, transparent: true }), pos, { vel, life, size });
const ENDINGS = {
  toilet(av, g) {
    const white = std(0xf4f4f2, .25, .05);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.24, .17, .42, 24), white); bowl.position.set(.75, .21, .35); g.add(bowl);
    const seat = new THREE.Mesh(new THREE.TorusGeometry(.2, .04, 10, 24), white); seat.rotation.x = Math.PI / 2; seat.position.set(.75, .44, .35); g.add(seat);
    const water = new THREE.Mesh(new THREE.CircleGeometry(.16, 20), std(0x6fa8c8, .1, .2)); water.rotation.x = -Math.PI / 2; water.position.set(.75, .4, .35); g.add(water);
    const tank = new THREE.Mesh(new THREE.BoxGeometry(.42, .38, .18), white); tank.position.set(.75, .62, .1); g.add(tank);
    return { fx: () => { if (Math.random() < .25) sprite(0x7fd18b, new V3(.75 + rand(-.3, .3), 1.6, .35 + rand(-.2, .2)), new V3(0, -1.2, 0), .9, .09); },
      pose: t => ({ rh: [-.25, 1.15, .45], re: [.5, -1, 0], fist: .4, cy: -.2, hy: -.4, hp: .3, yaw: -.1 }), cam: t => ({ pos: new V3(1.9, 1.45, 2.4), look: new V3(.4, .95, .2) }) };
  },
  social(av, g) {
    const phone = new THREE.Mesh(new THREE.BoxGeometry(.075, .15, .01), std(0x111214, .2, .6)); av.B.rHa.add(phone); phone.scale.setScalar(100); phone.position.set(-9, 2, 0);
    return { fx: () => { if (Math.random() < .15) sprite(pick([0xff3d5a, 0x3d8bff, 0xffcf3a]), new V3(rand(-.6, .6), rand(1.2, 1.8), rand(-.2, .4)), new V3(0, .7, 0), 1.4, .12); },
      pose: t => ({ rh: [-.02, 1.38, .32], re: [.6, -1, 0], lh: [-.2, 1.1, .2], fist: .5, hp: .35, hy: .05, yaw: 0, cy: 0 }), cam: t => ({ pos: new V3(-.6, 1.55, 2.2), look: new V3(0, 1.35, 0) }) };
  },
  santiago(av, g) {   // latte e menta e Cammino di Santiago: zaino, bastone e freccia gialla
    av.obj.updateMatrixWorld(true);
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(.04, .032, .13, 16), std(0x9fe3b8, .3)); g.add(glass); glass.position.set(.75, .86, .45);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(.36, .5, .22), std(0x2f5a8a, .8)); attachAt(av, av.B.spine2, pack, av.B.spine2.getWorldPosition(new V3()).add(new V3(0, -.05, 0)).addScaledVector(new V3(0, 0, 1).transformDirection(av.obj.matrixWorld), -.22), av.obj.getWorldQuaternion(new QT()));
    const tbl = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .04, 24), std(0x8a6a48, .6)); tbl.position.set(.75, .78, .45); g.add(tbl); const tl = new THREE.Mesh(new THREE.CylinderGeometry(.04, .05, .78, 8), std(0x333333)); tl.position.set(.75, .39, .45); g.add(tl);
    const stone = new THREE.Mesh(new THREE.BoxGeometry(.4, 1, .3), std(0xd9d2c3, .9)); stone.position.set(1.1, .5, .2); g.add(stone);
    const arrow = new THREE.Mesh(new THREE.PlaneGeometry(.3, .12), std(0xf2c21a, .6)); arrow.position.set(1.1, .7, .36); g.add(arrow);
    const shell = new THREE.Mesh(new THREE.CircleGeometry(.1, 10, 0, Math.PI), std(0xf2c21a, .6)); shell.position.set(1.1, .45, .36); g.add(shell);
    return { pose: t => ({ rh: [.3, 1.2, .3], re: [.8, -.8, 0], fist: .5, lh: [-.25, 1.0, .1], hp: .1, hy: -.3, yaw: -.2, cy: -.1, jaw: (Math.sin(t * .1) > .9) ? .3 : 0 }), cam: t => ({ pos: new V3(-.5 + Math.sin(t * .1) * .2, 1.5, 2.6), look: new V3(.4, 1.2, 0) }) };
  },
  ai(av, g) {   // portatile con schermo luminoso
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.2, .05, .6), std(0x6b4a30, .6)); desk.position.set(0, .78, .55); g.add(desk);
    for (const [x, z] of [[-.55, .3], [.55, .3], [-.55, .8], [.55, .8]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.04, .78, .04), std(0x333333)); l.position.set(x, .39, z); g.add(l); }
    const base = new THREE.Mesh(new THREE.BoxGeometry(.36, .02, .25), std(0x9aa0a6, .3, .7)); base.position.set(0, .815, .55); g.add(base);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(.36, .23), new THREE.MeshBasicMaterial({ map: canvasTex(256, 160, (c, w, h) => { c.fillStyle = '#0d1b2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#3d8bff'; for (let i = 0; i < 9; i++) c.fillRect(14, 14 + i * 15, rand(60, 220), 7); c.fillStyle = '#ffcf3a'; c.fillRect(14, 140, 90, 8); }) }));
    scr.position.set(0, .94, .43); scr.rotation.x = -.15; scr.rotation.y = Math.PI; g.add(scr);
    return { fx: () => { if (Math.random() < .1) sprite(0x3d8bff, new V3(rand(-.2, .2), rand(.95, 1.2), .45), new V3(0, .4, 0), 1, .06); },
      pose: t => ({ lh: [-.14, 1.0, .42], rh: [.14, 1.0, .42], le: [-1, -.6, 0], re: [1, -.6, 0], lho: [0, 0, 1, 1, 0, 0], rho: [0, 0, 1, -1, 0, 0], fist: .2, hp: .35, cp: .1, yaw: 0, cy: 0, hip: [0, -.05, 0] }), cam: t => ({ pos: new V3(1.2, 1.55, 2.2), look: new V3(0, 1.1, .3) }) };
  },
  fields(av, g) {   // prato verde: sdraiato a fare una chillata
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => { noiseFill(c, w, h, '#5f8f3a', .0, 0); for (let i = 0; i < 5000; i++) { c.strokeStyle = `rgba(${rand(60, 140)},${rand(140, 200)},${rand(50, 90)},.6)`; c.beginPath(); const x = rand(0, w), y = rand(0, h); c.moveTo(x, y); c.lineTo(x + rand(-2, 2), y - rand(3, 8)); c.stroke(); } }, true, [6, 6]), roughness: 1 }));
    grass.rotation.x = -Math.PI / 2; grass.position.y = .02; g.add(grass);
    for (let i = 0; i < 30; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.04, 6, 4), std(pick([0xffffff, 0xf2d21a, 0xe0507a]), .6)); f.position.set(rand(-4, 4), .06, rand(-3, 3)); g.add(f); }
    return { pose: t => Object.assign(clonePose(LYING), { lh: [-.1, 1.62, -.25], rh: [.1, 1.62, -.25], le: [-1, .3, 0], re: [1, .3, 0], fist: .2, rf: [.15, .35, .5], rk: [.2, 1, .3], jaw: 0, hp: .1 }), cam: t => ({ pos: new V3(1.4, 2.4, 1.6), look: new V3(0, .2, -.6) }) };
  },
  camera(av, g) {
    const cam = makeShoulderCam(); holdInRight(av, cam, [-7, 4, 6], [0, Math.PI / 2, 0]);
    return { fx: () => { cam.led.visible = (performance.now() >> 9) % 2 === 0; }, pose: t => ({ rh: [.14, 1.55, .12], re: [1, -.4, 0], rho: [0, 0, 1, -1, 0, 0], fist: .7, lh: [-.02, 1.52, .32], le: [-1, -.6, 0], lho: [0, 0, 1, 1, 0, 0], hy: -.1, yaw: 0, cy: 0, hip: [0, -.1, 0] }), cam: t => ({ pos: new V3(-.3, 1.6, 2.2), look: new V3(0, 1.45, 0) }) };
  },
  gym(av, g) {   // bilanciere sollevato
    const bar = new THREE.Group(), m = std(0x222222, .4, .7); const rod = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 1.6, 8), std(0xc0c4c8, .3, .9)); rod.rotation.z = Math.PI / 2; bar.add(rod);
    for (const x of [-.65, .65]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .06, 20), m); p.rotation.z = Math.PI / 2; p.position.x = x; bar.add(p); }
    g.add(bar); const rack = new THREE.Mesh(new THREE.BoxGeometry(.8, .5, .4), std(0x333333, .5)); rack.position.set(1.2, .25, -.3); g.add(rack);
    for (let i = 0; i < 4; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .3, 10), m); d.rotation.z = Math.PI / 2; d.position.set(1.0 + i * .15 - .1, .55, -.3); g.add(d); }
    return { pose: t => { const k = (Math.sin(t * .05) * .5 + .5); bar.position.set(0, 1.55 + k * .35, .1); return { lh: [-.32, 1.55 + k * .35, .1], rh: [.32, 1.55 + k * .35, .1], le: [-1, -.4, 0], re: [1, -.4, 0], lho: [0, 0, 1, 1, 0, 0], rho: [0, 0, 1, -1, 0, 0], fist: 1, hp: -.1, yaw: 0, cy: 0, hip: [0, -.06, 0], jaw: k > .8 ? .3 : 0 }; }, cam: t => ({ pos: new V3(.4, 1.6, 2.8), look: new V3(0, 1.4, 0) }) };
  },
  slot(av, g) {   // slot machine, gratta e vinci e grafico degli ETF
    const sm = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(.7, 1.6, .6), std(0xb3171f, .5, .3)); body.position.y = .8; sm.add(body);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(.5, .25), new THREE.MeshBasicMaterial({ map: canvasTex(192, 96, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.font = 'bold 56px Arial'; c.fillStyle = '#c00'; c.fillText('7 7 7', 12, 70); }) })); scr.position.set(0, 1.15, .301); sm.add(scr);
    const lever = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .5, 8), std(0xcccccc, .3, .8)); lever.position.set(.4, 1.2, 0); sm.add(lever); const knob = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), std(0x111111)); knob.position.set(.4, 1.45, 0); sm.add(knob);
    sm.position.set(.85, 0, .35); sm.rotation.y = -.6; g.add(sm);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(.1, .07), new THREE.MeshBasicMaterial({ color: 0xf2c21a, side: THREE.DoubleSide })); av.B.lHa.add(card); card.scale.setScalar(100); card.position.set(-9, 2, 0);
    return { fx: () => { if (Math.random() < .2) sprite(pick([0xffcf3a, 0x5fd35f]), new V3(.85 + rand(-.3, .3), rand(1, 1.8), .5), new V3(0, .8, 0), 1, .08); },
      pose: t => ({ rh: [.4, 1.35, .45], re: [1, -.5, 0], fist: .8, lh: [-.1, 1.25, .3], lho: [0, 1, .3, 1, 0, 0], hp: .1, hy: -.3, yaw: -.3, cy: -.1, jaw: Math.sin(t * .3) > .8 ? .4 : 0 }), cam: t => ({ pos: new V3(-.2, 1.55, 2.6), look: new V3(.4, 1.25, .2) }) };
  },
};
/* chat durante l'incontro online */
const ChatBtn = {
  el: null,
  show() {
    this.hide(); const e = this.el = el(`<div class="chatbtn"><button class="cbtn" aria-label="Chat">💬</button><div class="cpanel" hidden>${QUICK_CHAT.map(q => `<button class="chip qc">${esc(q)}</button>`).join('')}
      <form class="chatrow"><input class="inp" maxlength="80" placeholder="Scrivi" autocomplete="off"><button class="chip on">Invia</button></form></div><div class="bubbles"></div></div>`);
    document.body.appendChild(e);
    const panel = e.querySelector('.cpanel'), say = t => { t = t.trim(); if (!t) return; NET.sendRoom({ t: 'chat', text: t.slice(0, 80) }); this.bubble('Tu', t.slice(0, 80)); panel.hidden = true; };
    e.querySelector('.cbtn').addEventListener('pointerdown', ev => { ev.stopPropagation(); panel.hidden = !panel.hidden; });
    e.querySelectorAll('.qc').forEach(b => b.addEventListener('click', () => say(b.textContent)));
    e.querySelector('form').addEventListener('submit', ev => { ev.preventDefault(); const i = e.querySelector('form input'); say(i.value); i.value = ''; });
  },
  hide() { if (this.el) this.el.remove(); this.el = null; },
  bubble(who, text) { if (!this.el) { toast(who + ': ' + text); return; } const B = this.el.querySelector('.bubbles'); const d = el(`<div class="bub"><b>${esc(who)}</b> ${esc(text)}</div>`); B.appendChild(d); setTimeout(() => d.remove(), 4500); },
};
function toast(t) { const d = el(`<div class="toast">${esc(t)}</div>`); document.body.appendChild(d); setTimeout(() => d.remove(), 1400); }

/* ritratti dei personaggi per la griglia di selezione */
function makePortraits() {
  const rt = new THREE.WebGLRenderTarget(192, 192, { encoding: THREE.sRGBEncoding }), sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1, .05, 20);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x404040, .9)); const k = new THREE.DirectionalLight(0xffffff, 1.6); k.position.set(1.5, 2.5, 3); sc.add(k); const r2 = new THREE.DirectionalLight(0xff8a50, 1.1); r2.position.set(-2, 1.5, -1.5); sc.add(r2);
  sc.background = new THREE.Color(0x1d1d22);
  const buf = new Uint8Array(192 * 192 * 4), cv = document.createElement('canvas'); cv.width = cv.height = 192; const cx = cv.getContext('2d');
  for (const c of READY) {
    const a = new Avatar(c.id, 0); sc.add(a.obj); a.obj.rotation.y = .25;
    a.apply(P({ yaw: 0, cy: 0, hp: 0, lh: [-.25, 1.0, .1], rh: [.25, 1.0, .1] }));
    cam.position.set(.18, 1.62, .95); cam.lookAt(0, 1.6, 0);
    R.setRenderTarget(rt); R.render(sc, cam); R.readRenderTargetPixels(rt, 0, 0, 192, 192, buf); R.setRenderTarget(null);
    const img = cx.createImageData(192, 192); for (let y = 0; y < 192; y++) img.data.set(buf.subarray((191 - y) * 768, (192 - y) * 768), y * 768);
    cx.putImageData(img, 0, 0); PORTRAITS[c.id] = cv.toDataURL('image/jpeg', .85);
    sc.remove(a.obj); a.dispose();
  }
  rt.dispose();
}

/* ===== ciclo principale ===== */
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  const M = App.match;
  if (M && M.online) {
    const me = M.f[M.local], op = M.f[1 - M.local];
    const a = me.pos.clone().setY(1).project(camera), b = op.pos.clone().setY(1).project(camera);
    const inp = Controls.enabled && !App.pauseEl ? Controls.read(b.x >= a.x ? 1 : -1) : { x: 0, y: 0, p: {}, h: {} };
    if ((M.phase === 'intro' || M.phase === 'outro') && App.tapped) { inp.p.ANY = 1; App.tapped = false; }
    if (NET.host) M.update(dt, [inp, NET.remoteInput()]);
    else { NET.clientInput(inp, dt); NET.clientSteps(M, dt); M.render(dt); }
    Controls.showSpecial(!me.specialUsed && me.hp > 0 && me.hp <= MAXHP * .25 && M.phase === 'fight');
    AU.setIntensity(Math.min(me.hp, op.hp) < 30 ? 1 : 0);
  } else if (M && !App.paused) {
    const me = M.f[0], op = M.f[1];
    const a = me.pos.clone().setY(1).project(camera), b = op.pos.clone().setY(1).project(camera);
    const sign = b.x >= a.x ? 1 : -1;
    const inp = Controls.enabled ? Controls.read(sign) : { x: 0, y: 0, p: {}, h: {} };
    if (M.phase === 'intro' || M.phase === 'outro') { if (App.tapped) { inp.p.ANY = 1; App.tapped = false; } }
    M.update(dt, [inp, null]);
    Controls.showSpecial(!me.specialUsed && me.hp > 0 && me.hp <= MAXHP * .25 && M.phase === 'fight');
    AU.setIntensity(Math.min(me.hp, op.hp) < 30 ? 1 : 0);
  } else if (!M) App.updateBackdrop(dt);
  if (App.endFx) App.endFx(dt);
  ARENA.tick(dt);
  FX.update(dt);
  R.render(scene, camera);
}
addEventListener('pointerdown', () => { AU.init(); App.tapped = true; });
document.addEventListener('visibilitychange', () => { if (document.hidden && App.match && !App.match.online && !App.paused && App.match.phase === 'fight') App.togglePause(); });

function boot() {
  const bar = $('#loadbar'); bar.style.width = '30%';
  FX.init(); Controls.init(); AU.musicOn = App.prefs.music;
  READY.forEach(c => charTextures(c.id));
  const t0 = performance.now();
  const wait = () => { if (TEX_PENDING > 0 && performance.now() - t0 < 8000) { bar.style.width = (30 + 50 * (1 - TEX_PENDING / (READY.length * 6))) + '%'; return setTimeout(wait, 50); } go(); };
  setTimeout(wait, 30);
  const go = () => {
    try { makePortraits(); } catch (e) { console.warn(e); }
    bar.style.width = '80%';
    App.title();
    requestAnimationFrame(t => { last = t; frame(t); });
    setTimeout(() => { bar.style.width = '100%'; $('#loading').remove(); }, 250);
  };
}
boot();
