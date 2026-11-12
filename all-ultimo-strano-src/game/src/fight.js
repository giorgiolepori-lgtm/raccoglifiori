'use strict';
/* ===== Combattimento: pose, mosse, lottatori, IA ===== */
const FPS = 60, DT = 1 / FPS;
const ARENA_R = 6.2;
const MAXHP = 100;

/* --- pose base (coordinate: [destra, alto, avanti] in metri, rispetto ai piedi) --- */
const GUARD = { hip: [0, -.11, 0], yaw: .3, pitch: 0, roll: 0, cy: -.05, cp: .06, cr: 0, hy: 0, hp: .1, hr: 0, lsh: 0, rsh: 0,
  lh: [-.13, 1.4, .41], rh: [.07, 1.37, .28], le: [-.15, -1, -.1], re: [.2, -1, -.1], lho: [0, .3, 1, 0, 1, 0], rho: [-.1, .35, 1, 0, 1, 0],
  lf: [-.12, .1, .17], rf: [.17, .1, -.2], lk: [-.2, 0, 1], rk: [.3, 0, 1], lfd: [.25, -.05, 1], rfd: [.55, -.2, .8],
  fist: 1, jaw: 0, bx: 0, by: 0, bz: 0, brx: 0, bry: 0, brz: 0 };
const P = (o) => Object.assign(clonePose(GUARD), o);
const CROUCH = P({ hip: [0, -.36, -.06], yaw: .2, cp: .32, hp: -.15, lh: [-.12, 1.0, .42], rh: [.08, .97, .32], lf: [-.17, .1, .13], rf: [.2, .1, -.12], lk: [-.35, .1, 1], rk: [.45, .1, 1], lfd: [.1, -.05, 1], rfd: [.4, -.05, .9] });
const BLOCK_H = P({ hp: .25, cp: .16, lh: [-.08, 1.4, .3], rh: [.08, 1.39, .28], le: [-.1, -1, .2], re: [.1, -1, .2], lho: [0, 1, .2, 1, 0, 0], rho: [0, 1, .2, -1, 0, 0], hip: [0, -.13, -.03] });
const BLOCK_L = P(Object.assign(clonePose(CROUCH), { lh: [-.1, 1.15, .3], rh: [.08, 1.12, .26], hp: .1 }));
const LYING = P({ lho: [0, 1, 0], rho: [0, 1, 0], brx: -1.57, by: .13, hip: [0, -.15, 0], cp: 0, hp: .3, yaw: 0, cy: 0, lh: [-.45, 1.25, .05], rh: [.42, 1.3, -.05], le: [-1, 0, 0], re: [1, 0, 0],
  lf: [-.18, .1, .1], rf: [.15, .25, .3], lk: [-.3, 0, 1], rk: [.2, .6, 1], lfd: [-.3, .5, .6], rfd: [.3, .5, .6], fist: .4, jaw: .3 });
const AIRBORNE = P({ lho: [0, 1, 0], rho: [0, 1, 0], brx: -.7, cp: -.3, hp: -.4, lh: [-.5, 1.6, -.1], rh: [.5, 1.55, -.15], le: [-1, 0, 0], re: [1, 0, 0], lf: [-.15, .25, .3], rf: [.15, .1, -.1], fist: .3, jaw: .5 });

