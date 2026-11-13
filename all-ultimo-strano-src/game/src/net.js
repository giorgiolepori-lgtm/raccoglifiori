'use strict';
/* ===== Online: sala d'attesa, sfide, partita veloce, chat =====
   I messaggi passano da server MQTT pubblici e gratuiti (nessuna registrazione).
   Chi lancia la sfida (host) fa girare l'incontro e invia, a gruppi di pochi fotogrammi, i comandi di
   entrambi i giocatori: l'altro telefono rigioca gli stessi comandi con lo stesso codice, quindi i due
   incontri sono identici. Ogni mezzo secondo l'host manda anche posizioni ed energia per correggere
   eventuali piccole differenze. */
const NET_BASE = 'aus-strano-v1';
const MQ_BROKERS = (() => { const q = new URLSearchParams(location.search).get('broker'); return q ? [q] : ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://test.mosquitto.org:8081/mqtt']; })();
const QUICK_CHAT = ['Ciao fra!', 'Rivincita?', 'Sei scarso', 'GG', 'Aspetta un attimo', 'Che strano che sei', 'AHAHAHAH', 'Andiamo!'];
const _te = new TextEncoder(), _td = new TextDecoder();
function mqStr(s) { const b = _te.encode(s), o = new Uint8Array(2 + b.length); o[0] = b.length >> 8; o[1] = b.length & 255; o.set(b, 2); return o; }
function mqPacket(h, parts) {
  let len = 0; for (const p of parts) len += p.length;
  const lb = []; let x = len; do { let d = x % 128; x = Math.floor(x / 128); if (x > 0) d |= 128; lb.push(d); } while (x > 0);
  const out = new Uint8Array(1 + lb.length + len); out[0] = h; out.set(lb, 1); let o = 1 + lb.length; for (const p of parts) { out.set(p, o); o += p.length; } return out;
}
class MqttWS {
  constructor(url, cid, onMsg, onClose) { this.url = url; this.cid = cid; this.onMsg = onMsg; this.onClose = onClose; this.pid = 1; this.buf = new Uint8Array(0); }
  connect(timeout = 6000) {
    return new Promise((res, rej) => {
      let done = false, ws;
      const fail = e => { if (done) return; done = true; clearTimeout(to); try { ws && ws.close(); } catch (_) { } rej(e); };
      const to = setTimeout(() => fail(new Error('timeout')), timeout);
      try { ws = this.ws = new WebSocket(this.url, ['mqtt']); } catch (e) { fail(e); return; }
      ws.binaryType = 'arraybuffer';
      ws.onopen = () => ws.send(mqPacket(0x10, [mqStr('MQTT'), new Uint8Array([4, 2, 0, 30]), mqStr(this.cid)]));
      ws.onerror = () => fail(new Error('ws'));
      ws.onclose = () => { clearInterval(this.ping); if (!done) fail(new Error('closed')); else if (this.onClose && !this.closing) this.onClose(); };
      ws.onmessage = ev => {
        const d = new Uint8Array(ev.data), nb = new Uint8Array(this.buf.length + d.length); nb.set(this.buf); nb.set(d, this.buf.length); this.buf = nb;
        for (; ;) {
          if (this.buf.length < 2) return;
          let mul = 1, len = 0, i = 1, b;
          do { if (i >= this.buf.length) return; b = this.buf[i++]; len += (b & 127) * mul; mul *= 128; } while (b & 128);
          if (this.buf.length < i + len) return;
          const type = this.buf[0] >> 4, flags = this.buf[0] & 15, body = this.buf.subarray(i, i + len);
          this.buf = this.buf.slice(i + len);
          if (type === 2) {
            clearTimeout(to); if (body[1] !== 0) { fail(new Error('rifiutato ' + body[1])); return; }
            done = true; this.ping = setInterval(() => this.raw(new Uint8Array([0xC0, 0])), 20000); res(this);
          } else if (type === 3) {
            const tl = (body[0] << 8) | body[1], topic = _td.decode(body.subarray(2, 2 + tl)); let p = 2 + tl; if ((flags >> 1) & 3) p += 2;
            try { this.onMsg(topic, _td.decode(body.subarray(p))); } catch (e) { console.warn(e); }
          }
        }
      };
    });
  }
  raw(p) { if (this.ws && this.ws.readyState === 1) this.ws.send(p); }
  nid() { this.pid = (this.pid % 65535) + 1; return new Uint8Array([this.pid >> 8, this.pid & 255]); }
  sub(t) { this.raw(mqPacket(0x82, [this.nid(), mqStr(t), new Uint8Array([0])])); }
  unsub(t) { this.raw(mqPacket(0xA2, [this.nid(), mqStr(t)])); }
  pub(t, s) { this.raw(mqPacket(0x30, [mqStr(t), _te.encode(s)])); }
  close() { this.closing = true; clearInterval(this.ping); try { this.raw(new Uint8Array([0xE0, 0])); this.ws.close(); } catch (e) { } }
}
// trasporto locale per le prove (?broker=local): due schede dello stesso browser
class LocalBus {
  constructor(url, cid, onMsg) { this.onMsg = onMsg; this.subs = new Set(); }
  connect() { this.bc = new BroadcastChannel('aus-local-bus'); this.bc.onmessage = e => { const [t, s] = e.data; if ([...this.subs].some(x => x === t)) this.onMsg(t, s); }; return Promise.resolve(this); }
  sub(t) { this.subs.add(t); } unsub(t) { this.subs.delete(t); } pub(t, s) { this.bc.postMessage([t, s]); } close() { this.bc && this.bc.close(); }
}

/* --- comandi compressi in un numero: assi, tasti premuti, passo laterale, scatto --- */
const IN_KEYS = ['LP', 'RP', 'LK', 'RK', 'GR', 'SP', 'ANY'];
function encIn(I) {
  if (!I) return 0;
  let v = (Math.round(I.x) + 1) | ((Math.round(I.y) + 1) << 2) | ((I.h && I.h.jumpHold ? 1 : 0) << 4);
  IN_KEYS.forEach((k, i) => { if (I.p[k]) v |= 1 << (5 + i); });
  if (I.p.SIDE) v |= (I.p.SIDE > 0 ? 1 : 2) << 12; if (I.p.DASH) v |= (I.p.DASH > 0 ? 1 : 2) << 14;
  return v;
}
function decIn(v) {
  const I = { x: (v & 3) - 1, y: ((v >> 2) & 3) - 1, p: {}, h: {} };
  if ((v >> 4) & 1) I.h.jumpHold = 1;
  IN_KEYS.forEach((k, i) => { if ((v >> (5 + i)) & 1) I.p[k] = 1; });
  const sd = (v >> 12) & 3, ds = (v >> 14) & 3; if (sd) I.p.SIDE = sd === 1 ? 1 : -1; if (ds) I.p.DASH = ds === 1 ? 1 : -1;
  return I;
}
const r3 = v => Math.round(v * 1000) / 1000;
const PHASES = ['intro', 'roundIntro', 'fight', 'ko', 'roundEnd', 'outro', 'done'];

const NET = {
  mq: null, id: Math.random().toString(36).slice(2, 10), state: 'off', lobby: null, players: new Map(), me: null,
  room: null, peer: null, host: false, inMatch: false, lastRx: 0,
  // host
  remote: { x: 0, y: 0, h: {}, pend: [] }, outBuf: [], outFrom: 0,
  // client
  queue: [], snaps: new Map(), sendAcc: null, sendT: 0, nextFrame: 1,
  ui: null,
  topic(...p) { return [NET_BASE, ...p].join('/'); },
  async connect() {
    if (this.mq) return true;
    for (const url of MQ_BROKERS) {
      try { const T = url === 'local' ? LocalBus : MqttWS; this.mq = await new T(url, 'aus' + this.id + Math.random().toString(36).slice(2, 5), (t, s) => this.rx(t, s), () => this.lost()).connect(); return true; }
      catch (e) { console.warn('broker', url, e.message); this.mq = null; }
    }
    return false;
  },
  send(to, m) { if (this.mq) this.mq.pub(to, JSON.stringify(m)); },
  sendRoom(m) { if (this.room) this.send(this.topic('r', this.room, this.id), m); },
  async enterLobby(me, code) {
    this.me = me; this.code = code; this.state = 'connecting';
    const ok = await this.connect();
    if (!ok) { this.state = 'off'; return false; }
    if (this.state !== 'connecting') return false;
    this.lobby = this.topic('lobby', code || 'pubblico'); this.mq.sub(this.lobby); this.mq.sub(this.topic('to', this.id));
    this.state = 'lobby'; this.players.clear(); this.announce();
    clearInterval(this.annIv); this.annIv = setInterval(() => { this.announce(); this.prune(); }, 2000);
    return true;
  },
  announce() { if (this.lobby) this.send(this.lobby, { t: 'here', id: this.id, name: this.me.name, ch: this.me.ch, cos: this.me.cos, busy: this.state !== 'lobby' && this.state !== 'quick' ? 1 : 0 }); },
  prune() { const now = Date.now(); let ch = false; for (const [k, p] of this.players) if (now - p.seen > 7000) { this.players.delete(k); ch = true; } if (ch && this.ui) this.ui.refresh(); },
  leaveLobby() {
    clearInterval(this.annIv); clearInterval(this.quickIv);
    if (this.mq && this.lobby) { this.send(this.lobby, { t: 'bye', id: this.id }); this.mq.unsub(this.lobby); }
    this.lobby = null; this.state = 'off';
  },
  disconnect() { this.leaveLobby(); this.leaveRoom(true); if (this.mq) { const m = this.mq; setTimeout(() => m.close(), 150); } this.mq = null; },
  /* --- sfide --- */
  challenge(pid) { const room = this.id + pid; this.pendingRoom = room; this.state = 'asking'; this.send(this.topic('to', pid), { t: 'ch', id: this.id, name: this.me.name, ch: this.me.ch, cos: this.me.cos, room }); },
  answer(m, yes) {
    if (!yes) { this.send(this.topic('to', m.id), { t: 'no', id: this.id }); return; }
    this.send(this.topic('to', m.id), { t: 'acc', id: this.id, name: this.me.name, ch: this.me.ch, cos: this.me.cos, room: m.room });
    this.joinRoom(m.room, m.id, false, m);
  },
  quick() {
    this.state = 'quick';
    const seek = () => { if (this.state !== 'quick') return clearInterval(this.quickIv); this.send(this.lobby, { t: 'seek', id: this.id, name: this.me.name, ch: this.me.ch, cos: this.me.cos }); };
    seek(); clearInterval(this.quickIv); this.quickIv = setInterval(seek, 1200);
  },
  cancelQuick() { this.state = 'lobby'; clearInterval(this.quickIv); },
  rx(topic, s) {
    let m; try { m = JSON.parse(s); } catch (e) { return; }
    if (!m || m.id === this.id) return;
    this.lastRx = performance.now();
    if (topic === this.lobby) {
      if (m.t === 'here') { this.players.set(m.id, Object.assign(this.players.get(m.id) || {}, m, { seen: Date.now() })); if (this.ui) this.ui.refresh(); }
      else if (m.t === 'bye') { this.players.delete(m.id); if (this.ui) this.ui.refresh(); }
      else if (m.t === 'chat') { if (this.ui) this.ui.chat(m.name, m.text); }
      else if (m.t === 'seek' && this.state === 'quick' && this.id < m.id) { this.pendingRoom = this.id + m.id; this.send(this.topic('to', m.id), { t: 'inv', id: this.id, name: this.me.name, ch: this.me.ch, cos: this.me.cos, room: this.pendingRoom }); }
      return;
    }
    if (topic === this.topic('to', this.id)) {
      if (m.t === 'ch') { if (this.state === 'lobby' && this.ui) this.ui.incoming(m); else this.send(this.topic('to', m.id), { t: 'no', id: this.id, busy: 1 }); }
      else if (m.t === 'inv' && this.state === 'quick') { this.send(this.topic('to', m.id), { t: 'acc', id: this.id, name: this.me.name, ch: this.me.ch, cos: this.me.cos, room: m.room }); this.joinRoom(m.room, m.id, false, m); }
      else if (m.t === 'acc' && m.room === this.pendingRoom && (this.state === 'asking' || this.state === 'quick')) this.joinRoom(m.room, m.id, true, m);
      else if (m.t === 'no' && this.state === 'asking') { this.state = 'lobby'; if (this.ui) this.ui.status(m.busy ? 'Sta già giocando con qualcun altro.' : 'Ha rifiutato la sfida.'); }
      return;
    }
    if (this.room && topic === this.topic('r', this.room, this.peer)) this.roomRx(m);
  },
  joinRoom(room, peer, host, info) {
    clearInterval(this.quickIv);
    this.room = room; this.peer = peer; this.host = host; this.peerInfo = info; this.state = 'room';
    this.mq.sub(this.topic('r', room, peer)); this.announce();
    this.lastRx = performance.now();
    if (host) {   // l'host decide l'arena e avvia
      const arena = pick(CHAR[this.me.ch].arenas.concat(CHAR[info.ch].arenas));
      this.startCfg = { p1: { ch: this.me.ch, cos: this.me.cos, name: this.me.name }, p2: { ch: info.ch, cos: info.cos, name: info.name }, arena };
      this.sendRoom(Object.assign({ t: 'start' }, this.startCfg));
      this.beginMatch(this.startCfg);
    }
    clearInterval(this.watchIv); this.watchIv = setInterval(() => this.watch(), 1000);
  },
  leaveRoom(silent) {
    clearInterval(this.watchIv);
    if (this.room) { if (!silent) this.sendRoom({ t: 'bye' }); if (this.mq) this.mq.unsub(this.topic('r', this.room, this.peer)); }
    this.room = null; this.peer = null; this.inMatch = false; this.queue = []; this.snaps.clear(); this.again = this.peerAgain = false;
    if (this.lobby) this.state = 'lobby';
  },
  watch() {
    if (!this.room) return;
    this.sendRoom({ t: 'ka' });
    if (performance.now() - this.lastRx > 8000) { const was = this.inMatch; this.leaveRoom(true); App.netGone(was ? 'Connessione persa: l\'altro giocatore non risponde più.' : 'L\'altro giocatore non risponde.'); }
  },
  beginMatch(cfg) {
    this.inMatch = true; this.queue = []; this.snaps.clear(); this.nextFrame = 1; this.outBuf = []; this.remote = { x: 0, y: 0, h: {}, pend: [] }; this.again = this.peerAgain = false;
    App.startOnline(cfg, this.host);
  },
  roomRx(m) {
    switch (m.t) {
      case 'start': if (!this.host) { this.startCfg = m; this.beginMatch(m); } break;
      case 'in': {   // host: comandi dell'altro giocatore
        this.remote.x = m.x; this.remote.y = m.y; this.remote.h = m.j ? { jumpHold: 1 } : {};
        if (m.p) this.remote.pend.push(m.p); break;
      }
      case 'f': {   // client: fotogrammi dell'host
        for (let k = 0; k < m.i.length; k++) this.queue.push({ n: m.n + k, a: m.i[k][0], b: m.i[k][1] });
        if (m.s) this.snaps.set(m.s[0], m.s); break;
      }
      case 'chat': if (this.ui) this.ui.chat(this.peerInfo.name, m.text); else App.netChat(this.peerInfo.name, m.text); break;
      case 'again': this.peerAgain = true; App.netAgain(); break;
      case 'bye': { const was = this.inMatch; this.leaveRoom(true); App.netGone(was ? 'L\'altro giocatore è uscito dalla partita.' : 'L\'altro giocatore è tornato alla sala.'); break; }
    }
  },
  lost() { const r = this.room; this.mq = null; this.room = null; this.state = 'off'; App.netGone('Connessione al server persa.'); },
  /* --- durante l'incontro --- */
  remoteInput() {   // host: un tasto premuto dall'altro vale un solo passo
    const R = this.remote, I = { x: R.x, y: R.y, p: {}, h: R.h };
    const p = R.pend.shift(); if (p) Object.assign(I.p, decIn(p).p);
    return I;
  },
  hostStep(M, n, ins) {   // host: registra i comandi usati e li spedisce a gruppi
    if (!this.outBuf.length) this.outFrom = n;
    this.outBuf.push([encIn(ins[0]), encIn(ins[1])]);
    const snap = n % 30 === 0 ? [n, ...M.f.flatMap(f => [r3(f.pos.x), r3(f.pos.z), r3(f.y), r3(f.yaw), f.hp]), M.timer,
      PHASES.indexOf(M.phase), M.pt, M.round, M.f[0].wins, M.f[1].wins, M.roundWinner ? M.f.indexOf(M.roundWinner) : -1, M.winner ? M.f.indexOf(M.winner) : -1] : null;
    if (this.outBuf.length >= 3 || snap) { const msg = { t: 'f', n: this.outFrom, i: this.outBuf }; if (snap) msg.s = snap; this.sendRoom(msg); this.outBuf = []; }
  },
  clientInput(I, dt) {   // client: manda i comandi ~30 volte al secondo, senza perdere i tasti premuti
    const p = encIn(I) >> 5;
    if (p) this.sendRoom({ t: 'in', x: I.x, y: I.y, j: I.h.jumpHold ? 1 : 0, p: encIn({ x: 0, y: 0, p: I.p, h: {} }) });
    else { this.sendT += dt; const key = I.x + ',' + I.y + ',' + (I.h.jumpHold ? 1 : 0); if (key !== this.lastKey || this.sendT > .25) { this.sendT = 0; this.lastKey = key; this.sendRoom({ t: 'in', x: I.x, y: I.y, j: I.h.jumpHold ? 1 : 0 }); } }
  },
  clientSteps(M, dt) {   // client: rigioca i fotogrammi ricevuti al ritmo giusto, recuperando se resta indietro
    while (this.queue.length && this.queue[0].n < this.nextFrame) this.queue.shift();
    this.cAcc = (this.cAcc || 0) + Math.min(dt, .1) * M.slow;
    let steps = 0; const backlog = this.queue.length;
    const extra = backlog > 12 ? 3 : backlog > 6 ? 1 : 0;
    while (this.queue.length && (this.cAcc >= DT || steps < extra) && steps < 6) {
      if (this.queue[0].n !== this.nextFrame) break;
      const q = this.queue.shift(); if (this.cAcc >= DT) this.cAcc -= DT;
      M.step([decIn(q.a), decIn(q.b)]); this.nextFrame++; steps++;
      const s = this.snaps.get(q.n); if (s) { this.snaps.delete(q.n); this.correct(M, s); }
    }
    if (!this.queue.length) this.cAcc = Math.min(this.cAcc, DT);
    if (M.slowT > 0) { M.slowT -= dt; if (M.slowT <= 0) M.slow = 1; }
    return steps;
  },
  correct(M, s) {   // allinea il secondo telefono all'host: posizioni, energia, tempo, round e vittorie
    const [ph, pt, round, w0, w1, rw, win] = s.slice(12), phase = PHASES[ph];
    if (phase !== M.phase || round !== M.round) {
      M.round = round; M.roundWinner = rw >= 0 ? M.f[rw] : null;
      if (phase === 'roundIntro' && M.phase !== 'roundIntro') { M.resetRound(false); HUD.rounds([w0, w1]); }
      else if (phase === 'outro' || phase === 'done') { M.winner = M.f[win >= 0 ? win : 0]; }
      M.phase = phase; M.pt = pt; if (M.special) { M.special = null; M.camOverride = null; }
    }
    M.f[0].wins = w0; M.f[1].wins = w1;
    M.f.forEach((f, i) => { const o = 1 + i * 5; f.pos.x = s[o]; f.pos.z = s[o + 1]; f.y = s[o + 2]; f.yaw = s[o + 3]; if (f.hp !== s[o + 4]) f.hp = s[o + 4]; });
    M.timer = s[11];
    if (M.phase === 'done' && !M._ended && M.o.onEnd) { M._ended = true; HUD.subtitle(null); M.o.onEnd({ winner: win >= 0 ? win : 0 }); }
  },
};

/* ===== Schermata della sala d'attesa ===== */
const Lobby = {
  open(ch, cos) {
    const saved = store.get();
    let me = { name: (saved.netName || CHAR[ch].name).slice(0, 16), ch, cos };
    App.menuBackdrop(CHAR[ch].arenas[0], [{ ...CHAR[ch], cos }]); const o = App.bg.avs[0]; o.a.obj.position.set(-1.6, 0, 0); o.a.obj.rotation.y = .5; App.bg.cam = t => ({ pos: new V3(.4, 1.45, 3.3), look: new V3(.4, 1.15, 0) });
    const s = el(`<div id="lobby" class="screen"><div class="topbar"><button class="back" aria-label="Indietro">‹</button><h2 class="h1">Gioca <em>online</em></h2></div>
      <div class="lob">
        <div class="lob-l">
          <label class="lbl" for="lobName">Il tuo nome</label><input id="lobName" class="inp" maxlength="16" value="${esc(me.name)}">
          <label class="lbl" for="lobCode">Codice stanza (facoltativo)</label><input id="lobCode" class="inp" maxlength="12" placeholder="es. strani" value="${esc(saved.netCode || '')}">
          <div class="row"><button class="cta" id="lobGo">Entra</button></div>
          <p class="lob-st" id="lobSt">Con lo stesso codice stanza vi trovate solo tra voi. Senza codice entri nella sala pubblica.</p>
        </div>
        <div class="lob-r" hidden>
          <div class="lob-head"><span id="lobRoom"></span><button class="cta" id="lobQuick">Partita veloce</button></div>
          <ul class="lob-list" id="lobList"></ul>
          <div class="lob-chat"><div class="msgs" id="lobMsgs"></div>
            <div class="quick">${QUICK_CHAT.map(q => `<button class="chip qc">${esc(q)}</button>`).join('')}</div>
            <form id="lobForm" class="chatrow"><input id="lobText" class="inp" maxlength="80" placeholder="Scrivi un messaggio" autocomplete="off"><button class="chip on" type="submit">Invia</button></form></div>
        </div>
      </div><div id="lobPop"></div></div>`);
    App.setScreen(s); NET.ui = this; this.s = s; this.me = me; App.lobbyArgs = [ch, cos];
    const st = t => s.querySelector('#lobSt').textContent = t;
    s.querySelector('.back').addEventListener('click', () => { AU.sfx('back'); NET.disconnect(); NET.ui = null; App.title(); });
    s.querySelector('#lobGo').addEventListener('click', async () => {
      AU.sfx('confirm'); me.name = (s.querySelector('#lobName').value || '').trim().slice(0, 16) || CHAR[ch].name;
      const code = (s.querySelector('#lobCode').value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
      store.set({ netName: me.name, netCode: code }); st('Mi collego al server online…'); s.querySelector('#lobGo').disabled = true;
      const ok = await NET.enterLobby(me, code);
      if (!ok) { s.querySelector('#lobGo').disabled = false; st('Non riesco a collegarmi al server online. Controlla la connessione a internet e riprova.'); return; }
      s.querySelector('.lob-l').hidden = true; s.querySelector('.lob-r').hidden = false;
      s.querySelector('#lobRoom').textContent = code ? 'Stanza «' + code + '»' : 'Sala pubblica'; this.refresh();
      this.chat(null, 'Sei nella sala. Sfida qualcuno dalla lista o premi «Partita veloce».');
    });
    s.querySelector('#lobQuick').addEventListener('click', () => {
      AU.sfx('select');
      if (NET.state === 'quick') { NET.cancelQuick(); s.querySelector('#lobQuick').textContent = 'Partita veloce'; this.status('Ricerca annullata.'); }
      else { NET.quick(); s.querySelector('#lobQuick').textContent = 'Annulla ricerca'; this.status('Cerco un avversario libero…'); }
    });
    const say = t => { t = t.trim(); if (!t) return; NET.send(NET.lobby, { t: 'chat', id: NET.id, name: me.name, text: t.slice(0, 80) }); this.chat(me.name, t.slice(0, 80)); };
    s.querySelector('#lobForm').addEventListener('submit', e => { e.preventDefault(); const i = s.querySelector('#lobText'); say(i.value); i.value = ''; });
    s.querySelectorAll('.qc').forEach(b => b.addEventListener('click', () => say(b.textContent)));
    if (NET.lobby && NET.mq) { me = this.me = NET.me; s.querySelector('.lob-l').hidden = true; s.querySelector('.lob-r').hidden = false; s.querySelector('#lobRoom').textContent = NET.code ? 'Stanza «' + NET.code + '»' : 'Sala pubblica'; NET.state = 'lobby'; NET.announce(); setTimeout(() => this.refresh(), 0); }
    s.querySelector('#lobList').addEventListener('click', e => { const b = e.target.closest('[data-ch]'); if (!b || NET.state !== 'lobby') return; AU.sfx('select'); NET.challenge(b.dataset.ch); this.status('Sfida inviata. Aspetto la risposta…'); setTimeout(() => { if (NET.state === 'asking') { NET.state = 'lobby'; this.status('Nessuna risposta.'); } }, 15000); });
  },
  refresh() {
    if (!this.s || !this.s.isConnected) return;
    const L = this.s.querySelector('#lobList'), arr = [...NET.players.values()];
    L.innerHTML = arr.length ? arr.map(p => `<li><span class="pn">${esc(p.name)}</span><span class="pc">${esc((CHAR[p.ch] || {}).name || '')}</span>${p.busy ? '<span class="pb">sta giocando</span>' : `<button class="chip on" data-ch="${esc(p.id)}">Sfida</button>`}</li>`).join('')
      : '<li class="empty">Per ora non c\'è nessun altro. Manda il link a un amico, oppure aspetta.</li>';
  },
  status(t) { this.chat(null, t); },
  chat(who, text) {
    const M = this.s && this.s.querySelector('#lobMsgs'); if (!M) { if (who) App.netChat(who, text); return; }
    const d = el(`<div class="m ${who ? '' : 'sys'}">${who ? `<b>${esc(who)}</b> ` : ''}${esc(text)}</div>`); M.appendChild(d); M.scrollTop = M.scrollHeight;
    while (M.children.length > 40) M.firstChild.remove();
  },
  incoming(m) {
    AU.sfx('select'); const P = this.s.querySelector('#lobPop');
    const d = el(`<div class="card pop"><p class="kick">Sfida</p><h2><em>${esc(m.name)}</em> ti sfida</h2><p>Con ${esc((CHAR[m.ch] || {}).name || '')}.</p><div class="row"><button class="cta ghost" data-a="0">No</button><button class="cta" data-a="1">Accetta</button></div></div>`);
    P.innerHTML = ''; P.appendChild(d);
    const done = yes => { d.remove(); NET.answer(m, yes); };
    d.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => done(b.dataset.a === '1')));
    setTimeout(() => { if (d.isConnected) done(false); }, 14000);
  },
};
