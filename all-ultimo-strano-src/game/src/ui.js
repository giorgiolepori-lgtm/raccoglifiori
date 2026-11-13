'use strict';
/* ===== Interfaccia: HUD, comandi touch/tastiera ===== */
const UI = $('#ui');
function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const HUD = {
  root: null,
  show(M) {
    this.hide(); this.M = M;
    this.root = el(`<div id="hud" class="screen">
      <div class="bars">
        <div class="pbar l"><div class="hp" id="hp0"><div class="lag"></div><div class="cur"></div></div><div class="pname"><span id="nm0"></span><span class="wins" id="w0"><i></i><i></i></span></div><div class="sp-ready" id="sp0" hidden>Speciale pronta</div></div>
        <div class="timer" id="timer">60</div>
        <div class="pbar r"><div class="hp" id="hp1"><div class="lag"></div><div class="cur"></div></div><div class="pname"><span class="wins" id="w1"><i></i><i></i></span><span id="nm1"></span></div><div class="sp-ready" id="sp1" hidden>Speciale pronta</div></div>
      </div>
      <div class="combo l" id="c0" style="opacity:0"></div><div class="combo r" id="c1" style="opacity:0"></div>
      <div id="bannerBox"></div><div id="subBox"></div><div id="spBox"></div>
    </div>`);
    UI.appendChild(this.root);
    this.hpEl = [0, 1].map(i => ({ box: $('#hp' + i), lag: $('#hp' + i + ' .lag'), cur: $('#hp' + i + ' .cur') }));
    this.rounds([0, 0]);
  },
  hide() { if (this.root) this.root.remove(); this.root = null; },
  names(a, b) { $('#nm0').textContent = a; $('#nm1').textContent = b; },
  rounds(w) { for (let i = 0; i < 2; i++) [...$('#w' + i).children].forEach((d, k) => d.classList.toggle('on', w[i] > k)); },
  update(M) {
    if (!this.root) return;
    M.f.forEach((f, i) => { const e = this.hpEl[i]; e.cur.style.transform = `scaleX(${f.dispHp / MAXHP})`; e.lag.style.transform = `scaleX(${f.lagHp / MAXHP})`; e.box.classList.toggle('low', f.hp <= MAXHP * .25);
      const ready = !f.specialUsed && f.hp > 0 && f.hp <= MAXHP * .25 && M.phase === 'fight'; $('#sp' + i).hidden = !ready; });
    const s = Math.ceil(M.timer / FPS); const tm = $('#timer'); if (tm.textContent !== String(s)) tm.textContent = s; tm.classList.toggle('low', s <= 10);
  },
  banner(text, cls) { const b = $('#bannerBox'); if (!b) return; b.innerHTML = `<div class="banner ${cls || ''}"><b>${esc(text)}</b></div>`; clearTimeout(this.bt); this.bt = setTimeout(() => { if (b) b.innerHTML = ''; }, cls === 'ko' ? 1900 : 1100); },
  subtitle(who, text, big, fx) {
    const b = $('#subBox'); if (!b) return;
    if (!who) { b.innerHTML = ''; return; }
    b.innerHTML = (fx ? `<div class="big-fx">${esc(fx)}</div>` : '') + (text ? `<div class="sub ${big ? 'big' : ''}"><div class="who">${esc(who)}</div><div class="txt">${esc(text)}</div></div>` : '');
  },
  pulseFx() { const e = this.root && this.root.querySelector('.big-fx'); if (!e) return; e.classList.remove('pulse'); void e.offsetWidth; e.classList.add('pulse'); },
  combo(i, n) { const c = $('#c' + i); if (!c) return; c.innerHTML = `${n} colpi<small>combo</small>`; c.style.opacity = 1; clearTimeout(this['ct' + i]); this['ct' + i] = setTimeout(() => c.style.opacity = 0, 1100); },
  flashText(i, t) { const r = this.root; if (!r) return; const d = el(`<div class="flash" style="${i ? 'right' : 'left'}:calc(18px + var(--safe-${i ? 'r' : 'l'}))">${esc(t)}</div>`); r.appendChild(d); setTimeout(() => d.remove(), 900); },
  specialFlash() { const b = $('#spBox'); if (!b) return; const d = el('<div class="spflash"></div>'); b.appendChild(d); setTimeout(() => d.remove(), 600); },
  specialTitle(who, name) { const b = $('#spBox'); if (!b) return; const d = el(`<div class="sptitle"><div class="a">${esc(who)} · mossa speciale</div><div class="b">${esc(name)}</div></div>`); b.appendChild(d); setTimeout(() => d.remove(), 1700); },
};