/* --- mosse dello stile "standard con calci da calciatore" --- */
function M(o) { return Object.assign({ level: 'h', dmg: 5, reach: 1.25, start: 10, act: 3, dur: 30, hs: 16, bs: 10, kb: .6, limb: 'lh', sfx: 'p', track: null }, o); }
const STYLE_STD = {
  jab: M({ name: 'Diretto', start: 9, act: 3, dur: 24, dmg: 5, reach: 1.28, hs: 15, bs: 9, kb: .4, limb: 'lh', next: { LP: 'jab2', RP: 'cross2' }, win: [10, 20],
    keys: [{ f: 0 }, { f: 5, lh: [-.1, 1.47, .45] }, { f: 9, e: 'o', lh: [-.03, 1.46, .78], le: [-.4, -.3, -.4], lho: [0, 0, 1, 1, 0, 0], lsh: .35, cy: -.32, cp: .1, yaw: .45, hip: [0, -.12, .04] }, { f: 13 }, { f: 23, lh: GUARD.lh, le: GUARD.le, lho: GUARD.lho, lsh: 0, cy: GUARD.cy, cp: GUARD.cp, yaw: GUARD.yaw, hip: GUARD.hip }] }),
  cross: M({ name: 'Dritto', start: 12, act: 3, dur: 30, dmg: 8, reach: 1.32, hs: 17, bs: 11, kb: .9, limb: 'rh', next: { RK: 'volley' }, win: [13, 25],
    keys: [{ f: 0 }, { f: 6, rh: [.06, 1.44, .15], yaw: .2 }, { f: 12, e: 'o', rh: [-.03, 1.46, .82], re: [.4, -.3, -.4], rho: [0, 0, 1, -1, 0, 0], rsh: .4, cy: -.6, cp: .12, yaw: -.1, rfd: [.4, -.35, .9], rf: [.15, .12, -.18], hip: [0, -.13, .07] }, { f: 16 }, { f: 29, rh: GUARD.rh, re: GUARD.re, rho: GUARD.rho, rsh: 0, cy: GUARD.cy, cp: GUARD.cp, yaw: GUARD.yaw, rfd: GUARD.rfd, rf: GUARD.rf, hip: GUARD.hip }] }),
  hook: M({ name: 'Gancio', start: 14, act: 3, dur: 34, dmg: 10, reach: 1.15, hs: 19, bs: 12, kb: 1, limb: 'lh',
    keys: [{ f: 0 }, { f: 6, lh: [-.4, 1.38, .3], le: [-.8, .1, -.3], lho: [.3, .2, 1, 0, 1, 0], cy: .25 }, { f: 14, e: 'o', lh: [.08, 1.44, .55], le: [-.9, .25, 0], lho: [1, 0, .5, 0, 1, 0], cy: -.45, yaw: .05, hip: [0, -.14, 0] }, { f: 18 }, { f: 33, lh: GUARD.lh, le: GUARD.le, lho: GUARD.lho, cy: GUARD.cy, yaw: GUARD.yaw, hip: GUARD.hip }] }),
  body: M({ name: 'Al fegato', level: 'm', start: 15, act: 3, dur: 34, dmg: 11, reach: 1.12, hs: 20, bs: 12, kb: .8, limb: 'rh',
    keys: [{ f: 0 }, { f: 7, rh: [.25, 1.1, .2], rho: [0, .3, 1, 0, 1, 0], hip: [0, -.18, 0], cy: .1 }, { f: 15, e: 'o', rh: [-.05, 1.12, .58], re: [.8, 0, -.2], rho: [-1, .2, .6, 0, 1, 0], cy: -.5, cp: .15, hip: [0, -.22, .05] }, { f: 19 }, { f: 33, rh: GUARD.rh, re: GUARD.re, rho: GUARD.rho, hip: GUARD.hip, cy: GUARD.cy, cp: GUARD.cp }] }),
  upper: M({ name: 'Montante', level: 'm', start: 15, act: 3, dur: 42, dmg: 12, reach: 1.1, hs: 30, bs: 14, kb: .3, launch: 4.6, limb: 'rh',
    keys: [{ f: 0, hip: [0, -.32, 0], cp: .2, rh: [.1, 1.0, .3] }, { f: 8, hip: [0, -.3, 0], rh: [.1, .98, .3] }, { f: 15, e: 'o', hip: [0, -.04, .05], rh: [-.02, 1.5, .42], re: [.3, -1, .1], rho: [0, 1, .3, -1, 0, 0], cy: -.45, cp: -.08 }, { f: 21 }, { f: 41, hip: GUARD.hip, rh: GUARD.rh, re: GUARD.re, rho: GUARD.rho, cy: GUARD.cy, cp: GUARD.cp }] }),
  lowkick: M({ name: 'Calcio basso', level: 'l', start: 13, act: 3, dur: 32, dmg: 8, reach: 1.38, hs: 17, bs: 13, kb: .4, limb: 'rf', sfx: 'k', kick: true, next: { RK: 'volley' }, win: [14, 26],
    keys: [{ f: 0 }, { f: 6, yaw: .55, hip: [0, -.05, .05], lf: [-.1, .1, .25] }, { f: 13, e: 'o', rf: [-.05, .35, .8], rk: [.8, .3, .4], rfd: [.9, -.2, .4], yaw: .85, cy: -.1, cp: -.1, lh: [-.22, 1.4, .3] }, { f: 17 }, { f: 31, rf: GUARD.rf, rk: GUARD.rk, rfd: GUARD.rfd, yaw: GUARD.yaw, cy: GUARD.cy, cp: 0, lh: GUARD.lh, hip: GUARD.hip, lf: GUARD.lf }] }),
  volley: M({ name: 'Tiro al volo', start: 17, act: 4, dur: 46, dmg: 15, reach: 1.5, hs: 24, bs: 16, kb: 2, limb: 'rf', sfx: 'K', kick: true, kdCounter: true,
    keys: [{ f: 0 }, { f: 8, yaw: .7, roll: -.15, rf: [.25, .5, -.25], rk: [.4, .3, 1], rfd: [.3, -.6, .6] }, { f: 17, e: 'o', rf: [-.1, 1.38, .68], rk: [.9, .4, .2], rfd: [1, 0, .3], yaw: 1.1, roll: -.35, cp: -.2, cy: .1, lh: [-.35, 1.3, .25], rh: [.4, 1.2, -.1], hip: [0, .02, 0] }, { f: 22 }, { f: 31, rf: [.1, .4, .2], roll: -.1 }, { f: 45, rf: GUARD.rf, rk: GUARD.rk, rfd: GUARD.rfd, yaw: GUARD.yaw, roll: 0, cp: 0, cy: GUARD.cy, lh: GUARD.lh, rh: GUARD.rh, hip: GUARD.hip }] }),
  punta: M({ name: 'Punta', level: 'm', start: 15, act: 4, dur: 40, dmg: 12, reach: 1.5, hs: 20, bs: 14, kb: 2.6, limb: 'rf', sfx: 'k', kick: true,
    keys: [{ f: 0 }, { f: 6, rf: [.1, .6, .1], rk: [.1, .4, 1], yaw: .2 }, { f: 15, e: 'o', rf: [0, .98, .88], rk: [.1, .5, 1], rfd: [0, .3, 1], cp: -.25, hip: [0, 0, -.05] }, { f: 19 }, { f: 39, rf: GUARD.rf, rk: GUARD.rk, rfd: GUARD.rfd, cp: 0, hip: GUARD.hip, yaw: GUARD.yaw }] }),
  sweep: M({ name: 'Scivolata', level: 'l', start: 18, act: 5, dur: 52, dmg: 12, reach: 1.5, hs: 30, bs: 18, kb: .5, kd: true, limb: 'rf', sfx: 'k', kick: true, low: true,
    keys: [{ f: 0, ...CROUCH }, { f: 8, hip: [0, -.5, 0], cp: .45, lh: [-.3, .35, .3], lho: [0, -1, .3, 1, 0, 0], lf: [-.12, .1, .05], rf: [.25, .1, -.15] },
      { f: 18, e: 'o', hip: [0, -.55, -.05], cp: .5, yaw: 1.1, cy: .2, lh: [-.35, .14, .3], le: [-.6, .2, 0], rh: [.1, .85, .3], lf: [-.08, .1, .02], lk: [-.4, .3, 1], rf: [-.45, .12, .78], rk: [.5, .7, .2], rfd: [1, 0, .3] }, { f: 26 }, { f: 51, ...CROUCH }] }),
  poke: M({ name: 'Punta bassa', level: 'l', start: 11, act: 3, dur: 28, dmg: 6, reach: 1.35, hs: 14, bs: 10, kb: .3, limb: 'lf', sfx: 'k', kick: true, low: true,
    keys: [{ f: 0, ...CROUCH }, { f: 11, e: 'o', lf: [-.05, .15, .78], lk: [-.4, .3, 1], lfd: [-.2, -.3, 1], hip: [0, -.4, -.06] }, { f: 15 }, { f: 27, ...CROUCH }] }),
  jab2: null, cross2: null,
  grab: M({ name: 'Presa', level: 't', start: 10, act: 2, dur: 34, dmg: 14, reach: .95, limb: 'lh', sfx: 'g',
    keys: [{ f: 0 }, { f: 6, lh: [-.18, 1.35, .62], rh: [.18, 1.35, .62], le: [-1, -.3, 0], re: [1, -.3, 0], lho: [0, 0, 1, 1, 0, 0], rho: [0, 0, 1, -1, 0, 0], cp: .15, fist: .2 }, { f: 12 }, { f: 33, lh: GUARD.lh, rh: GUARD.rh, le: GUARD.le, re: GUARD.re, lho: GUARD.lho, rho: GUARD.rho, cp: GUARD.cp, fist: 1 }] }),
  jumpkick: M({ name: 'Calcio volante', level: 'm', start: 7, act: 6, dur: 999, dmg: 13, reach: 1.45, hs: 20, bs: 12, kb: 1.6, limb: 'rf', sfx: 'K', kick: true, air: true,
    keys: [{ f: 0, lf: [-.1, .6, .2], rf: [.15, .5, -.1], lk: [-.2, .5, 1], rk: [.2, .5, 1] }, { f: 7, e: 'o', rf: [0, .95, .85], rfd: [0, .2, 1], lf: [-.1, .55, -.05], cp: -.2 }, { f: 16 }] }),
};
STYLE_STD.jab2 = Object.assign({}, STYLE_STD.jab, { name: 'Doppio diretto', start: 8, next: { RP: 'cross2' } });
STYLE_STD.cross2 = Object.assign({}, STYLE_STD.cross, { name: 'Uno-due', start: 10, next: { RK: 'volley' } });
const STYLES = { std: STYLE_STD };
// tracce precalcolate
for (const st of Object.values(STYLES)) for (const mv of Object.values(st)) if (mv && mv.keys && !mv.track) mv.track = track(GUARD, mv.keys);

