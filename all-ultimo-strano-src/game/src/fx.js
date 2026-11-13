'use strict';
/* ===== Effetti: scintille, polvere, fumo, oggetti di scena e mosse speciali ===== */
const SPR = {
  glow: canvasTex(64, 64, (c, w) => { const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); }),
  smoke: canvasTex(128, 128, (c) => { for (let i = 0; i < 18; i++) { const x = 64 + rand(-26, 26), y = 64 + rand(-26, 26), r = rand(18, 38); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); } }),
  ring: canvasTex(128, 128, (c) => { c.strokeStyle = 'rgba(255,255,255,1)'; c.lineWidth = 7; c.beginPath(); c.arc(64, 64, 52, 0, TAU); c.stroke(); c.lineWidth = 2; c.beginPath(); c.arc(64, 64, 42, 0, TAU); c.stroke(); }),
};
const FX = {
  list: [], group: new THREE.Group(),
  init() { scene.add(this.group); },
  add(mat, pos, o) { const s = new THREE.Sprite(mat); s.position.copy(pos); s.scale.setScalar(o.size || .2); this.group.add(s); this.list.push(Object.assign({ s, life: 1, t: 0, vel: new V3(), grow: 0, drag: .9, g: 0, fade: 1 }, o)); return s; },
  spark(pos, color, n, power) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.SpriteMaterial({ map: SPR.glow, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
      const v = new V3(rand(-1, 1), rand(-.6, 1), rand(-1, 1)).normalize().multiplyScalar(rand(2, 6) * power);
      this.add(m, pos, { vel: v, life: rand(.15, .35), size: rand(.04, .09) * (1 + power * .5), drag: .86, g: 6 });
    }
    const m = new THREE.SpriteMaterial({ map: SPR.glow, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    this.add(m, pos, { life: .12, size: .35 * power + .2, grow: 3 });
  },
  ring(pos, strong) { const m = new THREE.SpriteMaterial({ map: SPR.ring, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .8 }); this.add(m, pos, { life: .18, size: .15, grow: strong ? 9 : 6 }); },
  dust(pos) { for (let i = 0; i < 10; i++) { const m = new THREE.SpriteMaterial({ map: SPR.smoke, color: 0xb9a98e, depthWrite: false, transparent: true, opacity: .55 }); this.add(m, new V3(pos.x + rand(-.4, .4), .15, pos.z + rand(-.4, .4)), { vel: new V3(rand(-1, 1), rand(.2, .8), rand(-1, 1)), life: rand(.6, 1.1), size: rand(.4, .7), grow: 1.2, drag: .92 }); } },
  smoke(pos, color, n, size, vel) { for (let i = 0; i < n; i++) { const m = new THREE.SpriteMaterial({ map: SPR.smoke, color, depthWrite: false, transparent: true, opacity: .7 }); this.add(m, pos.clone().add(new V3(rand(-.05, .05), rand(-.05, .05), rand(-.05, .05))), { vel: (vel ? vel.clone() : new V3()).add(new V3(rand(-.3, .3), rand(.05, .35), rand(-.3, .3))), life: rand(1.4, 2.4), size: size * rand(.7, 1.2), grow: size * 1.4, drag: .95 }); } },
  aura(pos, color) { const m = new THREE.SpriteMaterial({ map: SPR.glow, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .8 }); this.add(m, pos.clone().add(new V3(rand(-.3, .3), rand(0, 1.6), rand(-.3, .3))), { vel: new V3(0, rand(.8, 1.6), 0), life: rand(.3, .6), size: rand(.15, .3), drag: .97 }); },
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]; p.t += dt; const k = p.t / p.life;
      if (k >= 1) { this.group.remove(p.s); p.s.material.dispose(); this.list.splice(i, 1); continue; }
      p.vel.y -= p.g * dt; p.vel.multiplyScalar(Math.pow(p.drag, dt * 60)); p.s.position.addScaledVector(p.vel, dt);
      p.s.scale.setScalar(p.size + p.grow * p.t * p.size);
      p.s.material.opacity = (p.s.material.userData.o0 ?? (p.s.material.userData.o0 = p.s.material.opacity)) * (1 - k);
    }
  },
  clear() { for (const p of this.list) { this.group.remove(p.s); p.s.material.dispose(); } this.list.length = 0; },
};

