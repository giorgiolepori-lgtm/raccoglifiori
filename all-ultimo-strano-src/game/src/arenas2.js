'use strict';
/* ===== Arene: le altre otto ===== */
const sm = (c, r = .85, m = 0, e) => std(c, r, m, e);
function ground(tex, size = 400) { const g = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 })); g.rotation.x = -Math.PI / 2; return g; }
function texRock() { return TX.rock || (TX.rock = canvasTex(512, 512, (c, w, h) => { noiseFill(c, w, h, '#b9ada3', .12, 30000, 1.6); for (let i = 0; i < 4000; i++) { c.fillStyle = pick(['rgba(40,35,35,.5)', 'rgba(240,235,230,.5)', 'rgba(190,130,120,.35)']); c.fillRect(rand(0, w), rand(0, h), rand(1, 3), rand(1, 3)); } for (let i = 0; i < 14; i++) { c.strokeStyle = 'rgba(60,50,45,.35)'; c.lineWidth = 2; c.beginPath(); let x = rand(0, w), y = rand(0, h); c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rand(-40, 40); y += rand(-40, 40); c.lineTo(x, y); } c.stroke(); } }, true, [8, 8])); }
function texSand() { return TX.sand || (TX.sand = canvasTex(256, 256, (c, w, h) => noiseFill(c, w, h, '#e8d9b8', .1, 9000, 1.5), true, [40, 40])); }
function texCobble(col = '#8f8a80') { return canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#5e5a54'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 32) for (let x = (y / 32 % 2) * 20; x < w; x += 40) { c.fillStyle = `hsl(35,${rand(5, 14)}%,${rand(42, 58)}%)`; c.beginPath(); c.roundRect ? c.roundRect(x + 2, y + 2, 36, 28, 7) : c.rect(x + 2, y + 2, 36, 28); c.fill(); } }, true, [10, 10]); }
function boulder(r, col = 0x9a9087) { const g = new THREE.SphereGeometry(r, 18, 12), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = new V3().fromBufferAttribute(p, i), k = 1 + (Math.sin(v.x * 3.1) + Math.cos(v.y * 2.7 + v.z)) * .08 + rand(-.05, .05); p.setXYZ(i, v.x * k, v.y * k * .75, v.z * k); } g.computeVertexNormals(); return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: texRock(), color: col, roughness: .95 })); }
function shrub(r = .8, col = '#4b5e31') { const t = texLeaves(col); const g = new THREE.Group(); for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r * rand(.6, 1), 1), new THREE.MeshStandardMaterial({ map: t, roughness: .95 })); b.position.set(rand(-r, r) * .6, r * .4, rand(-r, r) * .6); b.scale.y = .6; g.add(b); } return g; }
function umbrellaBeach(col) { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 2.2, 6), sm(0xdddddd)); p.position.y = 1.1; g.add(p); const c = new THREE.Mesh(new THREE.ConeGeometry(1.1, .45, 10, 1, true), sm(col, .8, 0, { side: THREE.DoubleSide })); c.position.y = 2.15; g.add(c); return g; }
function pineUmbrella(h = 9) { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(.18, .32, h, 8), sm(0x6a4b35, .95)); t.position.y = h / 2; t.rotation.z = .08; g.add(t); const m = new THREE.MeshStandardMaterial({ map: TX.pine || (TX.pine = texLeaves('#3e5428')), roughness: .95 }); for (let i = 0; i < 8; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(rand(1.6, 2.4), 10, 6), m); b.position.set(rand(-2, 2), h + rand(-.2, .4), rand(-2, 2)); b.scale.y = .35; g.add(b); } return g; }
function olive(h = 3.2) { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(.18, .32, h * .6, 7), sm(0x5d5345, .95)); t.position.y = h * .3; t.rotation.z = .15; g.add(t); const m = new THREE.MeshStandardMaterial({ map: TX.olive || (TX.olive = texLeaves('#6f7f58')), roughness: .95 }); for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(rand(.8, 1.2), 1), m); b.position.set(rand(-1, 1), h * .75 + rand(-.3, .4), rand(-1, 1)); b.scale.y = .7; g.add(b); } return g; }
function prickly() { const g = new THREE.Group(), m = sm(0x5f7a3a, .8); const pad = (x, y, z, s, ry, rz) => { const p = new THREE.Mesh(new THREE.SphereGeometry(.32 * s, 10, 8), m); p.scale.set(1, 1.35, .22); p.position.set(x, y, z); p.rotation.set(0, ry, rz); g.add(p); return p; };
  for (let i = 0; i < 14; i++) pad(rand(-.9, .9), rand(.3, 1.8), rand(-.6, .6), rand(.8, 1.2), rand(0, 3), rand(-.6, .6)); return g; }