/* comandi -> mossa */
function chooseMove(style, inp, crouching, air) {
  const S = STYLES[style], fwd = inp.x > .5, down = inp.y < -.5;
  if (air) return (inp.p.LK || inp.p.RK || inp.p.LP || inp.p.RP) ? S.jumpkick : null;
  if (inp.p.GR || (inp.p.LP && inp.p.RP)) return S.grab;
  if (inp.p.RK) return down || crouching ? S.sweep : fwd ? S.punta : S.volley;
  if (inp.p.LK) return down || crouching ? S.poke : S.lowkick;
  if (inp.p.RP) return down || crouching ? S.upper : fwd ? S.body : S.cross;
  if (inp.p.LP) return fwd ? S.hook : S.jab;
  return null;
}

/* reazioni ai colpi (create al volo con la durata del blocco) */
function reactTrack(kind, dur, side) {
  const s = side || 1;
  const peak = kind === 'h' ? { lho: [0, 1, 0], rho: [0, 1, 0], hp: -.55, cp: -.28, hr: .2 * s, hip: [0, -.04, -.1], lh: [-.28, 1.38, .12], rh: [.22, 1.33, .04], jaw: .6, fist: .6 }
    : kind === 'm' ? { lho: [0, 1, 0], rho: [0, 1, 0], cp: .55, hp: .25, hip: [0, -.14, -.12], lh: [-.1, 1.12, .25], rh: [.1, 1.1, .22], jaw: .5 }
    : kind === 'l' ? { hip: [0, -.18, -.05], lf: [-.08, .22, .12], cp: .2, cr: .15 * s, jaw: .3 }
    : kind === 'bh' ? clonePose(BLOCK_H) : kind === 'bl' ? clonePose(BLOCK_L) : {};
  return track(kind === 'bl' ? CROUCH : GUARD, [{ f: 0 }, { f: Math.min(4, dur * .25), e: 'o', ...peak }, { f: Math.max(6, dur * .55) }, { f: dur }]);
}
const FALL = track(GUARD, [{ f: 0, hp: -.5, cp: -.3, jaw: .6 }, { f: 10, brx: -.9, hip: [0, -.12, 0], lh: [-.5, 1.5, 0], rh: [.5, 1.5, 0], lf: [-.15, .2, .3], e: 'i' }, { f: 20, ...LYING, e: 'i' }, { f: 26, ...LYING, by: .15 }, { f: 30, ...LYING }]);
const GETUP = track(LYING, [{ f: 0 }, { f: 10, brx: -.9, by: .1, hip: [0, -.35, 0], lf: [-.15, .1, .3], rf: [.18, .1, .1], lh: [-.3, .6, -.2], rh: [.3, .6, -.2] }, { f: 18, ...CROUCH, brx: -.15, by: 0 }, { f: 26, ...GUARD }]);