/* ===== Oggetti di scena ===== */
function makePunto() {   // Fiat Punto prima serie, 5 porte, blu
  const g = new THREE.Group(), blue = std(0x1d3f8f, .35, .55, { envMapIntensity: 1.2 }), glass = std(0x15202a, .08, .6, { transparent: true, opacity: .82 }),
    plast = std(0x2b2d30, .7), chrome = std(0xc8ccd2, .25, .9), black = std(0x0d0d0e, .8), light = std(0xfff6d8, .2, 0, { emissive: 0x9a907a }), red = std(0xb01313, .3, 0, { emissive: 0x3a0505 }), orange = std(0xe78a1a, .3);
  const L = 3.76, W = 1.62;
  const prof = (pts, w, mat, y0 = 0) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); const geo = new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 3 }); geo.translate(0, y0, -w / 2); const m = new THREE.Mesh(geo, mat); m.castShadow = true; g.add(m); return m; };
  // fiancata (x lungo l'auto, + = davanti)
  prof([[-1.86, .28], [1.86, .28], [1.9, .45], [1.86, .62], [1.62, .74], [.85, .86], [-1.72, .9], [-1.85, .82], [-1.88, .45]], W - .08, blue);
  prof([[.82, .86], [.08, 1.36], [-1.4, 1.38], [-1.74, .92]], W - .26, glass);
  prof([[.05, 1.36], [.15, 1.4], [-1.42, 1.42], [-1.42, 1.38]], W - .3, blue);
  // montanti
  for (const x of [-.3, -1.6]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.07, .5, W - .2), blue); p.position.set(x, 1.13, 0); p.rotation.z = x < -1 ? -.22 : 0; g.add(p); }
  const ap = new THREE.Mesh(new THREE.BoxGeometry(.07, .62, W - .22), blue); ap.position.set(.45, 1.1, 0); ap.rotation.z = .87; g.add(ap);
  // paraurti, griglia, fari
  const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); g.add(m); return m; };
  box(.14, .2, W, plast, 1.88, .38, 0); box(.14, .2, W, plast, -1.9, .4, 0);
  box(.04, .07, .9, black, 1.9, .6, 0); for (const z of [-.55, .55]) { box(.04, .1, .34, light, 1.89, .6, z); box(.03, .05, .1, orange, 1.88, .6, z * 1.5); }
  for (const z of [-.72, .72]) box(.06, .34, .14, red, -1.86, .98, z);
  box(.02, .1, .44, std(0xf2f2f2, .5), 1.97, .4, 0); box(.02, .1, .44, std(0xf2f2f2, .5), -1.98, .45, 0);
  box(.3, .06, .02, plast, .6, .78, W / 2 - .02).position.z = W / 2; box(.3, .06, .02, plast, .6, .78, -W / 2);
  for (const z of [-1, 1]) { box(1.0, .03, .01, chrome, -.05, .62, z * (W / 2 + .01)); box(.12, .03, .02, black, .25, .8, z * (W / 2 + .01)); box(.12, .03, .02, black, -.75, .82, z * (W / 2 + .01)); }
  // ruote
  const wheel = new THREE.CylinderGeometry(.29, .29, .19, 24), cap = new THREE.CylinderGeometry(.18, .18, .2, 18);
  g.wheels = [];
  for (const [x, z] of [[1.2, .72], [1.2, -.72], [-1.22, .72], [-1.22, -.72]]) { const w = new THREE.Group(); const t = new THREE.Mesh(wheel, black); t.rotation.x = Math.PI / 2; const c = new THREE.Mesh(cap, std(0x9aa0a8, .4, .6)); c.rotation.x = Math.PI / 2; w.add(t, c); w.position.set(x, .29, z); g.add(w); g.wheels.push(w); }
  // targa (scritta di fantasia)
  const plate = canvasTex(256, 56, (c, w, h) => { c.fillStyle = '#f4f4f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d3caa'; c.fillRect(0, 0, 26, h); c.fillRect(w - 26, 0, 26, h); c.fillStyle = '#111'; c.font = 'bold 38px Arial'; c.textAlign = 'center'; c.fillText('CA 404ST', w / 2, 42); });
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(.52, .11), new THREE.MeshStandardMaterial({ map: plate, roughness: .5 })); pl.position.set(-1.995, .45, 0); pl.rotation.y = -Math.PI / 2; g.add(pl);
  g.traverse(m => { if (m.isMesh) m.castShadow = true; });
  return g;
}
function makeBall() {
  const t = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#f4f4f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#151515';
    for (let i = 0; i < 12; i++) { const x = (i % 6) * 44 + (i > 5 ? 22 : 0), y = i > 5 ? 86 : 30; c.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; c.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13); } c.fill(); } });
  const m = new THREE.Mesh(new THREE.SphereGeometry(.11, 24, 16), new THREE.MeshStandardMaterial({ map: t, roughness: .45 })); m.castShadow = true; return m;
}
function makeVape() { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.025, .09, .015), std(0x262a30, .3, .7)); const tip = new THREE.Mesh(new THREE.CylinderGeometry(.006, .008, .025, 8), std(0x111111, .4)); tip.position.y = .055; const led = new THREE.Mesh(new THREE.BoxGeometry(.005, .012, .016), new THREE.MeshBasicMaterial({ color: 0x33c6ff })); led.position.y = -.02; g.add(b, tip, led); return g; }

