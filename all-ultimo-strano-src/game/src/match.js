'use strict';
/* ===== Incontro: simulazione a 60 passi al secondo, round, telecamera ===== */
const ROUND_TIME = 60, WIN_ROUNDS = 2;
const G = 14;  // gravità

class Match {
  constructor(o) {
    this.o = o; this.mode = o.mode;
    this.arena = o.arena; this.f = [new Fighter(o.p1.def, o.p1.costume, -1), new Fighter(o.p2.def, o.p2.costume, 1)];
    this.f.forEach(f => scene.add(f.av.obj));
    this.cpu = [o.cpu && o.cpu[0] ? new CPU(o.cpu[0]) : null, o.cpu && o.cpu[1] ? new CPU(o.cpu[1]) : null];
    this.round = 1; this.phase = 'intro'; this.pt = 0; this.timer = ROUND_TIME * FPS; this.hitstop = 0; this.slow = 1; this.slowT = 0;
    this.acc = 0; this.frame = 0; this.shake = 0; this.camSide = 1; this.camOverride = null; this.special = null;
    this.camPos = new V3(0, 1.6, 6); this.camLook = new V3(0, 1, 0); this.firstCam = true;
    this.introStep = 0; this.events = [];
    this.resetRound(true);
    HUD.show(this); HUD.names(this.f[0].def.name, this.f[1].def.name);
  }
  dispose() { this.f.forEach(f => { scene.remove(f.av.obj); f.av.dispose(); }); FX.clear(); if (this.special && this.special.cleanup) this.special.cleanup(this); }
  resetRound(first) {
    const [a, b] = this.f;
    a.pos.set(-1.35, 0, 0); b.pos.set(1.35, 0, 0);
    for (const f of this.f) { f.hp = f.dispHp = f.lagHp = MAXHP; f.y = 0; f.vy = 0; f.vel.set(0, 0, 0); f.state = 'idle'; f.t = 0; f.move = null; f.specialUsed = false; f.override = null; f.pose = clonePose(GUARD); f.from = null; f.combo = 0; }
    a.yaw = Math.PI / 2; b.yaw = -Math.PI / 2;
    this.timer = ROUND_TIME * FPS; this.camSide = 1; this.firstCam = true;
    if (!first) this.phase = 'roundIntro', this.pt = 0;
  }
  /* --- passo a tempo reale --- */
  update(dt, inputs) {
    this.acc += Math.min(dt, .1) * this.slow;
    let steps = 0;
    while (this.acc >= DT && steps < 4) { this.acc -= DT; steps++; this.step(inputs); inputs = this.consumed(inputs); }
    if (this.slowT > 0) { this.slowT -= dt; if (this.slowT <= 0) this.slow = 1; }
    this.render(dt);
  }
  consumed(inputs) { return inputs.map(I => I ? { x: I.x, y: I.y, p: {}, h: I.h } : I); }   // i tasti premuti valgono un solo passo
  step(inputs) {
    this.frame++; this.pt++;
    const ins = this.f.map((f, i) => this.cpu[i] ? this.cpu[i].input(f, this.f[1 - i], this) : (inputs[i] || { x: 0, y: 0, p: {}, h: {} }));
    switch (this.phase) {
      case 'intro': this.stepIntro(ins); break;
      case 'roundIntro':
        if (this.pt === 1) { HUD.banner('ROUND ' + this.round, 'big'); AU.announce(this.round === 3 ? 'Round finale' : 'Round ' + this.round); }
        if (this.pt === 70) { HUD.banner('COMBATTETE!', 'fight'); AU.announce('Fight!'); AU.music('fight', this.arena.music); }
        if (this.pt >= 100) { this.phase = 'fight'; this.pt = 0; }
        break;
      case 'fight':
        if (this.timer > 0) this.timer--; if (this.timer === 0) this.timeOver();
        break;
      case 'ko': if (this.pt === 140) this.endRound(); break;
      case 'roundEnd': if (this.pt === 120) this.nextRound(); break;
      case 'outro': this.stepOutro(ins); break;
    }
    if (this.special) { this.stepSpecial(); }
    else if (this.hitstop > 0) this.hitstop--;
    else {
      const active = this.phase === 'fight' || this.phase === 'ko' || this.phase === 'roundEnd';
      for (let i = 0; i < 2; i++) this.stepFighter(this.f[i], this.f[1 - i], active && this.phase === 'fight' ? ins[i] : { x: 0, y: 0, p: {}, h: {} });
      this.separate();
    }
    for (const f of this.f) { f.dispHp += (f.hp - f.dispHp) * .35; if (f.lagHp > f.dispHp) f.lagHp -= .35; else f.lagHp = f.dispHp; }
  }
  /* --- introduzione: le frasi dei due personaggi --- */
  stepIntro(ins) {
    const skip = ins.some(I => I && (I.p.LP || I.p.RP || I.p.LK || I.p.RK || I.p.ANY)) && this.pt > 20;
    const who = this.introStep, f = this.f[who];
    if (this.pt === 1) {
      const op = this.f[1 - who], line = f.def.lines.vs && f.def.lines.vs[op.id] || f.def.lines.intro;
      HUD.subtitle(f.def.name, line.text || '', line.big); f.override = line.pose || 'intro'; f.state = 'intro'; f.t = 0;
      if (line.sfx) AU.sfx(line.sfx);
      this.introLen = line.len || 170;
    }
    if (this.pt >= this.introLen || skip) {
      HUD.subtitle(null); f.override = null; f.state = 'idle';
      if (this.introStep === 0) { this.introStep = 1; this.pt = 0; this.firstCam = true; }
      else { this.phase = 'roundIntro'; this.pt = 0; this.firstCam = true; }
    }
  }
  stepOutro(ins) {
    const W = this.winner, Lo = this.f[1 - this.f.indexOf(W)];
    const skip = ins.some(I => I && (I.p.LP || I.p.RP || I.p.ANY)) && this.pt > 30;
    if (this.pt === 1) { const l = Lo.def.lines.lose; HUD.subtitle(Lo.def.name, l.text || '', l.big); Lo.override = l.pose; Lo.state = 'outro'; Lo.t = 0; W.override = 'idleWin'; this.outroWho = Lo; if (l.sfx) AU.sfx(l.sfx); }
    if (this.pt === 170 || (skip && this.outroWho === Lo && this.pt < 170)) { this.firstCam = true;
      this.pt = 171; const l = W.def.lines.win; HUD.subtitle(W.def.name, l.text || '', l.big, l.fx); W.override = l.pose; W.state = 'outro'; W.t = 0; this.outroWho = W;
      if (l.music) AU.music(l.music); else AU.music(null); if (l.sfx) AU.sfx(l.sfx);
      this.outroEnd = 171 + (l.len || 230); if (W.def.winScene) W.def.winScene(this, W, Lo);
    }
    if (this.pt > 171 && (this.pt >= this.outroEnd || (skip && this.pt > 200))) { this.phase = 'done'; HUD.subtitle(null); if (this.o.onEnd) this.o.onEnd({ winner: this.f.indexOf(W) }); }
  }
  timeOver() {
    if (this.phase !== 'fight') return;
    const [a, b] = this.f; HUD.banner('TEMPO!', 'big'); AU.announce('Time');
    const w = a.hp === b.hp ? null : a.hp > b.hp ? a : b;
    this.roundWinner = w; this.phase = 'ko'; this.pt = 40; if (w) w.wins++;
  }
  ko(loser) {
    if (this.phase !== 'fight') return;
    const w = this.f[1 - this.f.indexOf(loser)]; this.roundWinner = w; w.wins++;
    this.phase = 'ko'; this.pt = 0; this.slow = .3; this.slowT = 1.1;
    HUD.banner('K.O.', 'ko'); AU.announce('K.O.'); AU.sfx('ko'); this.shake = .5;
  }
  endRound() {
    HUD.rounds(this.f.map(f => f.wins));
    const w = this.roundWinner;
    if (w && w.wins >= WIN_ROUNDS) { this.winner = w; this.phase = 'outro'; this.pt = 0; AU.music(null); this.firstCam = true;
      for (const f of this.f) if (f.state !== 'down' && f.state !== 'fall') { f.state = 'idle'; } return; }
    this.phase = 'roundEnd'; this.pt = 0;
    if (w) { w.override = 'idleWin'; }
  }
  nextRound() {
    this.round++;
    if (this.round > 5) { this.winner = this.f[0].wins >= this.f[1].wins ? this.f[0] : this.f[1]; this.phase = 'outro'; this.pt = 0; return; }
    for (const f of this.f) f.override = null;
    this.resetRound(false);
  }
  /* --- un lottatore, un passo --- */
  stepFighter(me, op, I) {
    me.t++;
    const toOp = new V3().subVectors(op.pos, me.pos); toOp.y = 0; const dist = toOp.length(); const want = Math.atan2(toOp.x, toOp.z);
    const track = ['idle', 'walk', 'crouch', 'side', 'dash', 'blockH', 'blockL', 'hit', 'jump'].includes(me.state) || (me.state === 'attack' && me.t < me.move.start - 2);
    if (track) me.yaw += angDiff(me.yaw, want) * (me.state === 'attack' ? .25 : .35);
    const F = me.fwd, Rt = new V3(-F.z, 0, F.x);   // destra rispetto all'avversario
    const ground = me.y <= 0;
    me.lastIn = I;
    const free = ['idle', 'walk', 'crouch'].includes(me.state);
    if (free) {
      if (I.p.SP && !me.specialUsed && me.hp <= MAXHP * .25) { this.trySpecial(me, op); return; }
      const mv = chooseMove(me.style, I, I.y < -.5, false);
      if (mv) { this.startMove(me, mv); }
      else if (I.p.SIDE) { me.set('side'); me.sideDir = I.p.SIDE > 0 ? 1 : -1; AU.sfx('step'); }
      else if (I.p.DASH) { me.set('dash'); me.dashDir = I.p.DASH < 0 ? -1 : 1; AU.sfx('step'); }
      else if (I.y > .5 && I.h.jumpHold) { me.set('jump'); me.vy = 5.2; me.vel.copy(F).multiplyScalar(I.x * 2.2); AU.sfx('whoosh'); }
      else if (I.y < -.5) { if (me.state !== 'crouch') me.set('crouch'); }
      else if (Math.abs(I.x) > .3) { if (me.state !== 'walk') me.set('walk', true); me.walkDir = Math.sign(I.x); }
      else if (me.state !== 'idle') me.set('idle', me.state === 'walk');
    }
    switch (me.state) {
      case 'walk': {
        const sp = me.walkDir > 0 ? 1.85 : 1.5; me.pos.addScaledVector(F, me.walkDir * sp * DT); me.walkPh += me.walkDir * sp * DT / .32 * Math.PI; break;
      }
      case 'side': { const k = Math.sin(clamp(me.t / 16, 0, 1) * Math.PI); me.pos.addScaledVector(Rt, me.sideDir * k * 3.3 * DT); if (me.t >= 16) me.set('idle'); break; }
      case 'dash': { const k = 1 - me.t / 14; me.pos.addScaledVector(F, me.dashDir * Math.max(0, k) * 6 * DT); if (me.t >= 14) me.set('idle'); break; }
      case 'jump': {
        me.vy -= G * DT; me.y += me.vy * DT; me.pos.addScaledVector(me.vel, DT);
        const mv = me.t > 4 ? chooseMove(me.style, I, false, true) : null; if (mv && !me.airAtk) { me.airAtk = true; me.move = mv; me.moveT = 0; me.hitDone = false; AU.sfx('whoosh'); }
        if (me.airAtk) { me.moveT++; if (me.moveT >= mv_start(me) && me.moveT < mv_start(me) + me.move.act) this.hitCheck(me, op, me.moveT - mv_start(me)); }
        if (me.y <= 0) { me.y = 0; me.vy = 0; me.vel.set(0, 0, 0); me.airAtk = false; me.move = null; me.set('land'); AU.sfx('land'); }
        break;
      }
      case 'land': if (me.t >= 8) me.set('idle'); break;
      case 'attack': {
        const mv = me.move;
        if (me.t < mv.start) me.pos.addScaledVector(F, (mv.kick ? .25 : .55) * DT);
        // catene: se premi il tasto giusto nella finestra parte la mossa successiva
        if (mv.next && mv.win) {
          for (const k in mv.next) if (I.p[k] && me.t <= mv.win[1]) me.queued = STYLES[me.style][mv.next[k]];
          if (me.queued && me.t >= mv.win[0] && (me.hitDone || me.t > mv.start + mv.act)) { const nx = me.queued; me.queued = null; this.startMove(me, nx, true); break; }
        }
        if (me.t >= mv.start && me.t < mv.start + mv.act) this.hitCheck(me, op, me.t - mv.start);
        if (me.t >= mv.dur) { me.move = null; me.queued = null; me.set(me.lastIn && me.lastIn.y < -.5 ? 'crouch' : 'idle'); }
        break;
      }
      case 'hit': case 'blockH': case 'blockL': if (me.t >= me.stun) me.set(me.state === 'blockL' ? 'crouch' : 'idle'); break;
      case 'air': {
        me.vy -= G * DT; me.y += me.vy * DT; me.pos.addScaledVector(me.vel, DT);
        if (me.y <= 0 && me.vy < 0) { me.y = 0; me.vy = 0; me.vel.multiplyScalar(.3); me.set('down'); me.blendDur = 5; AU.sfx('fall'); FX.dust(me.pos); this.shake = Math.max(this.shake, .15); }
        break;
      }
      case 'fall': me.pos.addScaledVector(me.vel, DT); me.vel.multiplyScalar(.92); if (me.t === 30) { AU.sfx('fall'); FX.dust(me.pos); this.shake = Math.max(this.shake, .25); } if (me.t >= 44) me.set('down', true); break;
      case 'down':
        me.pos.addScaledVector(me.vel, DT); me.vel.multiplyScalar(.85);
        if (me.hp > 0 && this.phase === 'fight' && ((me.t > 25 && (I.p.LP || I.p.RP || I.p.LK || I.p.RK || I.y > .5 || I.x !== 0)) || me.t > 75)) me.set('getup', true);
        break;
      case 'getup': if (me.t >= 26) me.set('idle', true); break;
      case 'grabbing': this.stepThrow(me, op); break;
      case 'thrown': break;
      case 'spStart': if (me.t === 14) this.fireSpecial(me, op); break;
      case 'spWhiff': if (me.t >= 46) me.set('idle'); break;
    }
    if (me.state !== 'jump' && me.state !== 'air' && me.y > 0) { me.y = Math.max(0, me.y - 3 * DT); }
    if (['hit', 'blockH', 'blockL', 'idle', 'walk', 'crouch', 'attack', 'land', 'getup'].includes(me.state)) { me.pos.addScaledVector(me.vel, DT); me.vel.multiplyScalar(.82); }
    const bd = this.arena && ARENAS[this.arena] && ARENAS[this.arena].bounds;
    if (bd) { me.pos.x = clamp(me.pos.x, -bd[0], bd[0]); me.pos.z = clamp(me.pos.z, -bd[1], bd[1]); }
    else { const r = Math.hypot(me.pos.x, me.pos.z); if (r > ARENA_R) me.pos.multiplyScalar(ARENA_R / r); }
  }
  startMove(me, mv, chained) {
    me.move = mv; me.set('attack'); me.hitDone = false; me.queued = null; if (!chained) me.combo = 0;
    if (mv.level === 't') AU.sfx('whoosh'); else setTimeout(() => AU.sfx(mv.kick ? 'whooshK' : 'whoosh'), mv.start * 10);
  }
  separate() {
    const [a, b] = this.f; const d = new V3().subVectors(b.pos, a.pos); d.y = 0; const L = d.length(), min = .74;
    if (a.state === 'thrown' || b.state === 'thrown' || a.state === 'down' || b.state === 'down') return;
    if (L < min && Math.abs(a.y - b.y) < 1.2) { if (L < 1e-4) d.set(1, 0, 0); else d.multiplyScalar(1 / L); const push = (min - L) / 2; a.pos.addScaledVector(d, -push); b.pos.addScaledVector(d, push); }
  }
  /* --- colpi --- */
  hitCheck(att, def, k) {
    const mv = att.move; if (att.hitDone || !mv) return;
    const v = new V3().subVectors(def.pos, att.pos); v.y = 0; const d = v.length();
    if (d > mv.reach + (def.state === 'air' ? .25 : 0)) return;
    const ang = Math.abs(angDiff(att.yaw, Math.atan2(v.x, v.z))); if (ang > .8) return;
    if (['down', 'getup', 'fall', 'thrown', 'spV', 'grabbing'].includes(def.state)) return;
    if (mv.level === 'h' && def.crouching && def.state !== 'air') return;
    if (def.state === 'air' && mv.level === 'l') return;
    if (Math.abs(def.y - att.y) > 1.3) return;
    att.hitDone = true;
    if (mv.level === 't') { if (def.crouching || def.state === 'air' || def.state === 'jump') { att.hitDone = false; return; } this.startThrow(att, def); return; }
    const I = def.lastIn || { x: 0, y: 0, h: {} }, human = !this.cpu[this.f.indexOf(def)];
    const canBlock = ['idle', 'walk', 'crouch', 'blockH', 'blockL', 'land'].includes(def.state) && (human ? (I.x < .3 && !(def.state === 'walk' && def.walkDir > 0)) : !!(I.h && I.h.block));
    const crouchBlock = def.crouching || def.state === 'blockL';
    const blocked = canBlock && (mv.level === 'l' ? crouchBlock : !crouchBlock);
    const hitPos = this.limbPos(att, mv.limb);
    if (blocked) {
      def.set(mv.level === 'l' ? 'blockL' : 'blockH'); def.stun = mv.bs; def.react = reactTrack(mv.level === 'l' ? 'bl' : 'bh', mv.bs);
      def.vel.copy(att.fwd).multiplyScalar(mv.kb * .7 + .6);
      this.hitstop = 4; AU.sfx('block'); FX.spark(hitPos, 0xbfe4ff, 6, .6); return;
    }
    const counter = def.state === 'attack' && def.move && def.t < def.move.start;
    const juggle = def.state === 'air' || def.state === 'hit';
    att.combo = juggle ? att.combo + 1 : 1;
    let dmg = mv.dmg * (mv.kick ? (att.def.kickMul || 1) : 1) * (counter ? 1.25 : 1) * (juggle ? Math.pow(.82, att.combo - 1) : 1);
    dmg = Math.max(1, Math.round(dmg));
    def.hp = Math.max(0, def.hp - dmg);
    const strong = mv.kick || dmg >= 10;
    this.hitstop = strong ? 8 : 5; this.shake = Math.max(this.shake, strong ? .22 : .1);
    AU.sfx(mv.sfx === 'K' ? 'kickHard' : mv.kick ? 'kick' : strong ? 'punchHard' : 'punch'); AU.grunt(def);
    FX.spark(hitPos, counter ? 0xffd040 : 0xffffff, strong ? 14 : 9, strong ? 1.2 : .8); FX.ring(hitPos, strong);
    if (counter) HUD.flashText(def === this.f[0] ? 1 : 0, 'CONTRATTACCO!');
    if (att.combo >= 2) HUD.combo(this.f.indexOf(att), att.combo);
    def.move = null;
    if (def.hp <= 0) {
      def.set('air'); def.vy = 3.6; def.vel.copy(att.fwd).multiplyScalar(2.6); def.y = Math.max(def.y, .05); this.ko(def); return;
    }
    if (mv.launch || def.state === 'air') {
      def.set('air', def.state === 'air'); def.vy = mv.launch ? mv.launch : Math.max(2.2, def.vy * .3 + 2.4); def.y = Math.max(def.y, .05); def.vel.copy(att.fwd).multiplyScalar(1.2);
    } else if (mv.kd || (mv.kdCounter && counter)) {
      def.set('fall'); def.vel.copy(att.fwd).multiplyScalar(2.4); this.slow = .6; this.slowT = .35;
    } else {
      def.set('hit'); def.stun = mv.hs + (counter ? 6 : 0);
      def.react = reactTrack(mv.level, def.stun, Math.random() < .5 ? 1 : -1); def.vel.copy(att.fwd).multiplyScalar(mv.kb);
    }
  }
  limbPos(f, limb) {
    const b = { lh: f.av.B.lHa, rh: f.av.B.rHa, lf: f.av.B.lFt, rf: f.av.B.rFt }[limb] || f.av.B.head;
    f.av.obj.updateMatrixWorld(true); return b.getWorldPosition(new V3());
  }
  /* --- prese --- */
  startThrow(att, def) {
    att.set('grabbing'); def.set('thrown'); def.move = null; def.override = 'thrown'; def.throwLift = def.throwSlam = 0;
    this.throwData = { a: att, d: def, yaw: att.yaw, d0: Math.max(.6, att.pos.distanceTo(def.pos)) };
    AU.sfx('grab'); this.hitstop = 4; this.shake = .08;
  }
  stepThrow(att, def) {
    const t = att.t, T = this.throwData, F = new V3(Math.sin(T.yaw), 0, Math.cos(T.yaw));
    if (t < 44) {
      const grab = smooth(clamp(t / 10, 0, 1)), lift = smooth(clamp((t - 12) / 20, 0, 1)), slam = easeIn(clamp((t - 34) / 10, 0, 1));
      def.yaw = T.yaw + Math.PI; att.yaw = T.yaw;
      def.pos.copy(att.pos).addScaledVector(F, lerp(T.d0, .44, grab) - lift * .04 + slam * .8);
      def.y = lift * .55 * (1 - slam); def.throwLift = lift; def.throwSlam = slam; def.override = 'thrown';
      if (t === 12) { AU.sfx('whoosh'); AU.grunt(att); this.slow = .55; this.slowT = .7; }
      if (t === 34) AU.sfx('whooshK');
    } else if (t === 44) {
      def.override = null; def.y = 0; def.set('down', true); def.pose = clonePose(LYING); def.from = null;
      def.hp = Math.max(0, def.hp - 16); AU.sfx('slam'); AU.grunt(def, true); this.shake = .45; FX.dust(def.pos); FX.dust(def.pos.clone().addScaledVector(F, 1)); this.hitstop = 8;
      HUD.flashText(this.f.indexOf(att) ? 1 : 0, 'PRESA!');
      if (def.hp <= 0) this.ko(def);
    }
    if (t >= 70) att.set('idle');
  }
  // le mani di chi afferra restano sul corpo di chi viene sollevato: spalle all'inizio, fianchi durante sollevamento e schianto
  gripHands(att, vic, t) {
    const w = smooth(clamp((t - 2) / 6, 0, 1)) * (1 - smooth(clamp((t - 39) / 5, 0, 1))); if (w <= 0) return;
    const B = vic.av.B, vr = vic.av.Ldir([1, 0, 0], new V3()), k = smooth(clamp((t - 10) / 8, 0, 1));
    att.av.obj.position.set(att.pos.x, att.y, att.pos.z); att.av.obj.rotation.y = att.yaw; att.av.obj.updateMatrixWorld(true); att.av.tilt.updateMatrixWorld(true);
    const spot = (side) => {
      const sh = (side > 0 ? B.rUp : B.lUp).getWorldPosition(new V3());
      const tor = B.spine1.getWorldPosition(new V3()).addScaledVector(vr, side * .17);
      return sh.lerp(tor, k);
    };
    for (const [hand, side] of [['lh', 1], ['rh', -1]]) {   // mano sinistra sul fianco destro dell'avversario e viceversa
      const loc = att.av.tilt.worldToLocal(spot(side)); const v = [-loc.x, loc.y, loc.z], cur = att.pose[hand];
      att.pose[hand] = [lerp(cur[0], v[0], w), lerp(cur[1], v[1], w), lerp(cur[2], v[2], w)];
    }
    att.pose.fist = lerp(att.pose.fist, .55, w);
  }
  /* --- mossa speciale --- */
  trySpecial(me, op) {
    me.specialUsed = true; me.set('spStart'); this.slow = .35; this.slowT = .4; AU.sfx('special'); HUD.specialFlash(this.f.indexOf(me));
  }
  fireSpecial(me, op) {
    const d = me.pos.distanceTo(op.pos);
    if (d > 3.8 || ['down', 'air', 'fall', 'thrown', 'getup'].includes(op.state)) { me.set('spWhiff'); return; }
    const sp = SPECIALS[me.id]; if (!sp) { me.set('idle'); return; }
    this.special = { def: sp, a: me, d: op, t: 0, data: {} }; me.set('sp', true); op.set('spV', true); op.move = null;
    sp.start(this, me, op, this.special.data);
  }
  stepSpecial() {
    const S = this.special; S.t++;
    S.def.update(this, S.a, S.d, S.t, S.data);
    if (S.t >= S.def.dur) {
      if (S.def.end) S.def.end(this, S.a, S.d, S.data);
      this.special = null; this.camOverride = null;
      S.d.hp = Math.max(0, S.d.hp - S.def.dmg); S.a.override = null; S.d.override = null; S.a.set('idle');
      S.d.set('down', true); S.d.pose = clonePose(LYING); S.d.from = null; S.d.y = 0;
      if (S.d.hp <= 0) this.ko(S.d);
    }
  }
  /* --- rendering --- */
  render(dt) {
    // chi viene afferrato si mette in posa per primo: le mani di chi afferra lo seguono
    const order = this.f[1].state === 'thrown' ? [this.f[1], this.f[0]] : this.f;
    for (const f of order) { this.poseFighter(f, dt); f.av.tickFace(dt); }
    this.updateCamera(dt);
    HUD.update(this);
  }
  poseFighter(f, dt) {
    let target;
    const tt = f.t + (this.acc / DT);
    const ov = f.override;
    if (ov) target = OVERRIDE_POSES(ov, f, this);
    else switch (f.state) {
      case 'idle': case 'land': {
        const b = Math.sin(this.frame * .09 + f.side) * .012; target = clonePose(GUARD); target.hip = [0, GUARD.hip[1] + b, 0];
        target.lh = [GUARD.lh[0], GUARD.lh[1] + b * 1.5, GUARD.lh[2]]; target.rh = [GUARD.rh[0], GUARD.rh[1] + b * 1.5, GUARD.rh[2]];
        if (f.state === 'land') target.hip[1] -= .1;
        break;
      }
      case 'walk': {
        const ph = f.walkPh, s = Math.sin(ph); target = clonePose(GUARD);
        target.lf = [GUARD.lf[0], .1 + Math.max(0, s) * .07, GUARD.lf[2] + s * .1]; target.rf = [GUARD.rf[0], .1 + Math.max(0, -s) * .07, GUARD.rf[2] - s * .1];
        target.hip = [0, GUARD.hip[1] - Math.abs(s) * .015, 0]; break;
      }
      case 'side': { const k = Math.sin(clamp(f.t / 16, 0, 1) * Math.PI); target = clonePose(GUARD); target.hip = [f.sideDir * k * .06, -.12, 0]; target.lf = [GUARD.lf[0] + f.sideDir * k * .15, .1 + k * .08, GUARD.lf[2]]; target.cr = f.sideDir * k * .15; break; }
      case 'dash': target = clonePose(GUARD); target.hip = [0, -.12, f.dashDir * .06]; target.cp = .15 * f.dashDir; break;
      case 'crouch': target = clonePose(CROUCH); break;
      case 'jump': target = f.airAtk && f.move ? f.move.track(f.moveT) : P({ hip: [0, -.05, 0], lf: [-.12, .45, .15], rf: [.15, .4, -.1], lk: [-.2, .3, 1], rk: [.2, .3, 1], lh: [-.25, 1.55, .3], rh: [.2, 1.5, .2] }); break;
      case 'attack': target = f.move.track(Math.min(tt, f.move.dur)); break;
      case 'hit': case 'blockH': case 'blockL': target = f.react ? f.react(tt) : clonePose(GUARD); break;
      case 'air': target = clonePose(AIRBORNE); target.brx = clamp(-.4 - (f.t * .03), -1.5, 0); break;
      case 'fall': target = FALL(tt); break;
      case 'down': target = clonePose(LYING); target.cp = Math.sin(this.frame * .05) * .02; break;
      case 'getup': target = GETUP(tt); break;
      case 'grabbing': target = GRAB_ATT(Math.min(tt, 70)); break;
      case 'spStart': target = P({ hip: [0, -.12, 0], cp: .15, hp: .3, lh: [-.25, 1.25, .2], rh: [.25, 1.25, .2], fist: 1, jaw: .4 }); break;
      case 'spWhiff': target = P({ cp: -.1, hp: -.2, lh: [-.4, 1.3, .3], rh: [.4, 1.3, .3], fist: 0, jaw: .3 }); break;
      default: target = clonePose(GUARD);
    }
    if (f.from && f.blendT < 1) { f.blendT = Math.min(1, f.blendT + dt * FPS / f.blendDur); f.pose = mixPose(f.from, target, smooth(f.blendT)); }
    else f.pose = target;
    if (f.state === 'grabbing' && this.throwData && this.throwData.a === f) this.gripHands(f, this.throwData.d, tt);
    const o = f.av.obj; o.position.set(f.pos.x, f.y, f.pos.z); o.rotation.y = f.yaw;
    f.av.apply(f.pose);
  }
  updateCamera(dt) {
    const [a, b] = this.f;
    let pos, look;
    if (this.camOverride) { pos = this.camOverride.pos; look = this.camOverride.look; }
    else if (this.phase === 'intro' || (this.phase === 'outro' && this.outroWho)) {
      const f = this.phase === 'intro' ? this.f[this.introStep] : this.outroWho;
      const fw = f.fwd, side = new V3(-fw.z, 0, fw.x).multiplyScalar(f === a ? -1 : 1);
      const k = (this.pt % 1000) / 200;
      pos = f.pos.clone().addScaledVector(fw, 1.45 - k * .2).addScaledVector(side, 1.0 + k * .2); pos.y = 1.55;
      look = f.pos.clone(); look.y = 1.38 + (f.state === 'down' ? -1 : 0);
      if (f.def.camFocus && f.override && f.def.camFocus[f.override]) { const c = f.def.camFocus[f.override](f); pos = c.pos; look = c.look; }
    } else {
      const mid = a.pos.clone().add(b.pos).multiplyScalar(.5); const ax = new V3().subVectors(b.pos, a.pos); ax.y = 0;
      const sep = ax.length(); ax.normalize(); let n = new V3(-ax.z, 0, ax.x);
      if (n.dot(this.lastN || n) < 0) n.negate(); this.lastN = n.clone();
      const aspect = camera.aspect, dist = clamp(2.2 + sep * .95 / Math.min(1, aspect / 1.6), 3.2, 8);
      pos = mid.clone().addScaledVector(n, dist); pos.y = 1.42 + sep * .06; look = mid.clone(); look.y = (IS_TOUCH ? .86 : 1.0) + Math.max(a.y, b.y) * .4;
    }
    const cb = ARENAS[this.arena] && ARENAS[this.arena].cam; if (cb) { pos = pos.clone(); pos.x = clamp(pos.x, -cb[0], cb[0]); pos.z = clamp(pos.z, -cb[1], cb[1]); }
    const k = this.firstCam ? 1 : 1 - Math.exp(-dt * (this.camOverride ? 10 : 5));
    this.camPos.lerp(pos, k); this.camLook.lerp(look, k); this.firstCam = false;
    camera.position.copy(this.camPos); camera.lookAt(this.camLook);
    if (this.shake > 0) { camera.position.x += (Math.random() - .5) * this.shake * .25; camera.position.y += (Math.random() - .5) * this.shake * .25; this.shake = Math.max(0, this.shake - dt * 1.6); }
  }
}
function mv_start(f) { return f.move ? f.move.start : 0; }