/* ===== Lottatore ===== */
class Fighter {
  constructor(def, costume, side) {
    this.def = def; this.id = def.id; this.side = side;
    this.av = new Avatar(def.id, def.costumes[costume].mesh);
    this.style = def.style;
    this.pos = new V3(side < 0 ? -1.4 : 1.4, 0, 0); this.vel = new V3(); this.y = 0; this.vy = 0;
    this.yaw = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    this.hp = MAXHP; this.dispHp = MAXHP; this.lagHp = MAXHP;
    this.state = 'idle'; this.t = 0; this.move = null; this.hitDone = false;
    this.pose = clonePose(GUARD); this.from = null; this.blendT = 1; this.blendDur = 6;
    this.walkPh = 0; this.react = null; this.stun = 0; this.wins = 0;
    this.specialUsed = false; this.override = null; this.inputHist = [];
    this.guard = false; this.counterWin = false; this.combo = 0;
  }
  get crouching() { return this.state === 'crouch' || (this.state === 'attack' && this.move && this.move.low) || this.state === 'blockL'; }
  get busy() { return !['idle', 'walk', 'crouch', 'side', 'dash'].includes(this.state); }
  get fwd() { return new V3(Math.sin(this.yaw), 0, Math.cos(this.yaw)); }
  set(state, keepPose) { if (!keepPose) { this.from = clonePose(this.pose); this.blendT = 0; } this.state = state; this.t = 0; }
}