/* ===== Mosse speciali ===== */
const SPECIALS = {
  alex: {
    dur: 230, dmg: 30, name: 'La Punto blu',
    start(M, a, d, D) {
      const F = a.fwd, side = new V3(-F.z, 0, F.x);
      D.car = makePunto(); scene.add(D.car);
      D.dir = side.clone(); D.dir.y = 0; D.dir.normalize();
      D.impact = d.pos.clone(); D.carStart = D.impact.clone().addScaledVector(D.dir, -26);
      D.car.position.copy(D.carStart); D.car.rotation.y = Math.atan2(D.dir.x, D.dir.z) - Math.PI / 2;
      a.override = 'alexWhistle'; d.override = 'dazed'; HUD.specialTitle(a.def.name, this.name); AU.sfx('whistle');
    },
    update(M, a, d, t, D) {
      const F = a.fwd;
      if (t === 24) { AU.sfx('horn'); AU.sfx('engine'); }
      const tHit = 70;
      if (t <= tHit + 60) {
        const k = t < 24 ? 0 : Math.min(1, (t - 24) / (tHit - 24));
        const pos = D.carStart.clone().lerp(D.impact, k); if (t > tHit) pos.copy(D.impact).addScaledVector(D.dir, (t - tHit) * .32 * Math.max(0, 1 - (t - tHit) / 70));
        D.car.position.set(pos.x, 0, pos.z); D.car.wheels.forEach(w => w.rotation.z -= .5);
      }
      if (t === tHit) { AU.sfx('crash'); AU.grunt(d, true); M.shake = .7; FX.spark(d.pos.clone().setY(1), 0xffffff, 20, 1.6); FX.dust(d.pos); M.slow = .35; M.slowT = .5; D.flyFrom = d.pos.clone(); d.override = 'flying'; }
      if (t > tHit && t < tHit + 70) { const k = (t - tHit) / 70; d.pos.copy(D.flyFrom).addScaledVector(D.dir, k * 5.5); d.y = Math.sin(k * Math.PI) * 2.2; d.spin = k * 9; if (t === tHit + 69) { d.y = 0; AU.sfx('fall'); FX.dust(d.pos); M.shake = .3; d.override = 'lying'; } }
      if (t > tHit + 60 && t < tHit + 100 && t % 4 === 0) FX.smoke(D.car.position.clone().setY(.2), 0x999999, 2, .3);
      if (t === tHit + 62) AU.sfx('skid');
      if (t === 170) a.override = 'alexPoint';
      // telecamera
      if (t < 24) M.camOverride = { pos: a.pos.clone().addScaledVector(F, 1.6).add(new V3(0, 1.6, 0)).addScaledVector(new V3(-F.z, 0, F.x), .5), look: a.pos.clone().setY(1.55) };
      else if (t < tHit + 4) { const mid = d.pos.clone(); M.camOverride = { pos: mid.clone().addScaledVector(D.dir, 3).addScaledVector(F, -3.2).setY(.6), look: mid.clone().addScaledVector(D.dir, -2).setY(.8) }; }
      else if (t < 170) M.camOverride = { pos: D.flyFrom.clone().addScaledVector(F, -4.5).addScaledVector(D.dir, 1.5).setY(2.2), look: d.pos.clone().setY(d.y + .8) };
      else M.camOverride = { pos: a.pos.clone().addScaledVector(F, 1.8).setY(1.6).addScaledVector(D.dir, .6), look: a.pos.clone().setY(1.5) };
    },
    end(M, a, d, D) { scene.remove(D.car); d.spin = 0; a.yaw = Math.atan2(d.pos.x - a.pos.x, d.pos.z - a.pos.z); },
    cleanup(M) { },
  },
  zonco: {
    dur: 240, dmg: 30, name: 'Pallonata e svapo',
    start(M, a, d, D) {
      D.vape = makeVape(); a.av.B.rHa.add(D.vape); D.vape.scale.setScalar(100); D.vape.position.set(-6, 3, 0);
      D.ball = makeBall(); scene.add(D.ball); D.ball.visible = false;
      a.override = 'zoncoVape'; d.override = 'dazed'; HUD.specialTitle(a.def.name, this.name); AU.sfx('vape');
    },
    update(M, a, d, t, D) {
      const F = a.fwd, side = new V3(-F.z, 0, F.x);
      if (t === 38) { AU.sfx('puff'); const mouth = a.av.B.head.getWorldPosition(new V3()).addScaledVector(F, .14); FX.smoke(mouth, 0xe8eef2, 26, .35, F.clone().multiplyScalar(.9)); }
      if (t > 38 && t < 70 && t % 3 === 0) { const mouth = a.av.B.head.getWorldPosition(new V3()).addScaledVector(F, .14); FX.smoke(mouth, 0xe8eef2, 3, .25, F.clone().multiplyScalar(.7)); }
      if (t === 74) { D.ball.visible = true; a.override = 'zoncoKick'; a.t = 0; AU.sfx('bounce'); }
      const kickT = 108, hitT = 118;
      if (t >= 74 && t < kickT) { const k = (t - 74) / (kickT - 74); D.ball.position.copy(a.pos).addScaledVector(F, .45).addScaledVector(side, .12); D.ball.position.y = .11 + Math.abs(Math.sin(k * Math.PI * 2)) * .55 * (1 - k * .4); if (Math.abs(k - .5) < .02) AU.sfx('bounce'); }
      if (t === kickT) AU.sfx('kickBall');
      if (t >= kickT && t <= hitT) { const k = (t - kickT) / (hitT - kickT); const from = a.pos.clone().addScaledVector(F, .5).setY(.5), to = d.av.B.head.getWorldPosition(new V3()); D.ball.position.copy(from.lerp(to, k)); D.ball.rotation.x += .6; }
      if (t === hitT) { AU.sfx('ballFace'); AU.grunt(d, true); M.shake = .5; M.slow = .3; M.slowT = .6; FX.spark(D.ball.position.clone(), 0xffffff, 16, 1.3); d.override = 'ballHit'; d.t = 0; D.bv = F.clone().multiplyScalar(-2.5).add(new V3(0, 4, 0)).addScaledVector(side, 1.5); }
      if (t > hitT) { D.bv.y -= 9.8 * DT; D.ball.position.addScaledVector(D.bv, DT); if (D.ball.position.y < .11) { D.ball.position.y = .11; D.bv.y = Math.abs(D.bv.y) * .55; D.bv.multiplyScalar(.8); } d.pos.addScaledVector(F, Math.max(0, .03 - (t - hitT) * .0006)); }
      if (t === hitT + 34) { AU.sfx('fall'); FX.dust(d.pos); }
      if (t === hitT + 60) { a.override = 'zoncoVape2'; FX.smoke(a.av.B.head.getWorldPosition(new V3()).addScaledVector(F, .14), 0xe8eef2, 14, .3, F.clone().multiplyScalar(.5)); AU.sfx('puff'); }
      // telecamera
      if (t < 74) M.camOverride = { pos: a.pos.clone().addScaledVector(F, 1.45).addScaledVector(side, .55).setY(1.62), look: a.pos.clone().setY(1.6) };
      else if (t < hitT + 2) M.camOverride = { pos: a.pos.clone().addScaledVector(side, 2.6).addScaledVector(F, .5).setY(.9), look: a.pos.clone().addScaledVector(F, .8).setY(.8) };
      else if (t < hitT + 58) M.camOverride = { pos: d.pos.clone().addScaledVector(F, 1.8).addScaledVector(side, 1.4).setY(1.4), look: d.pos.clone().setY(1.1) };
      else M.camOverride = { pos: a.pos.clone().addScaledVector(F, 1.6).addScaledVector(side, .4).setY(1.62), look: a.pos.clone().setY(1.58) };
    },
    end(M, a, d, D) { if (D.vape.parent) D.vape.parent.remove(D.vape); scene.remove(D.ball); },
  },
};