function cloudLayer(n = 10) { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const m = new THREE.SpriteMaterial({ map: SPR.smoke, color: 0xffffff, transparent: true, opacity: .9, depthWrite: false, fog: false }); const s = new THREE.Sprite(m); const a = rand(0, TAU), r = rand(120, 220); s.position.set(Math.cos(a) * r, rand(45, 80), Math.sin(a) * r); s.scale.set(rand(60, 110), rand(25, 40), 1); g.add(s); } g.userData.keep = true; return g; }
function road(len, w, lines = 'single') { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.PlaneGeometry(len, w), new THREE.MeshStandardMaterial({ map: texAsphalt(), roughness: .95 })); r.rotation.x = -Math.PI / 2; g.add(r);
  const lm = sm(0xe9e5d8, .7); if (lines === 'double') for (const z of [-.12, .12]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(len, .1), lm); l.rotation.x = -Math.PI / 2; l.position.set(0, .006, z); g.add(l); }
  else if (lines === 'dashed') for (let x = -len / 2; x < len / 2; x += 6) { const l = new THREE.Mesh(new THREE.PlaneGeometry(3, .12), lm); l.rotation.x = -Math.PI / 2; l.position.set(x, .006, 0); g.add(l); }
  return g; }
function sidewalks(len, z, w = 2.2, col = '#c4b9a6') { const pav = texPaving(col); pav.repeat.set(len / 3, 1); for (const s of [-1, 1]) { const sw = box(len, .15, w, new THREE.MeshStandardMaterial({ map: pav, roughness: .9 })); addA(sw, 0, .075, s * (z + w / 2), 0, 'recv'); addA(box(len, .17, .15, sm(0x9c968c, .9)), 0, .085, s * z); } }
function rowAlong(fn, x0, x1, step, z, ry) { for (let x = x0; x <= x1; x += step) addA(fn(x), x + rand(-.3, .3), 0, z, ry); }
function carsAlong(z, ry, x0 = -30, x1 = 30, cols = [0xffffff, 0x1b1b1b, 0xb8b8b8, 0xc21e1e, 0x2f4f8f, 0xe0e0e0, 0x5a5a5a]) { let i = 0; for (let x = x0; x <= x1; x += 4.6) { if (Math.random() < .15 || Math.abs(x) < 15) continue; addA(parkedCar(cols[i++ % cols.length]), x, 0, z, ry + rand(-.03, .03)); } }
function van(col = 0xffffff, stripe) { const g = new THREE.Group(); const b = box(5, 2.2, 2, sm(col, .5, .2)); b.position.y = 1.35; g.add(b); const cab = box(1.2, 1.6, 1.96, sm(col, .5, .2)); cab.position.set(2.9, 1.05, 0); g.add(cab); const w = box(.05, .7, 1.7, sm(0x1a2026, .1, .5)); w.position.set(3.5, 1.5, 0); g.add(w);
  if (stripe) for (const z of [-1.01, 1.01]) { const s = box(5.6, .3, .02, sm(stripe, .6)); s.position.set(.3, 1.1, z); g.add(s); }
  for (const [x, z] of [[2.6, .9], [2.6, -.9], [-1.6, .9], [-1.6, -.9]]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.36, .36, .25, 16), sm(0x111111)); t.rotation.x = Math.PI / 2; t.position.set(x, .36, z); g.add(t); } return g; }