/* ===== IA ===== */
const DIFF = { facile: { react: 20, block: .25, aggr: .35, punish: .2, special: .5 }, normale: { react: 13, block: .5, aggr: .55, punish: .5, special: .8 }, difficile: { react: 8, block: .78, aggr: .7, punish: .85, special: 1 } };
class CPU {
  constructor(diff) { this.d = DIFF[diff] || DIFF.normale; this.plan = null; this.planT = 0; this.seen = 0; this.blockFor = 0; this.lastOppState = ''; }
  input(me, op, M) {
    const I = { x: 0, y: 0, p: {}, h: {} }, d = me.pos.distanceTo(op.pos), D = this.d;
    if (M.phase !== 'fight') return I;
    // difesa: l'avversario sta per colpire
    if (op.state === 'attack' && op.move && op.t < op.move.start) {
      this.seen++;
      if (this.seen === D.react) this.blockFor = Math.random() < D.block && d < op.move.reach + .5 ? op.move.start + op.move.act + 4 - op.t : 0;
    } else this.seen = 0;
    if (this.blockFor > 0 && !me.busy) { this.blockFor--; I.x = -1; I.y = op.move && op.move.level === 'l' ? -1 : 0; I.h.block = 1; return I; }
    // punizione dopo una parata
    if (me.state === 'idle' && op.state === 'attack' && op.move && op.t > op.move.start + op.move.act && d < 1.4 && Math.random() < D.punish * .15) { I.p.LP = 1; return I; }
    if (this.combo && me.state === 'attack' && me.move && me.move.win && me.t >= me.move.win[0]) { const nx = this.combo.shift(); if (nx) I.p[nx] = 1; if (!this.combo.length) this.combo = null; return I; }
    if (me.busy) { if (me.state !== 'attack') this.combo = null; return I; }
    if (!me.specialUsed && me.hp <= MAXHP * .25 && d < 3 && op.state !== 'down' && Math.random() < .02 * D.special) { I.p.SP = 1; return I; }
    if (this.planT-- <= 0) {
      const r = Math.random();
      if (d > 1.65) this.plan = r < .75 ? 'approach' : r < .85 ? 'dash' : 'wait';
      else if (d < .95) this.plan = r < .25 ? 'retreat' : r < .45 ? 'grab' : 'attack';
      else this.plan = r < D.aggr ? 'attack' : r < D.aggr + .15 ? 'side' : r < D.aggr + .25 ? 'retreat' : 'wait';
      this.planT = this.plan === 'attack' || this.plan === 'grab' ? 1 : (10 + Math.random() * 25) | 0;
    }
    switch (this.plan) {
      case 'approach': I.x = 1; break;
      case 'dash': I.p.DASH = 1; this.plan = 'approach'; break;
      case 'retreat': I.x = -1; break;
      case 'side': I.y = Math.random() < .5 ? 1 : -1; I.p.SIDE = I.y; this.plan = 'wait'; break;
      case 'grab': I.p.GR = 1; this.plan = 'wait'; break;
      case 'attack': {
        const opts = op.crouching ? ['LK', 'RK', 'dRP', 'dLK'] : ['LP', 'LP', 'RP', 'LK', 'RK', 'fRK', 'fLP', 'fRP', 'dRP', 'dRK'];
        const c = pick(opts); if (c[0] === 'f') { I.x = 1; I.p[c.slice(1)] = 1; } else if (c[0] === 'd') { I.y = -1; I.p[c.slice(1)] = 1; } else I.p[c] = 1;
        const FOL = { LP: [['RP'], ['LP', 'RP'], ['RP', 'RK']], RP: [['RK']], LK: [['RK']] }; this.combo = FOL[c] && Math.random() < .55 ? pick(FOL[c]).slice() : null; this.plan = 'wait'; break;
      }
    }
    return I;
  }
}