/* ===== Oggetti delle altre mosse speciali ===== */
function makeGlassLM() {   // bicchiere gigante di latte e menta
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.15, .9, 3.2, 40, 1, true), std(0xeaf6f2, .05, 0, { transparent: true, opacity: .32, side: THREE.DoubleSide, depthWrite: false }));
  glass.position.y = 1.6; g.add(glass);
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .12, 40), std(0xeaf6f2, .05, 0, { transparent: true, opacity: .5 })); bottom.position.y = .06; g.add(bottom);
  const milk = new THREE.Mesh(new THREE.CylinderGeometry(1.08, .88, 2.6, 40), std(0x9fe3b8, .35, 0, { emissive: 0x153b22 })); milk.position.y = 1.36; g.add(milk);
  const top = new THREE.Mesh(new THREE.CircleGeometry(1.08, 40), std(0xc8f3d6, .3)); top.rotation.x = -Math.PI / 2; top.position.y = 2.67; g.add(top);
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 4, 12), std(0xe23b3b, .4)); straw.position.set(.45, 2.6, .1); straw.rotation.z = -.28; g.add(straw);
  const ice = std(0xffffff, .05, 0, { transparent: true, opacity: .6 });
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, .4), ice); c.position.set(rand(-.6, .6), 2.55, rand(-.6, .6)); c.rotation.set(rand(0, 3), rand(0, 3), 0); g.add(c); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g;
}
function makeShoulderCam() {
  const g = new THREE.Group(), body = std(0x1d1f22, .45, .4), dark = std(0x0b0b0c, .3, .5);
  const b = new THREE.Mesh(new THREE.BoxGeometry(.12, .16, .36), body); g.add(b);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(.055, .065, .2, 18), dark); lens.rotation.x = Math.PI / 2; lens.position.set(0, .01, .26); g.add(lens);
  const glassL = new THREE.Mesh(new THREE.CircleGeometry(.05, 18), std(0x223355, .05, .9)); glassL.position.set(0, .01, .361); g.add(glassL);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, .22), dark); handle.position.set(0, .1, .02); g.add(handle);
  const vf = new THREE.Mesh(new THREE.BoxGeometry(.06, .05, .08), dark); vf.position.set(-.08, .05, -.12); g.add(vf);
  const led = new THREE.Mesh(new THREE.SphereGeometry(.008, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2020 })); led.position.set(.05, .07, .17); g.add(led); g.led = led;
  return g;
}
function makeSpray() { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .12, 14), std(0xc42222, .35, .3)); g.add(c); const cap = new THREE.Mesh(new THREE.CylinderGeometry(.014, .02, .025, 10), std(0x111111, .4)); cap.position.y = .07; g.add(cap); return g; }
function holdInRight(av, obj, offset, rot) { const H = av.B.rHa; H.add(obj); obj.scale.setScalar(100); obj.position.set(...offset); if (rot) obj.rotation.set(...rot); return obj; }
const sideOf = F => new V3(-F.z, 0, F.x);