/* ===== Comandi ===== */
const ICON = {
  fist: '<svg viewBox="0 0 24 24"><path d="M7 9V6.5a1.5 1.5 0 0 1 3 0V9h.5V5.5a1.5 1.5 0 0 1 3 0V9h.5V6a1.5 1.5 0 0 1 3 0v3.5h.2a1.6 1.6 0 0 1 1.6 1.7l-.4 4.3A5 5 0 0 1 13.4 20H11a5 5 0 0 1-5-5v-3.2A1.8 1.8 0 0 1 7 9z"/></svg>',
  foot: '<svg viewBox="0 0 24 24"><path d="M9 3h4.5v8.2l5.6 2.7A3 3 0 0 1 21 16.6V19a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 18.5V16a2 2 0 0 1 1.2-1.8L9 12.4z"/></svg>',
};
const Controls = {
  root: null, keys: {}, pressed: {}, stick: { x: 0, y: 0, id: null }, hold: { y: 0, frames: 0 }, lastFwdTap: -99, lastBackTap: -99, prevX: 0, frame: 0, enabled: false,
  init() {
    addEventListener('keydown', e => { if (e.repeat) return; this.keys[e.code] = true; const b = this.keyMap[e.code]; if (b) this.pressed[b] = true; if (e.code === 'Escape' || e.code === 'KeyP') App.togglePause && App.togglePause(); });
    addEventListener('keyup', e => { this.keys[e.code] = false; });
    addEventListener('blur', () => { this.keys = {}; });
  },
  keyMap: { KeyU: 'LP', KeyI: 'RP', KeyJ: 'LK', KeyK: 'RK', KeyO: 'GR', KeyL: 'SP', Numpad1: 'LK', Numpad2: 'RK', Numpad4: 'LP', Numpad5: 'RP' },
  show() {
    this.hide(); this.enabled = true;
    if (!IS_TOUCH) return;
    const r = this.root = el(`<div id="pad" class="screen" style="pointer-events:none">
      <div class="stick-zone" style="pointer-events:auto"></div>
      <div class="btns" style="pointer-events:auto">
        <div class="btn b-lp" data-b="LP">${ICON.fist}<span class="k">SX</span></div><div class="btn b-rp" data-b="RP">${ICON.fist}<span class="k">DX</span></div>
        <div class="btn b-lk" data-b="LK">${ICON.foot}<span class="k">SX</span></div><div class="btn b-rk" data-b="RK">${ICON.foot}<span class="k">DX</span></div>
      </div>
      <div class="btn b-gr" data-b="GR" style="pointer-events:auto">PRESA</div>
      <div class="btn b-sp" data-b="SP" style="pointer-events:auto" hidden>SPECIALE</div>
      <button class="b-pause" aria-label="Pausa">II</button>
    </div>`);
    UI.appendChild(r); document.body.classList.add('touch');
    r.querySelector('.b-pause').addEventListener('pointerdown', e => { e.stopPropagation(); App.togglePause(); });
    const zone = r.querySelector('.stick-zone');
    let stickEl = null;
    zone.addEventListener('pointerdown', e => {
      if (this.stick.id !== null) return; this.stick.id = e.pointerId; zone.setPointerCapture(e.pointerId);
      this.stick.ox = e.clientX; this.stick.oy = e.clientY; stickEl = el('<div class="stick"><div class="knob"></div></div>'); stickEl.style.left = e.clientX + 'px'; stickEl.style.top = e.clientY + 'px'; r.appendChild(stickEl);
    });
    zone.addEventListener('pointermove', e => {
      if (e.pointerId !== this.stick.id) return; let dx = e.clientX - this.stick.ox, dy = e.clientY - this.stick.oy; const L = Math.hypot(dx, dy), max = 52;
      if (L > max) { dx *= max / L; dy *= max / L; } this.stick.x = dx / max; this.stick.y = -dy / max;
      if (stickEl) stickEl.firstChild.style.transform = `translate(${dx}px,${dy}px)`;
    });
    const up = e => { if (e.pointerId !== this.stick.id) return; this.stick.id = null; this.stick.x = this.stick.y = 0; if (stickEl) stickEl.remove(); stickEl = null; };
    zone.addEventListener('pointerup', up); zone.addEventListener('pointercancel', up);
    r.querySelectorAll('.btn[data-b]').forEach(b => {
      b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('on'); this.pressed[b.dataset.b] = true; if (navigator.vibrate) navigator.vibrate(8); AU.init(); });
      const off = () => b.classList.remove('on'); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('pointerleave', off);
    });
  },
  hide() { if (this.root) this.root.remove(); this.root = null; this.enabled = false; this.stick = { x: 0, y: 0, id: null }; },
  showSpecial(v) { if (this.root) this.root.querySelector('.b-sp').hidden = !v; },
  // legge lo stato e lo converte in comandi relativi all'avversario (fwdSign: +1 se l'avversario è a destra sullo schermo)
  read(fwdSign) {
    this.frame++;
    const K = this.keys;
    let x = this.stick.x, y = this.stick.y;
    if (K.ArrowRight || K.KeyD) x = 1; if (K.ArrowLeft || K.KeyA) x = -1; if (K.ArrowUp || K.KeyW) y = 1; if (K.ArrowDown || K.KeyS) y = -1;
    const rx = Math.abs(x) > .45 ? Math.sign(x) * fwdSign : 0, ry = Math.abs(y) > .55 ? Math.sign(y) : 0;
    const p = Object.assign({}, this.pressed); this.pressed = {};
    // doppio tocco avanti = scatto, tocco breve su/giù = passo laterale, su tenuto = salto
    if (rx > 0 && this.prevX <= 0) { if (this.frame - this.lastFwdTap < 15) p.DASH = 1; this.lastFwdTap = this.frame; }
    if (rx < 0 && this.prevX >= 0) { if (this.frame - this.lastBackTap < 15) p.DASH = -1; this.lastBackTap = this.frame; }
    this.prevX = rx;
    const h = {};
    if (ry !== 0 && ry === this.hold.y) this.hold.frames++;
    else { if (this.hold.y !== 0 && this.hold.frames > 0 && this.hold.frames < 9 && rx === 0) p.SIDE = this.hold.y; this.hold.y = ry; this.hold.frames = ry ? 1 : 0; }
    if (ry > 0 && this.hold.frames >= 9) h.jumpHold = 1;
    return { x: rx, y: ry > 0 && this.hold.frames < 9 ? 0 : ry, p, h };
  },
};