function bus() { const g = van(0xf2f0ea); g.scale.set(2.2, 1.35, 1.25); const st = box(5.2, .5, 2.06, sm(0xe8731f, .6)); st.position.y = 1.0; g.add(st); return g; }
function person(col) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(.19, .17, 1.1, 8), sm(col, .9)); b.position.y = .85; g.add(b); const h = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 8), sm(0xc89a7a, .7)); h.position.y = 1.6; g.add(h); const l = box(.3, .5, .18, sm(0x2b3140)); l.position.y = .25; g.add(l); return g; }
function flag(drawFn) { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 2.4, 6), sm(0xcccccc, .4, .6)); p.position.y = 1.2; g.add(p); const t = canvasTex(192, 128, drawFn); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .72, 8, 1), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: .8 })); f.position.set(.58, 2.0, 0); g.add(f); g.userData.flag = f; return g; }
const FLAG_IT = (c, w, h) => { c.fillStyle = '#009246'; c.fillRect(0, 0, w / 3, h); c.fillStyle = '#fff'; c.fillRect(w / 3, 0, w / 3, h); c.fillStyle = '#ce2b37'; c.fillRect(2 * w / 3, 0, w / 3, h); };
const FLAG_EU = (c, w, h) => { c.fillStyle = '#1f3e9b'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd200'; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; c.beginPath(); c.arc(w / 2 + Math.cos(a) * 34, h / 2 + Math.sin(a) * 34, 5, 0, TAU); c.fill(); } };
const FLAG_SA = (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8102e'; c.fillRect(w / 2 - 9, 0, 18, h); c.fillRect(0, h / 2 - 9, w, 18); c.fillStyle = '#111'; for (const [x, y] of [[w / 4, h / 4], [3 * w / 4, h / 4], [w / 4, 3 * h / 4], [3 * w / 4, 3 * h / 4]]) { c.beginPath(); c.arc(x, y, 13, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.fillRect(x - 13, y - 5, 26, 5); c.fillStyle = '#111'; } };
function lantern() { const g = new THREE.Group(), m = sm(0x1a1a1a, .5, .6); const arm = box(.5, .04, .04, m); arm.position.set(.25, 0, 0); g.add(arm); const l = new THREE.Mesh(new THREE.CylinderGeometry(.12, .08, .3, 6), sm(0xffe9b0, .3, 0, { emissive: 0x5a4a20 })); l.position.set(.48, -.2, 0); g.add(l); const cap = new THREE.Mesh(new THREE.ConeGeometry(.16, .14, 6), m); cap.position.set(.48, -.02, 0); g.add(cap); return g; }
function wires(x0, x1, z0, z1, y) { const g = new THREE.Group(), m = sm(0x111111, .6); for (let i = 0; i < 3; i++) { const a = new V3(x0, y - i * .3, z0), b = new V3(x1, y - i * .25, z1), d = a.distanceTo(b); const c = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, d, 4), m); c.position.copy(a).lerp(b, .5); c.lookAt(b); c.rotateX(Math.PI / 2); g.add(c); } return g; }
function bench(col = 0x6b4a2e) { const g = new THREE.Group(); const s = box(1.6, .06, .4, sm(col)); s.position.y = .45; g.add(s); const bk = box(1.6, .4, .05, sm(col)); bk.position.set(0, .7, -.18); g.add(bk); for (const x of [-.7, .7]) { const l = box(.06, .45, .4, sm(0x333333, .5, .5)); l.position.set(x, .22, 0); g.add(l); } return g; }
function plasticTable() { const g = new THREE.Group(), r = sm(0xc4161c, .6); const t = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .04, 16), sm(0xf0f0f0, .5)); t.position.y = .72; g.add(t); const l = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .72, 6), sm(0x999999)); l.position.y = .36; g.add(l);
  for (const a of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) { const c = new THREE.Group(); const s = box(.45, .05, .45, r); s.position.y = .45; c.add(s); const b = box(.45, .5, .05, r); b.position.set(0, .7, -.22); c.add(b); for (const [x, z] of [[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]]) { const lg = box(.04, .45, .04, r); lg.position.set(x, .22, z); c.add(lg); } c.position.set(Math.sin(a) * .75, 0, Math.cos(a) * .75); c.rotation.y = a + Math.PI; g.add(c); } return g; }
function ibc() { const g = new THREE.Group(); const t = box(1.1, 1.1, 1.1, sm(0xf2f2f0, .4, 0, { transparent: true, opacity: .92 })); t.position.y = .65; g.add(t); const m = sm(0x777777, .5, .7); for (let i = -2; i <= 2; i++) { for (const [w, d, x, z] of [[1.16, .03, 0, .56], [1.16, .03, 0, -.56]]) { const b = box(.03, 1.16, .03, m); b.position.set(i * .27, .65, z); g.add(b); } const h = box(1.16, .03, 1.16, m); h.position.y = .1 + (i + 2) * .27; g.add(h); } const p = box(1.2, .1, 1.2, sm(0x444444)); p.position.y = .05; g.add(p); return g; }
function oleander(col) { const g = shrub(1.1, '#3f5a2c'); const fm = sm(col, .7); for (let i = 0; i < 40; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.07, 5, 4), fm); f.position.set(rand(-1.1, 1.1), rand(.5, 1.6), rand(-1.1, 1.1)); g.add(f); } return g; }
function binSet() { const g = new THREE.Group(); [0x3a6b3a, 0x2a4f8a, 0x8a8a8a, 0xd8b41a].forEach((c, i) => { const b = box(.7, 1.1, .7, sm(c, .6)); b.position.set(i * .8, .55, 0); g.add(b); const l = box(.74, .06, .74, sm(c, .6)); l.position.set(i * .8, 1.13, 0); g.add(l); }); return g; }
function graffitiWall(len) { const t = canvasTex(1024, 256, (c, w, h) => { noiseFill(c, w, h, '#cfc6b2', .08, 8000, 2); const cols = ['#e6332a', '#2d74da', '#1a1a1a', '#f2a51a', '#7a3fb8', '#20a07a']; for (let i = 0; i < 18; i++) { c.strokeStyle = pick(cols); c.lineWidth = rand(4, 12); c.lineCap = 'round'; c.beginPath(); let x = rand(0, w), y = rand(60, h - 40); c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rand(-60, 60); y += rand(-40, 40); c.quadraticCurveTo(x + rand(-30, 30), y + rand(-30, 30), x, y); } c.stroke(); } c.font = 'bold 80px Arial Black, Arial'; c.fillStyle = '#e6332a'; c.globalAlpha = .8; c.fillText('KASS', 300, 170); c.globalAlpha = 1; });
  return box(len, 2.4, .25, [sm(0xcfc6b2), sm(0xcfc6b2), sm(0xcfc6b2), sm(0xcfc6b2), new THREE.MeshStandardMaterial({ map: t, roughness: .9 }), sm(0xcfc6b2)]); }
