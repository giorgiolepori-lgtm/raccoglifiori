'use strict';
/* ===== Audio: musica sintetizzata, effetti, annunciatore ===== */
const AU = {
  ctx: null, master: null, sfxG: null, musG: null, noise: null, on: true, musicOn: true, cur: null, seq: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try {
      const C = window.AudioContext || window.webkitAudioContext; const x = this.ctx = new C();
      this.master = x.createGain(); this.master.gain.value = .9;
      const comp = x.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 5; comp.attack.value = .003; comp.release.value = .15;
      this.master.connect(comp); comp.connect(x.destination);
      this.sfxG = x.createGain(); this.sfxG.connect(this.master); this.musG = x.createGain(); this.musG.gain.value = .5; this.musG.connect(this.master);
      const n = x.sampleRate * 2; this.noise = x.createBuffer(1, n, x.sampleRate); const d = this.noise.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      // riverbero corto
      const len = x.sampleRate * 1.6, ir = x.createBuffer(2, len, x.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const b = ir.getChannelData(ch); for (let i = 0; i < len; i++) b[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
      this.rev = x.createConvolver(); this.rev.buffer = ir; this.revG = x.createGain(); this.revG.gain.value = .22; this.rev.connect(this.revG); this.revG.connect(this.master);
      this.dist = x.createWaveShaper(); const cv = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const t = i / 512 - 1; cv[i] = Math.tanh(t * 6); } this.dist.curve = cv;
    } catch (e) { this.ctx = null; }
  },
  get t() { return this.ctx ? this.ctx.currentTime : 0; },
  env(g, t, a, peak, d, sus = 0) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(peak, .0002), t + a); g.gain.exponentialRampToValueAtTime(Math.max(sus, .0001), t + a + d); },
  osc(type, f, t, dur, peak, dest, f2, a = .005) { const x = this.ctx, o = x.createOscillator(), g = x.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur); this.env(g, t, a, peak, dur); o.connect(g); g.connect(dest || this.sfxG); o.start(t); o.stop(t + dur + a + .05); return { o, g }; },
  nz(t, dur, peak, type, f, q = 1, dest, f2) { const x = this.ctx, s = x.createBufferSource(), fl = x.createBiquadFilter(), g = x.createGain(); s.buffer = this.noise; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur); fl.Q.value = q; this.env(g, t, .003, peak, dur); s.connect(fl); fl.connect(g); g.connect(dest || this.sfxG); s.start(t, Math.random()); s.stop(t + dur + .05); return g; },
  sfx(name) {
    if (!this.ctx || !this.on) return; const t = this.t + .005;
    const S = {
      punch: () => { this.osc('sine', 140, t, .12, .9, null, 45); this.nz(t, .06, .7, 'bandpass', 1800, 1.2); this.nz(t, .015, .5, 'highpass', 4000); },
      punchHard: () => { this.osc('sine', 160, t, .18, 1.1, null, 40); this.nz(t, .09, .9, 'bandpass', 1400, 1); this.nz(t, .03, .6, 'highpass', 3500); this.osc('triangle', 90, t, .2, .4, this.rev, 50); },
      kick: () => { this.osc('sine', 120, t, .16, 1, null, 38); this.nz(t, .08, .8, 'bandpass', 900, 1); },
      kickHard: () => { this.osc('sine', 130, t, .26, 1.2, null, 32); this.nz(t, .12, 1, 'bandpass', 800, .9); this.nz(t, .04, .7, 'highpass', 3000); this.osc('sine', 70, t, .4, .5, this.rev, 35); },
      block: () => { this.nz(t, .04, .7, 'bandpass', 3200, 3); this.osc('triangle', 900, t, .07, .25, null, 600); this.osc('sine', 110, t, .06, .35, null, 60); },
      whoosh: () => this.nz(t, .17, .28, 'bandpass', 500, 1.5, null, 2400),
      whooshK: () => this.nz(t, .22, .35, 'bandpass', 350, 1.3, null, 1900),
      step: () => this.nz(t, .05, .2, 'lowpass', 600),
      land: () => { this.osc('sine', 90, t, .1, .4, null, 40); this.nz(t, .06, .25, 'lowpass', 500); },
      fall: () => { this.osc('sine', 80, t, .35, 1.1, null, 30); this.nz(t, .25, .7, 'lowpass', 700); this.nz(t + .08, .15, .35, 'lowpass', 400); },
      slam: () => { this.osc('sine', 75, t, .45, 1.3, null, 28); this.nz(t, .3, .9, 'lowpass', 900); this.osc('sine', 60, t, .6, .5, this.rev, 30); },
      ko: () => { this.osc('sine', 60, t, 1.2, 1, this.rev, 25); this.nz(t, .6, .6, 'lowpass', 400, 1, this.rev); },
      grab: () => { this.nz(t, .12, .4, 'bandpass', 2500, .8); this.osc('sine', 150, t, .08, .3, null, 70); },
      special: () => { this.nz(t, .7, .5, 'bandpass', 300, 2, this.rev, 4000); this.osc('sawtooth', 110, t, .7, .25, this.rev, 880); this.osc('sine', 55, t, .9, .7, null, 40); },
      whistle: () => { for (const [st, d, f] of [[0, .32, 2300], [.42, .5, 2500]]) { const o = this.osc('sine', f, t + st, d, .35, null, f * 1.25, .03); const lfo = this.ctx.createOscillator(), lg = this.ctx.createGain(); lfo.frequency.value = 18; lg.gain.value = 60; lfo.connect(lg); lg.connect(o.o.frequency); lfo.start(t + st); lfo.stop(t + st + d + .1); } },
      horn: () => { for (const st of [0, .32]) { this.osc('square', 392, t + st, .26, .18, null, null, .01); this.osc('square', 494, t + st, .26, .14, null, null, .01); } },
      engine: () => { const o = this.ctx.createOscillator(), g = this.ctx.createGain(), fl = this.ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(55, t); o.frequency.exponentialRampToValueAtTime(140, t + 1.2); fl.type = 'lowpass'; fl.frequency.value = 900; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.5, t + .9); g.gain.exponentialRampToValueAtTime(.0001, t + 2.4); o.connect(fl); fl.connect(g); g.connect(this.sfxG); o.start(t); o.stop(t + 2.5); },
      crash: () => { this.osc('sine', 70, t, .7, 1.4, null, 25); this.nz(t, .5, 1.1, 'lowpass', 2500); this.nz(t, .9, .5, 'highpass', 5000, 1, this.rev); for (let i = 0; i < 8; i++) this.osc('sine', rand(3000, 6000), t + rand(.05, .5), .12, .12, this.rev); },
      skid: () => { const g = this.nz(t, 1.1, .35, 'bandpass', 1600, 6); },
      vape: () => this.nz(t, .9, .2, 'bandpass', 3000, .7),
      puff: () => { this.nz(t, .6, .35, 'lowpass', 1200); this.nz(t, .4, .15, 'highpass', 4000); },
      bounce: () => { this.osc('sine', 180, t, .1, .5, null, 90); this.nz(t, .03, .3, 'bandpass', 1200); },
      kickBall: () => { this.osc('sine', 200, t, .12, 1, null, 80); this.nz(t, .05, .9, 'bandpass', 2000, 1.5); },
      ballFace: () => { this.osc('sine', 150, t, .2, 1.2, null, 50); this.nz(t, .08, 1, 'bandpass', 1500, 1); this.nz(t, .05, .6, 'highpass', 3000); },
      table: () => { this.osc('sine', 110, t, .18, 1.2, null, 60); this.nz(t, .08, .8, 'bandpass', 700, 1.5); this.osc('square', 200, t, .05, .15, null, 120); },
      blade: () => {   // spada sfoderata: strisciata metallica che sale e poi risuona
        const x = this.ctx;
        this.osc('triangle', 3200, t, .05, .18, null, 2600);
        const src = x.createBufferSource(), bp = x.createBiquadFilter(), hp = x.createBiquadFilter(), g = x.createGain();
        src.buffer = this.noise; src.loop = true; bp.type = 'bandpass'; bp.Q.value = 9; bp.frequency.setValueAtTime(2200, t + .02); bp.frequency.exponentialRampToValueAtTime(7500, t + .5);
        hp.type = 'highpass'; hp.frequency.value = 1500;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.55, t + .12); g.gain.setValueAtTime(.55, t + .38); g.gain.exponentialRampToValueAtTime(.0001, t + .56);
        src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(this.sfxG); g.connect(this.rev); src.start(t, Math.random()); src.stop(t + .6);
        const r = t + .46;
        for (const [f, a, d] of [[1870, .16, 1.6], [2990, .12, 1.3], [4230, .09, 1.0], [5560, .06, .8], [7310, .04, .6]]) {
          const o = x.createOscillator(), og = x.createGain(), lfo = x.createOscillator(), lg = x.createGain();
          o.type = 'sine'; o.frequency.value = f; lfo.frequency.value = 5.5; lg.gain.value = f * .003; lfo.connect(lg); lg.connect(o.frequency);
          og.gain.setValueAtTime(.0001, r); og.gain.exponentialRampToValueAtTime(a, r + .008); og.gain.exponentialRampToValueAtTime(.0001, r + d);
          o.connect(og); og.connect(this.sfxG); og.connect(this.rev); o.start(r); o.stop(r + d + .05); lfo.start(r); lfo.stop(r + d + .05);
        }
        this.nz(r, .07, .35, 'highpass', 6000);
      },
      clap: () => { this.nz(t, .06, .7, 'bandpass', 1500, 1.2); this.nz(t + .01, .05, .5, 'highpass', 3000); },
      glass: () => { for (const f of [2400, 3800, 5200, 6900]) this.osc('sine', f * rand(.97, 1.03), t, .5, .12, this.rev); this.nz(t, .25, .6, 'highpass', 3500, 1, this.rev); },
      splash: () => { this.nz(t, .7, .9, 'lowpass', 1800, 1, null, 300); this.nz(t, .5, .5, 'bandpass', 900, 1, this.rev); this.osc('sine', 90, t, .4, .9, null, 40); },
      fallWhistle: () => this.osc('sine', 1800, t, 1.2, .18, this.rev, 500, .05),
      aura: () => { const o = this.osc('sawtooth', 110, t, 1.3, .12, this.rev, 220, .2); this.nz(t, 1.2, .25, 'bandpass', 1200, 4, this.rev, 3000); },
      tele: () => { for (let i = 0; i < 4; i++) { this.osc('sine', 300 + i * 70, t + i * .12, .5, .15, this.rev, 1400 + i * 200, .05); } this.osc('sawtooth', 60, t, 1.2, .2, null, 90); },
      rec: () => { this.osc('square', 1760, t, .08, .08); this.osc('square', 1760, t + .14, .08, .08); },
      whirr: () => this.nz(t, 1.4, .12, 'bandpass', 2600, 6),
      boom: () => { this.osc('sine', 60, t, 1.2, 1.5, null, 22); this.nz(t, 1.0, 1.2, 'lowpass', 1600, 1, null, 120); this.nz(t, 1.6, .6, 'lowpass', 600, 1, this.rev); },
      spray: () => this.nz(t, 1.1, .45, 'highpass', 2500, .6),
      cough: () => { for (let i = 0; i < 3; i++) { this.nz(t + i * .28, .14, .6, 'bandpass', 700, 2); this.osc('sawtooth', 160, t + i * .28, .1, .2, null, 110); } },
      strain: () => { const o = this.osc('sawtooth', 95, t, 1.4, .18, null, 115, .2); this.nz(t, 1.3, .1, 'bandpass', 600, 3); },
      whooshBig: () => this.nz(t, .45, .5, 'bandpass', 250, 1.2, null, 2600),
      select: () => { this.osc('square', 660, t, .05, .12); this.osc('square', 990, t + .05, .06, .1); },
      move: () => this.osc('triangle', 520, t, .04, .1),
      back: () => this.osc('triangle', 330, t, .06, .12, null, 220),
      confirm: () => { this.osc('sawtooth', 220, t, .4, .25, this.rev, 440); this.nz(t, .3, .3, 'bandpass', 800, 2, this.rev, 3000); },
    };
    if (S[name]) S[name]();
  },
  grunt(f, big) {
    if (!this.ctx || !this.on) return; const t = this.t + .01, x = this.ctx;
    const f0 = (f.def.voice || 120) * rand(.95, 1.1), dur = big ? .45 : rand(.14, .22);
    const o = x.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f0 * 1.15, t); o.frequency.exponentialRampToValueAtTime(f0 * .75, t + dur);
    const g = x.createGain(); this.env(g, t, .01, big ? .5 : .32, dur);
    const nz = x.createBufferSource(); nz.buffer = this.noise; const ng = x.createGain(); ng.gain.value = .25; nz.connect(ng);
    for (const [ff, q, gg] of [[650, 6, 1], [1100, 8, .6], [2500, 10, .25]]) { const b = x.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = ff * rand(.9, 1.1); b.Q.value = q; const bg = x.createGain(); bg.gain.value = gg; o.connect(b); ng.connect(b); b.connect(bg); bg.connect(g); }
    g.connect(this.sfxG); o.start(t); o.stop(t + dur + .05); nz.start(t); nz.stop(t + dur + .05);
  },
  announce(text) {
    try { if (!this.on || !window.speechSynthesis) return; const u = new SpeechSynthesisUtterance(text); const vs = speechSynthesis.getVoices(); const v = vs.find(v => /en-(US|GB)/.test(v.lang) && /male|daniel|fred|alex|google uk/i.test(v.name)) || vs.find(v => /^en/.test(v.lang)); if (v) u.voice = v; u.lang = v ? v.lang : 'en-US'; u.pitch = .55; u.rate = .85; u.volume = 1; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { }
  },
  /* --- musica --- */
  music(name, variant = 0) {
    if (!this.ctx) return;
    const key = name ? name + variant : null; if (key === this.cur) return; this.cur = key;
    if (this.seq) { clearInterval(this.seq.iv); const g = this.seq.g; g.gain.setTargetAtTime(0, this.t, .3); setTimeout(() => g.disconnect(), 1500); this.seq = null; }
    if (!name || !this.musicOn) return;
    const song = SONGS[name](variant); const g = this.ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(1, this.t, .4); g.connect(this.musG);
    const seq = this.seq = { song, g, step: 0, next: this.t + .1, intensity: 0 };
    seq.iv = setInterval(() => { while (seq.next < this.t + .15) { this.playStep(seq, seq.next); seq.next += 60 / song.bpm / 4; seq.step++; } }, 25);
  },
  setIntensity(v) { if (this.seq) this.seq.intensity = v; },
  playStep(seq, t) {
    const s = seq.song, st = seq.step % (16 * s.bars), bar = Math.floor(st / 16), i = st % 16, ch = s.chords[bar % s.chords.length], g = seq.g;
    const P = (pat, k) => pat && pat[k % pat.length] === 'x';
    if (P(s.kick, i)) { this.osc('sine', 150, t, .22, 1, g, 42); }
    if (P(s.snare, i)) { this.nz(t, .16, .55, 'bandpass', 1900, .8, g); this.osc('triangle', 190, t, .08, .35, g, 140); this.nz(t, .2, .12, 'highpass', 3000, 1, this.rev); }
    if (P(s.hat, i)) this.nz(t, i % 4 === 2 ? .07 : .03, i % 4 === 2 ? .2 : .12, 'highpass', 7500, 1, g);
    if (seq.intensity > .5 && s.roll && i >= 12) this.nz(t + 60 / s.bpm / 8, .02, .1, 'highpass', 8000, 1, g);
    const root = ch[0];
    if (s.bass[i] !== '.') { const f = 55 * Math.pow(2, (root + (s.bass[i] === 'o' ? 12 : s.bass[i] === '5' ? 7 : 0)) / 12); const o = this.ctx.createOscillator(), fl = this.ctx.createBiquadFilter(), gg = this.ctx.createGain(); o.type = s.bassWave || 'sawtooth'; o.frequency.value = f; if (s.glide) o.frequency.exponentialRampToValueAtTime(f * .5, t + .35); fl.type = 'lowpass'; fl.frequency.setValueAtTime(s.bassCut || 1200, t); fl.frequency.exponentialRampToValueAtTime(140, t + .2); this.env(gg, t, .005, s.bassVol || .45, s.bassLen || .18); o.connect(fl); fl.connect(gg); gg.connect(g); o.start(t); o.stop(t + .5); }
    if (s.stab && s.stab[i] === 'x') { for (const n of [0, 7, 12]) { const f = 110 * Math.pow(2, (root + n) / 12); for (const d of [-6, 6]) { const o = this.ctx.createOscillator(), gg = this.ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; this.env(gg, t, .004, .07, .14); o.connect(gg); gg.connect(g); o.start(t); o.stop(t + .25); } } }
    if (s.lead && i % 2 === 0) { const n = s.lead[(bar * 8 + i / 2) % s.lead.length]; if (n !== null && n !== undefined) { const f = 220 * Math.pow(2, (root + n) / 12); const o = this.ctx.createOscillator(), gg = this.ctx.createGain(), fl = this.ctx.createBiquadFilter(); o.type = 'square'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 2400; this.env(gg, t, .01, .06 + seq.intensity * .03, .22); o.connect(fl); fl.connect(gg); gg.connect(g); gg.connect(this.rev); o.start(t); o.stop(t + .3); } }
    if (s.pad && i === 0) { for (const n of ch.slice(1)) { const f = 110 * Math.pow(2, (root + n) / 12); const o = this.ctx.createOscillator(), gg = this.ctx.createGain(), fl = this.ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = rand(-8, 8); fl.type = 'lowpass'; fl.frequency.value = 900; const d = 60 / s.bpm * 4; gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime(.05, t + d * .3); gg.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(fl); fl.connect(gg); gg.connect(g); gg.connect(this.rev); o.start(t); o.stop(t + d + .05); } }
    if (s.cowbell && i % 2 === 0) { const n = s.cowbell[(bar * 8 + i / 2) % s.cowbell.length]; const f = 220 * Math.pow(2, (root + n) / 12);
      for (const m of [1, 1.48]) { const o = this.ctx.createOscillator(), gg = this.ctx.createGain(), bp = this.ctx.createBiquadFilter(); o.type = 'square'; o.frequency.value = f * m; bp.type = 'bandpass'; bp.frequency.value = f * 1.2; bp.Q.value = 3; this.env(gg, t, .002, .09, .13); o.connect(bp); bp.connect(gg); gg.connect(g); gg.connect(this.rev); o.start(t); o.stop(t + .2); } }
    if (s.bell && s.bell[i] === 'x') { const f = 880 * Math.pow(2, (root + pick([0, 3, 7, 10])) / 12); this.osc('sine', f, t, .5, .05, this.rev); }
  },
};
// accordi: [fondamentale in semitoni da La, intervalli per il pad]
const SONGS = {
  menu: () => ({ bpm: 92, bars: 4, chords: [[0, 0, 3, 7], [-4, 0, 4, 7], [3, 0, 4, 7], [-2, 0, 4, 7]],
    kick: 'x.........x.....', snare: '....x.......x...', hat: '..x...x...x...x.', bass: 'x.....x.x.......', bassWave: 'triangle', bassVol: .5, bassLen: .4, pad: true, bell: '..........x.....' }),
  fight: v => v === 1 ? { bpm: 140, bars: 4, chords: [[5], [5], [3], [8]], kick: 'x.....x...x.....', snare: '........x.......', hat: 'x.xxx.x.x.xxx.x.', roll: true,
      bass: 'x.....x...x...o.', bassWave: 'sine', bassVol: .8, bassLen: .4, glide: true, bassCut: 600, lead: [0, null, 3, null, 7, 5, 3, null, 0, null, 3, 5, 3, null, -2, null], pad: true }
    : { bpm: 152, bars: 4, chords: [[7, 0, 3, 7], [7, 0, 3, 7], [3, 0, 4, 7], [5, 0, 4, 7]], kick: 'x...x...x...x.x.', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', roll: true,
      bass: 'xx.xx.xx.xx.x5xo', bassVol: .42, bassLen: .12, stab: 'x.....x.....x...', lead: [12, null, 10, 12, 15, null, 12, 10, 7, null, 10, null, 12, null, null, null] },
  aura: () => ({ bpm: 128, bars: 4, chords: [[5], [5], [3], [0]], kick: 'x..x..x...x..x..', snare: '....x.......x...', hat: 'x.xxx.xx.xxxx.xx', roll: true,
    bass: 'x.....x...x..o..', bassWave: 'sine', bassVol: .9, bassLen: .45, glide: true, bassCut: 500, cowbell: [12, 12, 15, 12, 10, 12, 7, 10, 12, 12, 15, 17, 15, 12, 10, 7] }),
  victory: () => ({ bpm: 120, bars: 2, chords: [[3, 0, 4, 7], [-2, 0, 4, 7]], kick: 'x.......x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', bass: 'x...x...x...x...', pad: true, lead: [0, 4, 7, 12, 7, 4, 7, null] }),
};