Object.assign(SPECIALS, {
  bruno: {
    dur: 230, dmg: 30, name: 'Latte e menta dal cielo',
    start(M, a, d, D) { D.glass = makeGlassLM(); D.glass.position.copy(d.pos).setY(18); scene.add(D.glass); a.override = 'pointSky'; d.override = 'lookUpScared'; HUD.specialTitle(a.def.name, this.name); AU.sfx('fallWhistle'); },
    update(M, a, d, t, D) {
      const F = a.fwd, S = sideOf(F), hit = 64;
      if (t < hit) { const k = easeIn(t / hit); D.glass.position.set(d.pos.x, lerp(18, 0, k), d.pos.z); D.glass.rotation.y += .05; }
      if (t === hit) { AU.sfx('glass'); AU.sfx('splash'); AU.grunt(d, true); M.shake = .7; M.slow = .4; M.slowT = .5; d.override = 'lying'; d.av.tilt.scale.set(1.25, .12, 1.25);
        for (let i = 0; i < 40; i++) { const m = new THREE.SpriteMaterial({ map: SPR.smoke, color: 0x9fe3b8, transparent: true, depthWrite: false }); FX.add(m, d.pos.clone().setY(.3), { vel: new V3(rand(-4, 4), rand(1, 5), rand(-4, 4)), life: rand(.5, 1), size: rand(.2, .4), g: 9, drag: .97 }); } }
      if (t > hit + 70 && t < hit + 110) { const k = (t - hit - 70) / 40; D.glass.position.y = k * 22; }
      if (t === hit + 72) { d.av.tilt.scale.set(1, 1, 1); AU.sfx('whooshBig'); }
      if (t < hit - 6) M.camOverride = { pos: d.pos.clone().addScaledVector(F, -3.5).addScaledVector(S, 1.6).setY(1.0), look: d.pos.clone().setY(lerp(3.5, 1.4, t / hit)) };
      else M.camOverride = { pos: d.pos.clone().addScaledVector(F, -4.2).addScaledVector(S, 2.4).setY(2.2), look: d.pos.clone().setY(1.0) };
      if (t === 175) a.override = 'idleWin';
    },
    end(M, a, d, D) { scene.remove(D.glass); d.av.tilt.scale.set(1, 1, 1); },
  },
  edo: {
    dur: 210, dmg: 30, name: 'Calci alle caviglie',
    start(M, a, d, D) { a.override = 'edoKick'; d.override = 'dazed'; HUD.specialTitle(a.def.name, this.name); AU.sfx('aura'); D.n = 0; a.pos.copy(d.pos).addScaledVector(a.fwd, -.95); },
    update(M, a, d, t, D) {
      const F = a.fwd, S = sideOf(F);
      if (t % 3 === 0) FX.aura(a.pos, 0x3a7bff);
      if (t > 20 && t < 150 && (t - 20) % 18 === 9) { const p = d.pos.clone().setY(.2); FX.spark(p, 0x6aa8ff, 12, 1); FX.ring(p, true); AU.sfx('kickHard'); AU.grunt(d); M.shake = .25; M.hitstop = 0; d.override = 'ankleHit'; d.t = 0; }
      if (t === 160) { d.override = 'ballHit'; d.t = 0; AU.sfx('fall'); }
      a.t = t; M.camOverride = { pos: a.pos.clone().addScaledVector(F, .5).addScaledVector(S, 2.4).setY(.9), look: a.pos.clone().addScaledVector(F, .55).setY(.6) };
      if (t > 160) M.camOverride = { pos: a.pos.clone().addScaledVector(S, 3.2).setY(1.6), look: d.pos.clone().setY(.6) };
    },
    end(M, a, d, D) { },
  },
  pet: {
    dur: 230, dmg: 30, name: 'Attacco telepatico',
    start(M, a, d, D) { a.override = 'petTele'; d.override = 'dazed'; HUD.specialTitle(a.def.name, this.name); AU.sfx('tele'); },
    update(M, a, d, t, D) {
      const F = a.fwd, S = sideOf(F), head = a.av.B.head.getWorldPosition(new V3());
      if (t === 20) HUD.subtitle(a.def.name, 'Ho dovuto attaccarti telepaticamente purtroppo');
      if (t > 20 && t < 130 && t % 6 === 0) { const m = new THREE.SpriteMaterial({ map: SPR.ring, color: 0xff2a2a, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }); FX.add(m, head.clone().addScaledVector(F, .2), { vel: F.clone().multiplyScalar(4.5), life: .5, size: .25, grow: 3 }); }
      if (t > 60 && t < 140) { d.override = 'teleHit'; d.y = Math.min(.6, (t - 60) * .01); if (t % 4 === 0) FX.aura(d.pos, 0xff3030); if (t === 61) { AU.grunt(d, true); M.shake = .3; } }
      if (t === 140) { d.override = 'flying'; d.spin = 0; AU.sfx('whooshBig'); }
      if (t > 140 && t < 170) { const k = (t - 140) / 30; d.pos.addScaledVector(F, .06); d.y = .6 * (1 - k); d.spin = k * 4; }
      if (t === 170) { d.y = 0; d.override = 'lying'; AU.sfx('fall'); FX.dust(d.pos); M.shake = .35; }
      if (t < 60) M.camOverride = { pos: a.pos.clone().addScaledVector(F, 1.3).addScaledVector(S, .4).setY(1.65), look: head };
      else M.camOverride = { pos: a.pos.clone().addScaledVector(S, 3.4).addScaledVector(F, .9).setY(1.6), look: a.pos.clone().addScaledVector(F, 1.4).setY(1.2) };
      if (t === 200) HUD.subtitle(null);
    },
    end(M, a, d, D) { HUD.subtitle(null); d.y = 0; },
  },
  josto: {
    dur: 240, dmg: 30, name: 'In diretta',
    start(M, a, d, D) { D.cam = makeShoulderCam(); holdInRight(a.av, D.cam, [-7, 4, 6], [0, Math.PI / 2, 0]); a.override = 'jostoFilm'; d.override = 'dazed'; HUD.specialTitle(a.def.name, this.name); AU.sfx('rec'); AU.sfx('whirr'); D.c = d.pos.clone(); D.r = a.pos.distanceTo(d.pos); D.a0 = Math.atan2(a.pos.x - d.pos.x, a.pos.z - d.pos.z); },
    update(M, a, d, t, D) {
      if (t < 150) { const ang = D.a0 + (t / 150) * Math.PI * 1.6, r = lerp(D.r, 1.5, Math.min(1, t / 40)); a.pos.set(D.c.x + Math.sin(ang) * r, 0, D.c.z + Math.cos(ang) * r); a.yaw = Math.atan2(D.c.x - a.pos.x, D.c.z - a.pos.z); d.yaw = Math.atan2(a.pos.x - d.pos.x, a.pos.z - d.pos.z); }
      D.cam.led.visible = (t >> 3) % 2 === 0;
      if (t > 100 && t < 150 && t % 3 === 0) { d.av.setTint(new THREE.Color(0xff6a20), (t - 100) / 60); }
      if (t === 150) { AU.sfx('boom'); AU.grunt(d, true); M.shake = .9; M.slow = .35; M.slowT = .6; d.av.setTint(new THREE.Color(0), 0); const p = d.pos.clone().setY(1);
        FX.spark(p, 0xffc040, 40, 2.4); FX.spark(p, 0xff5020, 30, 1.8); FX.smoke(p, 0x555555, 30, .8); FX.smoke(p, 0x222222, 20, 1); d.override = 'flying'; d.spin = 0; }
      if (t > 150 && t < 200) { const k = (t - 150) / 50; d.y = Math.sin(k * Math.PI) * 2.2; d.spin = k * 6; }
      if (t === 200) { d.y = 0; d.override = 'lying'; AU.sfx('fall'); FX.dust(d.pos); }
      const F = a.fwd, S = sideOf(F);
      M.camOverride = t < 150 ? { pos: D.c.clone().add(new V3(Math.sin(t * .01) * 4, 2.2, Math.cos(t * .01) * 4)), look: D.c.clone().setY(1.1) } : { pos: D.c.clone().add(new V3(4.5, 2.6, 4.5)), look: D.c.clone().setY(1.2) };
      if (t === 205) a.override = 'jostoFilmEnd';
    },
    end(M, a, d, D) { if (D.cam.parent) D.cam.parent.remove(D.cam); d.av.setTint(new THREE.Color(0), 0); d.y = 0; },
  },
  davidino: {
    dur: 230, dmg: 30, name: 'Braccio di ferro',
    start(M, a, d, D) { a.override = 'armWrestleA'; d.override = 'armWrestleB'; HUD.specialTitle(a.def.name, this.name); AU.sfx('grab'); D.c = a.pos.clone().lerp(d.pos, .5); const F = a.fwd; a.pos.copy(D.c).addScaledVector(F, -.36); d.pos.copy(D.c).addScaledVector(F, .36); d.yaw = a.yaw + Math.PI; },
    update(M, a, d, t, D) {
      const F = a.fwd, S = sideOf(F);
      a.wrestle = d.wrestle = t < 110 ? Math.sin(t * .3) * .12 * (t / 110) : Math.min(1, (t - 110) / 14);
      if (t === 20) AU.sfx('strain'); if (t === 70) AU.sfx('strain');
      if (t > 20 && t < 110) M.shake = Math.max(M.shake, .06);
      if (t === 116) { AU.sfx('whooshBig'); AU.grunt(d, true); d.override = 'flying'; d.spin = 0; D.f0 = d.pos.clone(); }
      if (t > 116 && t < 160) { const k = (t - 116) / 44; d.pos.copy(D.f0).addScaledVector(F, k * 1.4); d.y = Math.sin(k * Math.PI) * 1.4; d.spin = k * 4.2; }
      if (t === 160) { d.y = 0; d.override = 'lying'; AU.sfx('slam'); FX.dust(d.pos); M.shake = .5; a.override = 'fistPump'; a.t = 0; }
      M.camOverride = { pos: D.c.clone().addScaledVector(S, 2.3).addScaledVector(F, .4).setY(1.45), look: D.c.clone().setY(1.25 + (t > 116 && t < 170 ? .3 : 0)) };
    },
    end(M, a, d, D) { a.wrestle = d.wrestle = 0; d.y = 0; },
  },
  gio: {
    dur: 220, dmg: 30, name: 'Spray al peperoncino',
    start(M, a, d, D) { D.can = makeSpray(); holdInRight(a.av, D.can, [-9, 3, 2], [0, 0, Math.PI / 2]); a.override = 'gioSpray'; d.override = 'dazed'; HUD.specialTitle(a.def.name, this.name); a.pos.copy(d.pos).addScaledVector(a.fwd, -1.0); },
    update(M, a, d, t, D) {
      const F = a.fwd, S = sideOf(F);
      if (t === 24) AU.sfx('spray');
      if (t > 24 && t < 80 && t % 2 === 0) { const p = a.av.B.rHa.getWorldPosition(new V3()).addScaledVector(F, .12); FX.smoke(p, 0xd8261c, 2, .12, F.clone().multiplyScalar(2.6)); }
      if (t === 40) { d.override = 'eyesCovered'; d.t = 0; AU.grunt(d, true); }
      if (t === 70) AU.sfx('cough');
      if (t > 40 && t < 170) { d.pos.addScaledVector(F, .006); d.yaw += Math.sin(t * .08) * .02; }
      if (t === 120) AU.sfx('cough');
      if (t === 172) { d.override = 'ballHit'; d.t = 0; }
      if (t === 203) { AU.sfx('fall'); FX.dust(d.pos); }
      if (t === 90) a.override = 'mog';
      M.camOverride = t < 90 ? { pos: a.pos.clone().addScaledVector(S, 2.4).addScaledVector(F, .5).setY(1.6), look: a.pos.clone().addScaledVector(F, .5).setY(1.5) } : { pos: d.pos.clone().addScaledVector(F, -1.7).addScaledVector(S, 1.2).setY(1.6), look: d.pos.clone().setY(1.4) };
    },
    end(M, a, d, D) { if (D.can.parent) D.can.parent.remove(D.can); },
  },
});