function noParking() { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 2.4, 6), sm(0x8e9296, .5, .6)); p.position.y = 1.2; g.add(p); const t = canvasTex(128, 128, (c) => { c.fillStyle = '#c4161c'; c.beginPath(); c.arc(64, 64, 62, 0, TAU); c.fill(); c.fillStyle = '#1f4fbf'; c.beginPath(); c.arc(64, 64, 46, 0, TAU); c.fill(); c.strokeStyle = '#c4161c'; c.lineWidth = 14; c.beginPath(); c.moveTo(28, 28); c.lineTo(100, 100); c.stroke(); }); const s = new THREE.Mesh(new THREE.CircleGeometry(.3, 24), new THREE.MeshStandardMaterial({ map: t })); s.position.set(0, 2.2, .035); g.add(s); return g; }
function gate(len, col = 0x2f5a3a, diamond = false) { const g = ironFence(len, 1.6, diamond); g.traverse(o => { if (o.isMesh) o.material = sm(col, .5, .4); }); return g; }
function archBuilding(w, h) { const g = new THREE.Group(), c = sm(0xb9b5ac, .95); const b = box(w, h, 14, c); b.position.y = h / 2; g.add(b); for (let x = -w / 2 + 2; x < w / 2 - 1; x += 3.2) { const a = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .5, 16, 1, false, 0, Math.PI), sm(0x5a5a55)); a.rotation.set(Math.PI / 2, 0, 0); a.position.set(x, h * .35, 7.05); g.add(a); const pil = box(.5, h * .35, .6, c); pil.position.set(x + 1.6, h * .175, 7.2); g.add(pil); } return g; }
function busStop() { const g = new THREE.Group(), m = sm(0x6a6f75, .4, .6); for (const x of [-1.2, 1.2]) { const p = box(.08, 2.4, .08, m); p.position.set(x, 1.2, -.6); g.add(p); } const r = box(2.8, .08, 1.4, m); r.position.set(0, 2.42, -.1); g.add(r); const gl = box(2.6, 1.8, .03, sm(0xbfd6e0, .05, .2, { transparent: true, opacity: .35 })); gl.position.set(0, 1.3, -.62); g.add(gl); const b = bench(0x777777); b.position.z = -.3; g.add(b); return g; }
function rails(len, z) { const m = sm(0x9aa0a6, .3, .9); for (const dz of [-.72, .72]) { const r = box(len, .06, .08, m); r.position.set(0, .03, z + dz); addA(r, 0, 0, 0, 0, 'recv'); } }
function poleWires(len, z) { const m = sm(0x111111, .6), pm = sm(0x6d7175, .5, .6); for (let x = -len / 2; x <= len / 2; x += 14) { for (const pz of [-7.6, 7.6]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 7, 8), pm); addA(p, x, 3.5, pz); } const t = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 15.2, 4), m); t.rotation.x = Math.PI / 2; addA(t, x, 6.7, 0); } for (const dz of [-.7, .7]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, len, 4), m); c.rotation.z = Math.PI / 2; c.position.set(0, 6.6, z + dz); addA(c); } }
function moving(obj, path) { obj.userData.keep = true; obj.userData.path = path; ARENA.group.add(obj); ARENA.movers.push(obj); return obj; }

