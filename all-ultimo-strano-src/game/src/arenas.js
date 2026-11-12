'use strict';
/* ===== Arene: ricostruzioni procedurali dai luoghi reali ===== */
function noiseFill(c, w, h, base, amt, n = 4000, sz = 2) {
  c.fillStyle = base; c.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) { const v = Math.random() < .5 ? 0 : 255; c.fillStyle = `rgba(${v},${v},${v},${Math.random() * amt})`; c.fillRect(Math.random() * w, Math.random() * h, sz + Math.random() * sz, sz + Math.random() * sz); }
}
const TX = {};
function texAsphalt() { return TX.asph || (TX.asph = canvasTex(512, 512, (c, w, h) => { noiseFill(c, w, h, '#5d5d5c', .18, 26000, 1.5); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(30,30,30,${rand(.05, .15)})`; c.beginPath(); c.ellipse(rand(0, w), rand(0, h), rand(10, 60), rand(5, 30), rand(0, 3), 0, TAU); c.fill(); } for (let i = 0; i < 12; i++) { c.strokeStyle = 'rgba(25,25,25,.35)'; c.lineWidth = 1.2; c.beginPath(); let x = rand(0, w), y = rand(0, h); c.moveTo(x, y); for (let k = 0; k < 8; k++) { x += rand(-20, 20); y += rand(-20, 20); c.lineTo(x, y); } c.stroke(); } }, true, [6, 6])); }
function texPlaster(col, dirt = .25) { return canvasTex(256, 256, (c, w, h) => { noiseFill(c, w, h, col, .07, 9000, 2); const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(60,45,30,${dirt})`); c.fillStyle = g; c.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(90,70,50,${rand(.03, .08)})`; c.fillRect(rand(0, w), 0, rand(2, 8), h); } }, true, [1, 1]); }
function texPaving(col = '#b9b1a3') { return canvasTex(256, 256, (c, w, h) => { noiseFill(c, w, h, col, .1, 6000, 2); c.strokeStyle = 'rgba(60,55,50,.45)'; c.lineWidth = 2; for (let x = 0; x <= w; x += 64) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }, true, [1, 1]); }
function texGrassDry() { return TX.dry || (TX.dry = canvasTex(512, 512, (c, w, h) => { noiseFill(c, w, h, '#b99a5c', .0, 0); for (let i = 0; i < 9000; i++) { const t = Math.random(); c.strokeStyle = t < .5 ? `rgba(214,184,120,${rand(.2, .6)})` : t < .85 ? `rgba(150,120,70,${rand(.2, .5)})` : `rgba(120,130,70,${rand(.2, .5)})`; c.lineWidth = 1; const x = rand(0, w), y = rand(0, h); c.beginPath(); c.moveTo(x, y); c.lineTo(x + rand(-3, 3), y - rand(3, 9)); c.stroke(); } }, true, [10, 10])); }
function texLeaves(col) { return canvasTex(128, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); for (let i = 0; i < 700; i++) { const l = rand(-40, 40); c.fillStyle = `rgba(${l > 0 ? 255 : 0},${l > 0 ? 255 : 0},${l > 0 ? 200 : 0},${Math.abs(l) / 200})`; c.beginPath(); c.ellipse(rand(0, w), rand(0, h), rand(2, 5), rand(1, 3), rand(0, 3), 0, TAU); c.fill(); } }); }
// facciata con finestre, persiane e balconi
function facade(o) {
  const W = o.cols * 110, H = o.rows * 120 + (o.ground || 0);
  return canvasTex(Math.min(1024, W), Math.min(1024, H), (c, w, h) => {
    const sx = w / W, sy = h / H; c.scale(sx, sy);
    noiseFill(c, W, H, o.wall, .06, 5000, 2);
    if (o.band) { c.fillStyle = o.band; for (let r = 0; r <= o.rows; r++) c.fillRect(0, (o.ground || 0) + r * 120 - 6, W, 10); }
    if (o.brick) { c.fillStyle = o.brick; for (let col = 0; col < o.cols; col += 2) c.fillRect(col * 110 + 18, 0, 74, H); }
    for (let r = 0; r < o.rows; r++) for (let col = 0; col < o.cols; col++) {
      const x = col * 110 + 30, y = r * 120 + 25 + (o.ground ? 0 : 0); if (o.skip && o.skip(r, col)) continue;
      c.fillStyle = o.frame || '#d8d0c0'; c.fillRect(x - 6, y - 6, 62, 86);
      c.fillStyle = '#22262a'; c.fillRect(x, y, 50, 74);
      if (o.shutter) { c.fillStyle = o.shutter; const open = Math.random() < .5; if (open) { c.fillRect(x - 26, y, 22, 74); c.fillRect(x + 54, y, 22, 74); } else c.fillRect(x, y, 50, 74); c.fillStyle = 'rgba(0,0,0,.25)'; for (let k = 0; k < 74; k += 5) { if (open) { c.fillRect(x - 26, y + k, 22, 1.5); c.fillRect(x + 54, y + k, 22, 1.5); } else c.fillRect(x, y + k, 50, 1.5); } }
      else if (o.roller) { c.fillStyle = o.roller; c.fillRect(x, y, 50, 74 * rand(.2, .9)); }
      if (o.balcony && r > 0 && (o.balcony === true || o.balcony(r, col))) { c.fillStyle = o.balc || '#e8e2d6'; c.fillRect(x - 22, y + 74, 94, 8); c.strokeStyle = o.rail || '#2b2b2b'; c.lineWidth = 2; for (let k = 0; k <= 94; k += 8) { c.beginPath(); c.moveTo(x - 22 + k, y + 74); c.lineTo(x - 22 + k, y + 48); c.stroke(); } c.beginPath(); c.moveTo(x - 22, y + 48); c.lineTo(x + 72, y + 48); c.stroke(); }
    }
    if (o.ground) { c.fillStyle = o.groundCol || '#8a8070'; c.fillRect(0, H - o.ground, W, o.ground); if (o.shops) for (let col = 0; col < o.cols; col += 2) { c.fillStyle = '#1e2226'; c.fillRect(col * 110 + 16, H - o.ground + 20, 180, o.ground - 20); c.fillStyle = o.awn || '#6d2f2a'; c.fillRect(col * 110 + 10, H - o.ground + 8, 194, 22); } }
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(50,35,20,.18)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  });
}
const ARENA_ITEMS = [];
function addA(m, x = 0, y = 0, z = 0, ry = 0, shadow = 'both') { m.position.set(x, y, z); m.rotation.y = ry; if (shadow) m.traverse(o => { if (o.isMesh) { o.castShadow = shadow === 'both' || shadow === 'cast'; o.receiveShadow = true; } }); ARENA.group.add(m); return m; }
function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function building(w, h, d, wallTex, roof, roofCol, extra = {}) {
  const g = new THREE.Group(); const side = new THREE.MeshStandardMaterial({ map: wallTex, roughness: .92 });
  const plain = new THREE.MeshStandardMaterial({ color: extra.sideCol || 0xd9cbb0, roughness: .95 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [plain, plain, plain, plain, side, side]); m.position.y = h / 2; g.add(m);
  if (roof === 'tile') { const r = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w, d) / 2 * 1.02, h * .0 + 1.3, 4, 1), std(roofCol || 0xa24b2c, .85)); r.rotation.y = Math.PI / 4; r.scale.set(w / Math.hypot(w, d) * 1.45, 1, d / Math.hypot(w, d) * 1.45); r.position.y = h + .62; g.add(r); }
  else if (roof === 'flat') { const r = box(w + .2, .2, d + .2, std(roofCol || 0xcfc6b5, .9)); r.position.y = h + .1; g.add(r); }
  return g;
}
function tree(o = {}) {
  const g = new THREE.Group(), h = o.h || 4, trunk = new THREE.Mesh(new THREE.CylinderGeometry(.12 * (o.tk || 1), .2 * (o.tk || 1), h * .55, 7), std(0x5a4632, .95));
  trunk.position.y = h * .27; g.add(trunk);
  const lt = o.tex || (TX.leaf || (TX.leaf = texLeaves('#3f5a2a')));
  const mat = new THREE.MeshStandardMaterial({ map: lt, color: o.col || 0xffffff, roughness: .9 });
  const n = o.n || 7;
  for (let i = 0; i < n; i++) { const s = (o.r || 1.4) * rand(.55, .95); const b = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), mat); b.position.set(rand(-.7, .7) * (o.r || 1.4) * .7, h * .62 + rand(-.3, .6) * (o.r || 1.4) * .6, rand(-.7, .7) * (o.r || 1.4) * .7); b.scale.y = o.flat || .85; g.add(b); }
  return g;
}
function cypress(h = 7) { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.ConeGeometry(.9, h, 9), new THREE.MeshStandardMaterial({ map: TX.cyp || (TX.cyp = texLeaves('#26361f')), roughness: .95 })); m.position.y = h / 2 + .3; m.scale.x = m.scale.z = .8; g.add(m); return g; }
function palm(h = 7) {
  const g = new THREE.Group(); let y = 0; const seg = 8; const trunkMat = std(0x7a6650, .95);
  for (let i = 0; i < seg; i++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.2, .25, h / seg, 7), trunkMat); s.position.set(Math.sin(i / seg * 1.2) * .3, y + h / seg / 2, 0); g.add(s); y += h / seg; }
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4f6f2c, roughness: .8, side: THREE.DoubleSide });
  for (let i = 0; i < 11; i++) { const lg = new THREE.PlaneGeometry(.5, 2.6, 1, 4); lg.translate(0, 1.3, 0); const p = lg.attributes.position; for (let k = 0; k < p.count; k++) { const yy = p.getY(k); p.setZ(k, -yy * yy * .12); } lg.computeVertexNormals(); const l = new THREE.Mesh(lg, leafMat); l.position.set(.35, y, 0); l.rotation.set(1.25 + rand(-.2, .2), i / 11 * TAU, 0, 'YXZ'); g.add(l); }
  return g;
}
function lamp(h = 7) { const g = new THREE.Group(), m = std(0x6d7175, .5, .6); const p = new THREE.Mesh(new THREE.CylinderGeometry(.07, .1, h, 8), m); p.position.y = h / 2; g.add(p); const arm = box(1.4, .08, .08, m); arm.position.set(.65, h - .1, 0); g.add(arm); const head = box(.5, .12, .25, std(0x3a3c3f, .4, .5)); head.position.set(1.3, h - .18, 0); g.add(head); return g; }
function signTown(name) {   // cartello bianco di inizio centro abitato
  const t = canvasTex(512, 200, (c, w, h) => { c.fillStyle = '#f5f5f2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#151515'; c.lineWidth = 10; c.strokeRect(12, 12, w - 24, h - 24); c.fillStyle = '#151515'; let fs = 92; c.font = `bold ${fs}px Arial Narrow, Arial, sans-serif`; while (c.measureText(name.toUpperCase()).width > w - 70 && fs > 30) { fs -= 4; c.font = `bold ${fs}px Arial Narrow, Arial, sans-serif`; } c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name.toUpperCase(), w / 2, h / 2 + 4); });
  const g = new THREE.Group(), pole = std(0x8e9296, .5, .6);
  for (const x of [-.55, .55]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 2.6, 8), pole); p.position.set(x, 1.3, -.03); g.add(p); }
  const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, .62, .03), [pole, pole, pole, pole, new THREE.MeshStandardMaterial({ map: t, roughness: .6 }), std(0x9da1a5, .5, .5)]); b.position.y = 2.15; g.add(b);
  return g;
}
function addSigns(name, z, x) {   // un cartello per lato, così si vede da qualunque parte stia la telecamera
  for (const sd of [-1, 1]) { const g = signTown(name); g.scale.setScalar(1.45); addA(g, sd * x, 0, sd * z, sd < 0 ? 0 : Math.PI); }
}
function stopSign() { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 2.4, 8), std(0x8e9296, .5, .6)); p.position.y = 1.2; g.add(p);
  const t = canvasTex(128, 128, (c, w) => { c.fillStyle = '#c4161c'; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + TAU / 16; c.lineTo(64 + Math.cos(a) * 62, 64 + Math.sin(a) * 62); } c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 5; c.stroke(); c.fillStyle = '#fff'; c.font = 'bold 38px Arial'; c.textAlign = 'center'; c.fillText('STOP', 64, 78); });
  const s = new THREE.Mesh(new THREE.CircleGeometry(.36, 8), new THREE.MeshStandardMaterial({ map: t, roughness: .5 })); s.position.set(0, 2.3, .035); s.rotation.z = TAU / 16; g.add(s); return g; }
function ironFence(len, h = 1.5, diamond = true) {
  const g = new THREE.Group(), m = std(0x1d1e20, .6, .5);
  const top = box(len, .05, .05, m); top.position.y = h; g.add(top); const bot = box(len, .05, .05, m); bot.position.y = .1; g.add(bot);
  for (let x = -len / 2; x <= len / 2; x += .14) { const b = box(.025, h, .025, m); b.position.set(x, h / 2, 0); g.add(b); }
  if (diamond) for (let x = -len / 2 + .3; x < len / 2; x += .6) { const d = new THREE.Mesh(new THREE.TorusGeometry(.15, .012, 4, 4), m); d.position.set(x, h * .55, 0); g.add(d); }
  return g;
}
function mountains(col = 0x7d8aa0, dist = 140, hgt = 26, seed = 1) {
  const n = 160, g = new THREE.BufferGeometry(), pos = [], idx = [];
  for (let i = 0; i <= n; i++) { const a = i / n * TAU, hh = (Math.sin(a * 3 + seed) * .35 + Math.sin(a * 7 + seed * 2) * .2 + Math.sin(a * 17 + seed) * .08 + .6) * hgt; pos.push(Math.cos(a) * dist, -2, Math.sin(a) * dist, Math.cos(a) * dist, hh, Math.sin(a) * dist); if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, fog: true }));
}
function skyDome(top, mid, bottom) {
  const t = canvasTex(16, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(.48, mid); g.addColorStop(.52, bottom); g.addColorStop(1, bottom); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false, depthWrite: false })); return m;
}
function parkedCar(col) { const c = makePunto(); c.traverse(m => { if (m.isMesh && m.material.color && m.material.color.getHex() === 0x1d3f8f) { m.material = m.material.clone(); m.material.color.setHex(col); } }); return c; }

const ARENA = {
  group: new THREE.Group(), sun: null, hemi: null, cur: null,
  build(id) {
    if (this.curId === id && this.group.parent) return this.cur;
    this.clear(); scene.add(this.group);
    const A = ARENAS[id]; this.cur = A; this.curId = id;
    scene.fog = new THREE.Fog(A.fog || 0xc9d8e6, 40, 230);
    scene.background = new THREE.Color(A.fog || 0xc9d8e6);
    this.hemi = new THREE.HemisphereLight(A.skyLight || 0xdfeeff, A.groundLight || 0x8a7a60, A.hemiI || .75); this.group.add(this.hemi);
    const sun = this.sun = new THREE.DirectionalLight(A.sunCol || 0xfff2dc, A.sunI || 2.1); sun.position.set(...(A.sunPos || [8, 14, 6])); sun.castShadow = true;
    sun.shadow.mapSize.set(QUALITY.shadow, QUALITY.shadow); const s = sun.shadow.camera; s.left = s.bottom = -11; s.right = s.top = 11; s.near = 1; s.far = 50; sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
    this.group.add(sun); this.group.add(sun.target);
    this.group.add(skyDome(A.sky[0], A.sky[1], A.sky[2]));
    A.build();
    mergeStatic(this.group);
    return A;
  },
  clear() { scene.remove(this.group); this.group.traverse(o => { if (o.geometry) o.geometry.dispose(); }); this.group = new THREE.Group(); },
};

const ARENAS = {
  capoterra: {
    name: 'Capoterra', music: 0, bounds: [8.5, 3.6], cam: [24, 6.6], sky: ['#5d8fd0', '#a8c8ea', '#d9d3c4'], fog: 0xc3d3e4, sunPos: [6, 16, 9],
    build() {
      // strada
      const road = new THREE.Mesh(new THREE.PlaneGeometry(90, 9), new THREE.MeshStandardMaterial({ map: texAsphalt(), roughness: .95 })); road.rotation.x = -Math.PI / 2; addA(road, 0, 0, 0, 0, 'recv');
      const pav = texPaving('#c4b9a6'); pav.repeat.set(30, 1);
      for (const z of [-5.6, 5.6]) { const sw = box(90, .15, 2.2, new THREE.MeshStandardMaterial({ map: pav, roughness: .9 })); addA(sw, 0, .075, z, 0, 'recv'); const curb = box(90, .17, .15, std(0x9c968c, .9)); addA(curb, 0, .085, z + (z < 0 ? 1.1 : -1.1)); }
      const lines = new THREE.Mesh(new THREE.PlaneGeometry(90, .12), std(0xe8e4d8, .7)); lines.rotation.x = -Math.PI / 2; addA(lines, 0, .005, 0, 0, null);
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: texGrassDry(), roughness: 1 })); ground.rotation.x = -Math.PI / 2; addA(ground, 0, -.02, 0, 0, 'recv');
      // lato nord (dietro): villette color sabbia con cancellate a rombi e pergolato
      const villaCols = ['#d8c49c', '#e1cfaa', '#cdb791', '#e6d5b8'];
      for (let i = 0; i < 6; i++) {
        const x = -32 + i * 12.5, wall = facade({ cols: 4, rows: 2, wall: villaCols[i % 4], shutter: i % 2 ? '#7b5a3a' : '#5b4630', frame: '#e9dfca', balcony: (r, c) => c === 1 || c === 2, rail: '#2a2a2a' });
        addA(building(9, 6.2, 8, wall, 'tile', 0xa64a2a), x, 0, -12.5);
        const fence = ironFence(11, 1.45); addA(fence, x, .15, -7.1);
        const wl = box(11, .5, .3, std(0xd4c3a2, .9)); addA(wl, x, .25, -7.1);
      }
      // pergolato con l'uva
      const per = new THREE.Group(), wood = std(0x6b5032, .9);
      for (const px of [-2.4, 2.4]) for (const pz of [-1, 1]) { const p = box(.12, 2.5, .12, wood); p.position.set(px, 1.25, pz); per.add(p); }
      for (let k = -2.4; k <= 2.4; k += .4) { const b = box(.06, .06, 2.4, wood); b.position.set(k, 2.5, 0); per.add(b); }
      const vine = new THREE.MeshStandardMaterial({ map: TX.vine || (TX.vine = texLeaves('#4f6b2e')), roughness: .9 });
      for (let i = 0; i < 14; i++) { const v = new THREE.Mesh(new THREE.IcosahedronGeometry(rand(.4, .7), 1), vine); v.position.set(rand(-2.4, 2.4), 2.65, rand(-1, 1)); v.scale.y = .45; per.add(v); }
      addA(per, 6, 0, -9.2);
      // muro rosso mattone con finestre a grate
      const red = facade({ cols: 6, rows: 1, wall: '#9b4a32', frame: '#c9c0b0', shutter: null, roller: null });
      addA(building(14, 3.2, 1, red, 'flat', 0xb9ae9a), -18, 0, -8.2);
      // lato sud: palazzina gialla con le scale esterne arancioni
      const yel = facade({ cols: 5, rows: 3, wall: '#e2c25c', shutter: '#7d5b3c', frame: '#efe3c0', balcony: true, rail: '#3a3a3a' });
      const pal = addA(building(12, 9, 9, yel, 'tile', 0x9e4b2e), 4, 0, 13.5, Math.PI);
      const stairM = std(0xd7772f, .8);
      for (let k = 0; k < 12; k++) { const st = box(1.2, .2, .32, stairM); st.position.set(-2.5 + k * .3, .2 + k * .28, -4.9); pal.add(st); }
      const rail = box(3.8, .06, .06, std(0x2b2b2b, .5, .5)); rail.position.set(-.8, 3.6, -5.4); rail.rotation.z = .74; pal.add(rail);
      for (let i = 0; i < 4; i++) { const x = -26 + i * 11; if (Math.abs(x - 4) < 7) continue; const wall = facade({ cols: 4, rows: 2, wall: villaCols[(i + 1) % 4], shutter: '#6a5039', frame: '#e9dfca', balcony: (r, c) => c % 2 === 0 }); addA(building(9, 6, 8, wall, 'tile', 0xa64a2a), x, 0, 12.8, Math.PI); const f = ironFence(10, 1.4); addA(f, x, .15, 7.2); }
      addA(lamp(7), -8, .15, -6.4, Math.PI / 2); addA(lamp(7), 14, .15, 6.4, -Math.PI / 2); addA(lamp(7), 30, .15, -6.4, Math.PI / 2);
      addA(stopSign(), 11, .15, -6.3, 0);
      addSigns('Capoterra', 6.6, 2.4);
      for (const [x, z, s] of [[-14, -15, 1.3], [20, -16, 1.6], [-30, 15, 1.4], [26, 14, 1.2]]) addA(tree({ h: 4.5 * s, r: 1.6 * s }), x, 0, z);
      addA(palm(8), 16, 0, -9.5); addA(palm(7), -24, 0, 9.5);
      addA(parkedCar(0xd9d9d9), 20, 0, -3.3, 0); addA(parkedCar(0x7a1c1c), -24, 0, 3.4, Math.PI);
      ARENA.group.add(mountains(0x8292ab, 150, 34, 1.5)); ARENA.group.add(mountains(0x99a7bc, 210, 50, 4));
    },
  },
  quartello: {
    name: 'Quartello', music: 1, bounds: [9.5, 5.2], cam: [14, 8.2], sky: ['#6390cf', '#b3cbe6', '#dcd2bd'], fog: 0xcbd7e2, sunPos: [-7, 15, 8],
    build() {
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: texGrassDry(), roughness: 1 })); ground.rotation.x = -Math.PI / 2; addA(ground, 0, -.01, 0, 0, 'recv');
      // campetto da basket
      const ct = canvasTex(1024, 560, (c, w, h) => { noiseFill(c, w, h, '#4f6f5c', .12, 30000, 1.5); c.fillStyle = '#7a3a33'; c.fillRect(0, 0, w, 40); c.fillRect(0, h - 40, w, 40); c.fillRect(0, 0, 40, h); c.fillRect(w - 40, 0, 40, h);
        c.strokeStyle = 'rgba(245,245,240,.9)'; c.lineWidth = 6; c.strokeRect(60, 60, w - 120, h - 120); c.beginPath(); c.moveTo(w / 2, 60); c.lineTo(w / 2, h - 60); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, 70, 0, TAU); c.stroke();
        for (const s of [1, -1]) { const x0 = s > 0 ? 60 : w - 60; c.strokeRect(s > 0 ? 60 : w - 60 - 190, h / 2 - 75, 190, 150); c.beginPath(); c.arc(x0 + s * 190, h / 2, 75, -Math.PI / 2, Math.PI / 2, s < 0); c.stroke(); c.beginPath(); c.arc(x0 + s * 20, h / 2, 250, -Math.PI / 2, Math.PI / 2, s < 0); c.stroke(); } });
      const court = new THREE.Mesh(new THREE.PlaneGeometry(28, 15.3), new THREE.MeshStandardMaterial({ map: ct, roughness: .85 })); court.rotation.x = -Math.PI / 2; addA(court, 0, .02, 0, 0, 'recv');
      for (const s of [-1, 1]) {   // canestri
        const g = new THREE.Group(), m = std(0x3a6ea8, .5, .4);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 3.4, 10), m); pole.position.y = 1.7; g.add(pole);
        const arm = box(1.1, .1, .1, m); arm.position.set(-s * .5, 3.2, 0); g.add(arm);
        const bd = box(.06, 1.05, 1.8, std(0xf2f2f2, .4)); bd.position.set(-s * 1.05, 3.4, 0); g.add(bd);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(.23, .02, 6, 20), std(0xd5541c, .4, .5)); rim.rotation.x = Math.PI / 2; rim.position.set(-s * 1.32, 3.05, 0); g.add(rim);
        addA(g, s * 14.6, 0, 0);
      }
      // rete metallica intorno
      const netT = canvasTex(64, 64, (c, w) => { c.clearRect(0, 0, w, w); c.strokeStyle = 'rgba(70,75,80,1)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, w); c.moveTo(w, 0); c.lineTo(0, w); c.stroke(); }, true, [60, 3]);
      const net = new THREE.MeshStandardMaterial({ map: netT, transparent: true, alphaTest: .3, side: THREE.DoubleSide, roughness: .6, metalness: .4 });
      for (const [w, x, z, ry] of [[30, 0, -8.6, 0], [30, 0, 8.6, 0], [17.2, -15.2, 0, Math.PI / 2], [17.2, 15.2, 0, Math.PI / 2]]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(w, 3), net); addA(f, x, 1.5, z, ry, null); for (let k = -w / 2; k <= w / 2; k += 3) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 3.1, 6), std(0x55595e, .5, .6)); const g = new THREE.Group(); g.add(p); p.position.y = 1.55; addA(g, x + (ry ? 0 : k), 0, z + (ry ? k : 0)); } }
      // palazzine color pesca con i balconi curvi
      const pes = ['#e9a46e', '#efb98a', '#e7c49b', '#f0c79a'];
      for (let i = 0; i < 4; i++) { const t = facade({ cols: 6, rows: 4, wall: pes[i], band: '#f2e4cf', roller: '#d9cbb2', frame: '#f4ead8', balcony: true, balc: '#e88a50', rail: '#4a5056' }); addA(building(18, 13, 11, t, 'flat'), -36 + i * 22, 0, -30); }
      for (let i = 0; i < 3; i++) { const t = facade({ cols: 5, rows: 8, wall: '#e0caa2', band: '#ead9bc', roller: '#cdbf9f', frame: '#efe4cf', balcony: (r, c) => c % 2 === 0, rail: '#555' }); addA(building(14, 26, 12, t, 'flat'), -30 + i * 30, 0, 42, Math.PI); }
      for (let i = 0; i < 3; i++) { const t = facade({ cols: 6, rows: 4, wall: pes[(i + 2) % 4], band: '#f4e6d0', roller: '#d6c7ad', balcony: true, balc: '#df8a55', rail: '#4a5056' }); addA(building(20, 13, 11, t, 'flat'), -60 + i * 0, 0, -6 + i * 22, Math.PI / 2); addA(building(20, 12, 11, t, 'flat'), 62, 0, -10 + i * 22, -Math.PI / 2); }
      // parco giochi con lo scivolo rosso
      const pg = new THREE.Group(), wd = std(0x7b5634, .9);
      for (const [x, z] of [[0, 0], [1.4, 0], [0, 1.4], [1.4, 1.4]]) { const p = box(.12, 2.4, .12, wd); p.position.set(x, 1.2, z); pg.add(p); }
      const pl = box(1.6, .1, 1.6, wd); pl.position.set(.7, 1.3, .7); pg.add(pl); const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, .8, 4), std(0x2d6a9a, .7)); roof.position.set(.7, 2.8, .7); roof.rotation.y = Math.PI / 4; pg.add(roof);
      const sl = box(.7, .06, 2.8, std(0xd42b22, .5)); sl.position.set(.7, .7, 2.6); sl.rotation.x = .48; pg.add(sl);
      addA(pg, 8, 0, -17);
      for (const [x, z, s] of [[-20, -14, 1.2], [-8, -21, .9], [16, -22, 1], [24, -12, .8], [-26, 14, 1], [20, 16, 1.1], [3, 22, .8]]) addA(tree({ h: 4 * s, r: 1.3 * s, flat: .9 }), x, 0, z);
      for (const [x, z] of [[-12, -18], [12, -12], [-18, 18], [10, 20]]) { const b = tree({ h: 1.2, r: 1.1, n: 5, tk: .4 }); addA(b, x, 0, z); }
      addA(tree({ h: 7, r: 3.6, n: 11, flat: .95, col: 0xbfd6b0 }), -30, 0, 28);
      addA(palm(10), 34, 0, 26); addA(palm(9), 38, 0, 30);
      const cars = [0xffffff, 0x1b1b1b, 0xb8b8b8, 0xc21e1e, 0x2f4f8f, 0xe0e0e0];
      for (let i = 0; i < 7; i++) addA(parkedCar(cars[i % cars.length]), -24 + i * 4.6, 0, 26, Math.PI / 2 + rand(-.05, .05));
      for (const x of [-20, 0, 20]) addA(lamp(8), x, 0, 11, -Math.PI / 2);
      addSigns('Quartello', 8.15, 3.2);
      ARENA.group.add(mountains(0x8f9db3, 170, 22, 2.2));
    },
  },
};

/* unisce le mesh statiche con lo stesso materiale: molte meno chiamate di disegno sui telefoni */
function mergeStatic(group) {
  group.updateMatrixWorld(true);
  const buckets = new Map(), remove = [];
  const keyOf = m => m.map || m.alphaMap || m.transparent || m.type !== 'MeshStandardMaterial' ? m.uuid : 'c' + m.color.getHex() + '|' + m.roughness + '|' + m.metalness + '|' + m.side + '|' + (m.emissive ? m.emissive.getHex() : 0);
  group.traverse(o => {
    if (!o.isMesh || o.isSkinnedMesh || o.userData.keep || !o.geometry.attributes.position) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const groups = Array.isArray(o.material) ? o.geometry.groups : [{ start: 0, count: o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count, materialIndex: 0 }];
    for (const gr of groups) { const m = mats[gr.materialIndex]; const k = keyOf(m); if (!buckets.has(k)) buckets.set(k, { mat: m, parts: [], cast: false, recv: false }); const b = buckets.get(k); b.parts.push({ o, gr }); b.cast = b.cast || o.castShadow; b.recv = b.recv || o.receiveShadow; }
    remove.push(o);
  });
  const nm = new THREE.Matrix3();
  for (const b of buckets.values()) {
    let n = 0; for (const { o, gr } of b.parts) n += gr.count;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let w = 0;
    const v = new V3(), nn = new V3();
    for (const { o, gr } of b.parts) {
      const g = o.geometry, P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv, I = g.index; nm.getNormalMatrix(o.matrixWorld);
      for (let i = gr.start; i < gr.start + gr.count; i++) {
        const k = I ? I.getX(i) : i;
        v.fromBufferAttribute(P, k).applyMatrix4(o.matrixWorld); pos[w * 3] = v.x; pos[w * 3 + 1] = v.y; pos[w * 3 + 2] = v.z;
        if (N) { nn.fromBufferAttribute(N, k).applyMatrix3(nm).normalize(); nor[w * 3] = nn.x; nor[w * 3 + 1] = nn.y; nor[w * 3 + 2] = nn.z; }
        if (U) { uv[w * 2] = U.getX(k); uv[w * 2 + 1] = U.getY(k); }
        w++;
      }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, b.mat); mesh.castShadow = b.cast; mesh.receiveShadow = b.recv; mesh.frustumCulled = false; group.add(mesh);
  }
  for (const o of remove) { o.parent.remove(o); o.geometry.dispose(); }
}