Object.assign(ARENAS, {
  porto: { name: 'Porto Sa Ruxi', music: 1, bounds: [7.5, 3.6], cam: [16, 6], sky: ['#2f78cf', '#8fc0ea', '#c9dbe8'], fog: 0xaecbe2, sunPos: [6, 18, 7], sunI: 1.6, hemiI: .6, noSign: true,
    build() {
      const sea = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ color: 0x1f8fb0, roughness: .08, metalness: .3, transparent: true, opacity: .93 })); sea.rotation.x = -Math.PI / 2; sea.userData.keep = true; ARENA.group.add(sea); sea.position.y = -.35; ARENA.sea = sea;
      const shallow = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ color: 0x5fd3cf, roughness: .1, transparent: true, opacity: .55 })); shallow.rotation.x = -Math.PI / 2; addA(shallow, 0, -.3, 12, 0, null);
      const rock = new THREE.Mesh(new THREE.CylinderGeometry(11, 13, .7, 40, 1), new THREE.MeshStandardMaterial({ map: texRock(), roughness: .95, color: 0x857c74 })); rock.scale.z = .62; addA(rock, 0, -.35, -1, 0, 'recv');
      const land = new THREE.Mesh(new THREE.PlaneGeometry(200, 80), new THREE.MeshStandardMaterial({ map: texRock(), roughness: 1, color: 0x9a9088 })); land.rotation.x = -Math.PI / 2; addA(land, 0, -.02, -48, 0, 'recv');
      for (const [x, z, r] of [[-9, -6, 2.4], [8, -5.5, 2], [-12, 1, 1.8], [11, 2, 2.2], [-6, 8, 1.3], [5, 9, 1.6], [14, -2, 3], [-15, -3, 2.6], [2, -9, 2.8], [20, 7, 1.8], [-20, 8, 2.2]]) addA(boulder(r), x, r * .2 - .4, z, rand(0, 3));
      for (let i = 0; i < 26; i++) addA(shrub(rand(.6, 1.2)), rand(-30, 30), 0, rand(-26, -9));
      const beach = new THREE.Mesh(new THREE.PlaneGeometry(70, 14), new THREE.MeshStandardMaterial({ map: texSand(), roughness: 1 })); beach.rotation.x = -Math.PI / 2; addA(beach, 55, -.25, 20, -.5, 'recv');
      for (let i = 0; i < 12; i++) addA(umbrellaBeach(pick([0x2a6fd6, 0xf4f4f4, 0x3c8f4a, 0xe24a3a])), 40 + i * 3.5 + rand(-1, 1), -.25, 14 + rand(-2, 4) + i * .8);
      ARENA.group.add(mountains(0x9c8f86, 120, 30, 3)); ARENA.group.add(cloudLayer(8));
    } },
  maracalagonis: { name: 'Maracalagonis', music: 0, bounds: [8.5, 3.6], cam: [24, 6.6], sky: ['#4f8ee0', '#a8cbee', '#e4d9c2'], fog: 0xd4dde4, sunPos: [-6, 16, 8],
    build() {
      addA(ground(texGrassDry()), 0, -.02, 0, 0, 'recv'); addA(road(120, 9, 'dashed'), 0, 0, 0, 0, 'recv'); sidewalks(120, 4.5);
      for (let x = -40; x <= 40; x += 12) { addA(lamp(9), x, .15, -7.4, Math.PI / 2); addA(lamp(9), x + 6, .15, 7.4, -Math.PI / 2); }
      const vc = ['#f1ece2', '#e9dcc6', '#f3e7cf', '#ece4d4'];
      for (let i = 0; i < 6; i++) { const x = -34 + i * 13; addA(building(10, 6.5, 9, facade({ cols: 4, rows: 2, wall: vc[i % 4], shutter: '#8a6a45', frame: '#ffffff', balcony: (r, c) => c === 1 }), 'tile', 0xa64a2a), x, 0, -13); const gt = gate(11, 0xf2f2f0, true); addA(gt, x, .15, -7.6); }
      addA(busStop(), 9, .15, -7.9, 0);
      for (const [x, z] of [[-14, -9.5], [16, -10]]) addA(pineUmbrella(rand(8, 10)), x, 0, z);
      for (let i = 0; i < 10; i++) addA(shrub(rand(.4, .7), '#9c8a4a'), rand(-40, 40), 0, rand(8, 20));
      addA(tree({ h: 5, r: 2 }), -25, 0, 14); addA(tree({ h: 4.5, r: 1.8 }), 28, 0, 16);
      addSigns('Maracalagonis', 6.6, 2.4); ARENA.group.add(mountains(0x7f8ca3, 150, 38, 2.4)); ARENA.group.add(cloudLayer(6));
    } },
  musicisti: { name: 'Zona musicisti', music: 1, bounds: [8.5, 3.0], cam: [24, 6.6], sky: ['#4886d6', '#9dc4ec', '#e7e3da'], fog: 0xd2dfea, sunPos: [7, 16, 6],
    build() {
      addA(ground(texGrassDry()), 0, -.02, 0, 0, 'recv'); addA(road(120, 12, 'double'), 0, 0, 0, 0, 'recv'); sidewalks(120, 6);
      carsAlong(-4.9, 0); carsAlong(4.9, Math.PI);
      for (let x = -42; x <= 42; x += 12) { addA(lamp(9), x, .15, -7.6, Math.PI / 2); addA(palm(rand(7, 9)), x + 6, .15, 7.8); }
      for (let i = 0; i < 3; i++) addA(building(16, 18, 12, facade({ cols: 6, rows: 6, wall: pick(['#e3d3b8', '#d9c4a4', '#eadcc4']), band: '#f2e6d2', roller: '#cbbd9f', balcony: true, rail: '#555' }), 'flat'), -40 + i * 18, 0, -16);
      addA(archBuilding(26, 10), 22, 0, -17); addA(gate(26, 0x55595e), 22, .15, -9.2);
      for (let i = 0; i < 5; i++) { const x = -36 + i * 16; addA(building(10, 6, 9, facade({ cols: 4, rows: 2, wall: i % 2 ? '#f4d6d8' : '#f6f4ef', shutter: '#7d5b3c', frame: '#ffffff', balcony: (r, c) => c % 2 === 0 }), 'tile', 0xa64a2a), x, 0, 15, Math.PI);
        const wall = box(12, 1.1, .35, new THREE.MeshStandardMaterial({ map: texCobble(), roughness: .95 })); addA(wall, x, .55, 9.2); }
      addSigns('Zona musicisti', 7.6, 2.6); ARENA.group.add(mountains(0x8a97ad, 170, 26, 1.1)); ARENA.group.add(cloudLayer(16));
    } },
  padova: { name: 'Padova', music: 0, bounds: [8.5, 3.0], cam: [22, 6.6], sky: ['#6d98cf', '#b6cde6', '#e6e1d6'], fog: 0xd6dee6, sunPos: [5, 15, 8],
    build() {
      addA(ground(texPaving('#b9b3a8')), 0, -.02, 0, 0, 'recv'); addA(road(120, 12), 0, 0, 0, 0, 'recv'); sidewalks(120, 6, 2.8, '#c9c2b4');
      rails(120, -3.4); poleWires(120, -3.4);
      for (let i = 0; i < 6; i++) addA(building(12, 15, 10, facade({ cols: 5, rows: 4, wall: pick(['#e8c26a', '#e2b75a', '#efcf7d']), shutter: '#3f6b43', frame: '#f1e6c8', balcony: (r, c) => r === 1 && c % 2 === 0, rail: '#2b2b2b', band: '#f3e7c9' }), 'tile', 0x9e4b2e), -36 + i * 13, 0, -14.5);
      for (let i = 0; i < 5; i++) addA(building(14, 16, 10, facade({ cols: 5, rows: 4, wall: pick(['#d9cbb0', '#e3d6bd', '#cdb99a']), shutter: '#5a4a35', frame: '#efe6d2', balcony: (r, c) => r > 0 && c % 2 === 1, band: '#efe6d2', ground: 90, groundCol: '#9d917c' }), 'flat', 0xb3a68f), -32 + i * 15, 0, 16, Math.PI);
      for (let i = 0; i < 10; i++) addA(person(pick([0x2b3a5c, 0x6b2a2a, 0x2a2a2a, 0x4f6b3a, 0xb3a07a])), rand(-30, 30), .15, pick([-8.2, 8.4]) + rand(-.3, .3), rand(0, 6));
      const wall = box(60, 3, 1.2, new THREE.MeshStandardMaterial({ map: texCobble('#9a8f80'), roughness: .95, color: 0xb9a68a })); addA(wall, 40, 1.5, 12);
      for (let i = 0; i < 6; i++) addA(cypress(rand(8, 11)), 20 + i * 5, 0, 15); addA(pineUmbrella(9), 50, 0, 18);
      const sky = box(14, 70, 14, sm(0x9fb4c8, .3, .4)); addA(sky, -70, 0, -90).position.y = 35;
      const b = bus(); moving(b, { from: new V3(-90, 0, -8.2), to: new V3(90, 0, -8.2), speed: 7, ry: 0 });
      addSigns('Padova', 7.8, 2.6); ARENA.group.add(cloudLayer(10));
    } },
  banari: { name: 'Banari', music: 0, bounds: [7.5, 3.2], cam: [16, 6.2], sky: ['#4b8bd9', '#a3c9ef', '#e4ddd0'], fog: 0xd3dde6, sunPos: [6, 16, -6],
    build() {
      addA(ground(texCobble()), 0, -.01, 0, 0, 'recv');
      const cols = ['#f3efe6', '#ecd27a', '#f6f1e4', '#e6c871'];
      for (let i = 0; i < 6; i++) { const x = -30 + i * 11; addA(building(10, 8, 8, facade({ cols: 4, rows: 2, wall: cols[i % 4], shutter: '#6e4a2a', frame: '#a8452e', ground: 0 }), 'tile', 0xa3512f), x, 0, -11);
        for (const y of [3.4]) { const l = lantern(); addA(l, x - 3, y, -6.9, -Math.PI / 2); } }
      const mun = building(14, 10, 9, facade({ cols: 5, rows: 3, wall: '#efe7d6', shutter: '#6e4a2a', frame: '#a8452e', balcony: (r, c) => r === 2 && c === 2 }), 'flat', 0xd8ccb4); addA(mun, 4, 0, 12.5, Math.PI);
      [FLAG_IT, FLAG_EU, FLAG_SA].forEach((fn, i) => { const f = flag(fn); addA(f, 1.5 + i * 2, 6.5, 7.9, -Math.PI / 2 + Math.PI); f.userData.keep = true; });
      const plaque = box(1.2, .8, .05, sm(0xd9d4c6, .4, .1)); addA(plaque, 7, 3, 7.95);
      for (let i = 0; i < 4; i++) { const x = -26 + i * 9; if (Math.abs(x - 4) < 8) continue; addA(building(9, 7.5, 8, facade({ cols: 3, rows: 2, wall: cols[(i + 1) % 4], shutter: '#6e4a2a', frame: '#a8452e' }), 'tile', 0xa3512f), x, 0, 12, Math.PI); }
      for (const x of [-10, -4, 12]) addA(tree({ h: 5.5, r: 2 }), x, 0, 7);
      addA(bench(), -7, 0, 6.5, Math.PI); addA(bench(), 14, 0, 6.5, Math.PI);
      for (let x = -12; x <= 12; x += 2.4) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .8, 8), sm(0x2a2a2a, .5, .5)); addA(p, x, .4, -6.4); }
      const chain = box(24, .02, .02, sm(0x2a2a2a, .5, .6)); addA(chain, 0, .7, -6.4);
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(.7, .5, .9, 14), sm(0xb0623a, .8)); addA(pot, 10, .45, -7.5); addA(palm(4), 10, .9, -7.5);
      const canopy = new THREE.Group(), wd = sm(0x7a5434, .8); for (const [x, z] of [[-3, -2], [3, -2], [-3, 2], [3, 2]]) { const p = box(.15, 2.6, .15, wd); p.position.set(x, 1.3, z); canopy.add(p); } const roof = box(6.6, .12, 4.6, wd); roof.position.y = 2.6; canopy.add(roof); addA(canopy, -16, 0, 6.5);
      for (const [x, z] of [[-17.5, 5.5], [-14.5, 5.5], [-16, 7.6]]) addA(plasticTable(), x, 0, z, rand(0, 3));
      for (const [x, z] of [[-17.5, 4.7], [-14.5, 4.8], [-16, 6.8]]) { const p = person(pick([0x2b3a5c, 0x6b2a2a, 0x4a4a4a])); p.scale.y = .78; addA(p, x, 0, z); }
      ARENA.group.add(wires(-30, 30, -7, 7, 7)); addSigns('Banari', 6.4, 2.4); ARENA.group.add(mountains(0x8a97ad, 160, 24, 4)); ARENA.group.add(cloudLayer(8));
    } },
  colombo: { name: 'Viale Colombo', music: 1, bounds: [8.5, 3.4], cam: [24, 6.6], sky: ['#4b8ad8', '#a6caee', '#e7e2d8'], fog: 0xd3dfe9, sunPos: [-7, 16, 7],
    build() {
      addA(ground(texPaving('#bdb5a6')), 0, -.02, 0, 0, 'recv'); addA(road(120, 13, 'dashed'), 0, 0, 0, 0, 'recv'); sidewalks(120, 6.5);
      for (let z = -5.5; z <= 5.5; z += 1) { const s = new THREE.Mesh(new THREE.PlaneGeometry(3, .5), sm(0xefece4, .7)); addA(s, 12, .007, z, 0, null); s.rotation.set(-Math.PI / 2, 0, 0); }
      for (let x = -40; x <= 40; x += 5) { for (const [z, c] of [[-5.2, 0xe2c22a], [5.2, 0x2a5fd2]]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(.1, 2.4), sm(c, .7)); l.rotation.x = -Math.PI / 2; addA(l, x, .007, z, 0, null); } }
      carsAlong(-5.2, 0, -40, 6); carsAlong(5.2, Math.PI, -6, 40); const sei = parkedCar(0xf4f4f2); sei.scale.setScalar(.82); addA(sei, 20, 0, -5.2, 0);
      addA(van(0xfdfdfd, 0xf28c28), -18, 0, 5.2, Math.PI); addA(van(0xfdfdfd, 0xf28c28), -24, 0, 5.2, Math.PI);
      for (let i = 0; i < 5; i++) addA(building(16, 22, 12, facade({ cols: 6, rows: 7, wall: '#d4c2a2', brick: '#9b4a32', roller: '#cfc2a6', balcony: true, rail: '#4a4a4a', ground: 100, shops: true, awn: pick(['#6d2f2a', '#2f4f6d', '#3d6d2f']) }), 'flat'), -40 + i * 18, 0, -16);
      for (let i = 0; i < 4; i++) addA(building(16, 20, 12, facade({ cols: 6, rows: 6, wall: '#dccbaa', brick: '#a35238', roller: '#cfc2a6', balcony: true, rail: '#4a4a4a', ground: 100, shops: true, awn: '#7a3a30' }), 'flat'), -30 + i * 18, 0, 17, Math.PI);
      const school = building(20, 8, 10, facade({ cols: 8, rows: 2, wall: '#a65a42', band: '#9a9a96', frame: '#9a9a96' }), 'flat', 0x9a9a96); addA(school, 34, 0, 14, Math.PI); addA(gate(20, 0x2b2b2b), 34, .15, 8.2); addA(bench(0xc0302a), 30, .15, 7.6, Math.PI);
      const jac = texLeaves('#8d6cc9'); for (let x = -36; x <= 36; x += 9) { addA(tree({ h: 5.5, r: 2, tex: jac }), x, .15, -8); addA(tree({ h: 5, r: 1.8, tex: jac }), x + 4.5, .15, 8.2); }
      for (let x = -40; x <= 40; x += 14) addA(lamp(10), x, .15, 7.8, -Math.PI / 2);
      moving(parkedCar(0xc21e1e), { from: new V3(-90, 0, -2.6), to: new V3(90, 0, -2.6), speed: 11, ry: Math.PI / 2 - Math.PI / 2 });
      moving(parkedCar(0x1b1b1b), { from: new V3(95, 0, 2.6), to: new V3(-95, 0, 2.6), speed: 9, ry: Math.PI });
      addSigns('Viale Colombo', 7.6, 2.6); ARENA.group.add(cloudLayer(8));
    } },
  niucrobu: { name: 'Niu Crobu', music: 0, bounds: [8.5, 3.4], cam: [24, 6.6], sky: ['#3f87dc', '#a4cbef', '#dfe3dc'], fog: 0xd0dde8, sunPos: [6, 18, 6],
    build() {
      addA(ground(texGrassDry()), 0, -.02, 0, 0, 'recv');
      const rd = road(120, 8.5); addA(rd, 0, 0, 0, .04, 'recv');
      const wallTex = canvasTex(512, 128, (c, w, h) => noiseFill(c, w, h, '#b8b2a4', .14, 12000, 2), true, [8, 1]);
      for (const z of [-7.8, 7.8]) { const w = box(80, 1.4, .3, new THREE.MeshStandardMaterial({ map: wallTex, roughness: 1 })); addA(w, 0, .7, z); }
      const net = canvasTex(64, 64, (c, w) => { c.clearRect(0, 0, w, w); c.strokeStyle = 'rgba(40,110,60,1)'; c.lineWidth = 3; c.strokeRect(0, 0, w, w); }, true, [80, 1.5]);
      for (const z of [-7.8, 7.8]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(80, 1.2), new THREE.MeshStandardMaterial({ map: net, transparent: true, alphaTest: .3, side: THREE.DoubleSide })); addA(f, 0, 2.0, z, 0, null); }
      addA(ibc(), 6, 1.4, -9);
      for (let i = 0; i < 4; i++) addA(building(10, 6, 9, facade({ cols: 4, rows: 2, wall: '#d9c4a0', shutter: '#6e4a2a', frame: '#efe6d2' }), 'tile', 0xa64a2a), -28 + i * 18, 0, -13);
      for (const [x, z] of [[-6, -8], [14, -8.5], [-18, 9], [3, 9], [20, 8]]) addA(prickly(), x, 0, z, rand(0, 3));
      for (const [x, z] of [[-12, -9], [9, 10], [-24, -8], [26, -9]]) addA(olive(), x, 0, z);
      addA(pineUmbrella(9), -30, 0, 12); addA(cypress(9), 28, 0, 11); addA(cypress(8), 31, 0, 12);
      for (let x = -40; x <= 40; x += 13) addA(lamp(8), x, 0, 7.3, -Math.PI / 2);
      const vm = new THREE.MeshStandardMaterial({ map: texLeaves('#5d7d36'), roughness: .9 });
      for (let r = 0; r < 6; r++) for (let i = 0; i < 18; i++) { const v = new THREE.Mesh(new THREE.IcosahedronGeometry(.6, 0), vm); v.scale.set(1.2, .7, .6); addA(v, -30 + i * 3.4, .4 + r * .9, 16 + r * 3.2, 0, 'recv'); }
      const hill = new THREE.Mesh(new THREE.PlaneGeometry(200, 60), new THREE.MeshStandardMaterial({ map: texGrassDry(), roughness: 1, color: 0xb9c48f })); hill.rotation.x = -Math.PI / 2 + .25; addA(hill, 0, 2, 40, 0, 'recv');
      addSigns('Niu Crobu', 7.3, 2.4); ARENA.group.add(mountains(0x7f8ea8, 150, 32, 5)); ARENA.group.add(cloudLayer(6));
    } },
  pitzeserra: { name: "Pitz'e Serra", music: 1, bounds: [8.5, 3.0], cam: [24, 6.6], sky: ['#4c8ad6', '#a7caee', '#e8e3d9'], fog: 0xd5e0ea, sunPos: [7, 16, 7],
    build() {
      addA(ground(texPaving('#c2baab')), 0, -.02, 0, 0, 'recv'); addA(road(120, 11, 'dashed'), 0, 0, 0, 0, 'recv'); sidewalks(120, 5.5);
      carsAlong(-4.6, 0); carsAlong(4.6, Math.PI);
      for (let i = 0; i < 5; i++) addA(building(16, 24, 12, facade({ cols: 6, rows: 8, wall: '#e2d4b8', brick: '#9c4b34', roller: '#d1c4a8', balcony: (r, c) => c % 2 === 1, rail: '#555' }), 'flat'), -40 + i * 18, 0, -16);
      for (let i = 0; i < 5; i++) addA(building(16, 22, 12, facade({ cols: 6, rows: 7, wall: '#e9dcc2', brick: '#a65238', roller: '#d1c4a8', balcony: (r, c) => c % 2 === 0, rail: '#555' }), 'flat'), -36 + i * 18, 0, 16, Math.PI);
      for (let x = -36; x <= 36; x += 9) { addA(oleander(pick([0xe86aa0, 0xf6f2f6, 0xe86aa0])), x, .15, -8.4); if (Math.random() < .4) addA(palm(7), x + 4, .15, 8.6); }
      for (let x = -40; x <= 40; x += 14) addA(lamp(10), x, .15, -7.6, Math.PI / 2);
      addA(gate(8, 0x2f5a3a), 14, .15, 8.4); addA(binSet(), 8, .15, 8.2, Math.PI); addA(graffitiWall(10), -12, 1.2, 9.5, Math.PI); addA(noParking(), -6, .15, 7.9, Math.PI);
      addSigns("Pitz'e Serra", 7.2, 2.6); ARENA.group.add(cloudLayer(8));
    } },
});
