'use strict';
/* ===== Basi: utilità, renderer, avatar con scheletro e pose a cinematica inversa ===== */
const V3 = THREE.Vector3, QT = THREE.Quaternion;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t), easeOut = t => 1 - (1 - t) * (1 - t), easeIn = t => t * t;
const rand = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
const $ = s => document.querySelector(s);

const IS_TOUCH = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
const QUALITY = { dpr: Math.min(window.devicePixelRatio || 1, IS_TOUCH ? 1.6 : 2), shadow: IS_TOUCH ? 1024 : 2048 };
const R = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
R.setPixelRatio(QUALITY.dpr);
R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
R.domElement.id = 'scene'; document.body.prepend(R.domElement);
const ANISO = Math.min(8, R.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, .1, 600);
function resize() { const w = innerWidth, h = innerHeight; R.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* --- texture --- */
const texLoader = new THREE.TextureLoader();
let TEX_PENDING = 0;
function dtex(url, srgb, rep) { TEX_PENDING++; const t = texLoader.load(url, () => TEX_PENDING--, undefined, () => TEX_PENDING--); if (srgb) t.encoding = THREE.sRGBEncoding; t.anisotropy = ANISO; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; }
function canvasTex(w, h, draw, srgb = true, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.encoding = THREE.sRGBEncoding; t.anisotropy = ANISO;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
const std = (color, rough = .8, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));

/* --- decodifica delle mesh compatte --- */
function b64u8(s) { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
function decodeAvatar(A) {
  const m = A.meta, bin = fflate.unzlibSync(b64u8(A.data)); let o = 0;
  const take = (T, cnt) => { const a = new T(bin.buffer.slice(bin.byteOffset + o, bin.byteOffset + o + cnt * T.BYTES_PER_ELEMENT)); o += cnt * T.BYTES_PER_ELEMENT; return a; };
  const n = m.n, P = take(Uint16Array, n * 3), Nn = take(Int8Array, n * 3), U = take(Uint16Array, n * 2), SI = take(Uint8Array, n * 4), SW = take(Uint8Array, n * 4), I = take(m.i32 ? Uint32Array : Uint16Array, m.idx);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), sw = new Float32Array(n * 4);
  for (let i = 0; i < n * 3; i++) { const k = i % 3; pos[i] = m.min[k] + P[i] / 65535 * (m.max[k] - m.min[k]); nor[i] = Nn[i] / 127; }
  for (let i = 0; i < n * 2; i++) { const k = i % 2; uv[i] = m.umin[k] + U[i] / 65535 * (m.umax[k] - m.umin[k]); }
  for (let i = 0; i < n * 4; i++) sw[i] = SW[i] / 255;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(SI, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4)); g.setIndex(new THREE.BufferAttribute(I, 1));
  m.groups.forEach(([st, c], k) => g.addGroup(st, c, k));
  const bones = m.bones.map(b => { const bn = new THREE.Bone(); bn.name = b[0]; bn.position.set(b[2], b[3], b[4]); bn.quaternion.set(b[5], b[6], b[7], b[8]); return bn; });
  const root = new THREE.Group(); m.bones.forEach((b, i) => (b[1] >= 0 ? bones[b[1]] : root).add(bones[i]));
  return { geometry: g, bones, root, groups: m.groups.map(gr => gr[2]) };
}
const TEXCACHE = {};
function charTextures(id) {
  if (TEXCACHE[id]) return TEXCACHE[id];
  const T = AUS.tex[id];
  return TEXCACHE[id] = { body: dtex(T.body, 1), body_n: dtex(T.body_n), head: dtex(T.head, 1), head_n: dtex(T.head_n), hair: dtex(T.hair, 1), hair_a: dtex(T.hair_a) };
}

/* --- scheletro: nomi delle ossa --- */
const BN = { root: 'Bip01', pelvis: 'Bip01_Pelvis', spine: 'Bip01_Spine', spine1: 'Bip01_Spine1', spine2: 'Bip01_Spine2', neck: 'Bip01_Neck', head: 'Bip01_Head', jaw: 'Bip01_MJaw',
  lCla: 'Bip01_L_Clavicle', rCla: 'Bip01_R_Clavicle', lUp: 'Bip01_L_UpperArm', rUp: 'Bip01_R_UpperArm', lFo: 'Bip01_L_Forearm', rFo: 'Bip01_R_Forearm', lHa: 'Bip01_L_Hand', rHa: 'Bip01_R_Hand',
  lTh: 'Bip01_L_Thigh', rTh: 'Bip01_R_Thigh', lCa: 'Bip01_L_Calf', rCa: 'Bip01_R_Calf', lFt: 'Bip01_L_Foot', rFt: 'Bip01_R_Foot', lToe: 'Bip01_L_Toe0', rToe: 'Bip01_R_Toe0',
  lBlinkT: 'Bip01_LEyeBlinkTop', rBlinkT: 'Bip01_REyeBlinkTop', lBlinkB: 'Bip01_LEyeBlinkBottom', rBlinkB: 'Bip01_REyeBlinkBottom' };
const FINGERS = ['0', '1', '2', '3', '4'];

/* temporanei */
const _a = new V3(), _b = new V3(), _c = new V3(), _d = new V3(), _e = new V3(), _t = new V3(), _p = new V3(), _q1 = new QT(), _q2 = new QT(), _q3 = new QT(), _m4 = new THREE.Matrix4();
function applyWorldRot(bone, q) { bone.parent.getWorldQuaternion(_q1); _q2.copy(_q1).invert().multiply(q).multiply(_q1); bone.quaternion.premultiply(_q2); bone.updateMatrixWorld(true); }
function rotWorld(bone, axis, ang) { if (!ang || !bone) return; _q3.setFromAxisAngle(axis, ang); applyWorldRot(bone, _q3); }
function aimBone(bone, child, targetPos, w = 1) {     // ruota l'osso perché il figlio punti verso targetPos
  bone.getWorldPosition(_a); child.getWorldPosition(_b);
  _d.subVectors(_b, _a).normalize(); _e.subVectors(targetPos, _a); if (_e.lengthSq() < 1e-8) return; _e.normalize();
  _q3.setFromUnitVectors(_d, _e); if (w < 1) _q3.slerp(new QT(), 1 - w);
  applyWorldRot(bone, _q3);
}

/* Avatar: oggetto 3D + scheletro + funzione che applica una posa */
class Avatar {
  constructor(charId, meshId) {
    const U = decodeAvatar(AUS.mesh[meshId]), T = charTextures(charId);
    const mats = U.groups.map(gn => gn === 'body' ? new THREE.MeshStandardMaterial({ map: T.body, normalMap: T.body_n, roughness: .82, skinning: true })
      : gn === 'head' ? new THREE.MeshStandardMaterial({ map: T.head, normalMap: T.head_n, normalScale: new THREE.Vector2(.8, .8), roughness: .55, skinning: true })
      : new THREE.MeshStandardMaterial({ map: T.hair, alphaMap: T.hair_a, alphaTest: .45, roughness: .7, skinning: true, side: THREE.DoubleSide }));
    mats.forEach(m => { m.userData.orig = m.color.clone(); m.userData.emi = m.emissive.clone(); });
    const mesh = new THREE.SkinnedMesh(U.geometry, mats); mesh.frustumCulled = false; mesh.castShadow = true;
    this.obj = new THREE.Group(); this.tilt = new THREE.Group(); this.obj.add(this.tilt);
    U.root.scale.setScalar(.01); this.tilt.add(U.root); U.root.add(mesh);
    this.obj.updateMatrixWorld(true); mesh.bind(new THREE.Skeleton(U.bones));
    this.mesh = mesh; this.mats = mats; this.bones = U.bones;
    const byName = {}; U.bones.forEach(b => byName[b.name] = b);
    this.B = {}; for (const k in BN) this.B[k] = byName[BN[k]] || null;
    this.B.hip = this.B.root || this.B.pelvis;
    this.fing = { l: [], r: [] };
    for (const s of ['L', 'R']) for (const f of FINGERS) { const ch = [byName['Bip01_' + s + '_Finger' + f], byName['Bip01_' + s + '_Finger' + f + '1'], byName['Bip01_' + s + '_Finger' + f + '2']].filter(Boolean); this.fing[s.toLowerCase()].push(ch); }
    this.rest = U.bones.map(b => b.quaternion.clone()); this.restHipPos = this.B.hip.position.clone();
    const lp = b => this.obj.worldToLocal(b.getWorldPosition(new V3()));
    this.hipY = lp(this.B.hip).y;
    // assi di piegamento a riposo (spazio locale dell'osso): gomito in avanti, ginocchio all'indietro
    this.hinge = {};
    for (const [up, lo, end, natural] of [['lUp', 'lFo', 'lHa', new V3(0, 0, 1)], ['rUp', 'rFo', 'rHa', new V3(0, 0, 1)], ['lTh', 'lCa', 'lFt', new V3(0, 0, -1)], ['rTh', 'rCa', 'rFt', new V3(0, 0, -1)]]) {
      const a = this.B[up].getWorldPosition(new V3()), b = this.B[lo].getWorldPosition(new V3());
      const u = b.clone().sub(a).normalize(), h = new V3().crossVectors(u, natural).normalize();
      const wq = this.B[up].getWorldQuaternion(new QT());
      this.hinge[up] = h.applyQuaternion(wq.invert());
    }
    // assi della mano nello spazio locale dell'osso: avanti (polso -> dito medio) e lato (mignolo -> indice)
    this.handAx = {};
    for (const sd of ['l', 'r']) {
      const H = this.B[sd + 'Ha'], f2 = this.fing[sd][2][0], f1 = this.fing[sd][1][0], f4 = this.fing[sd][4][0];
      if (!H || !f2 || !f1 || !f4) continue;
      const iq = H.getWorldQuaternion(new QT()).invert(), hp = H.getWorldPosition(new V3());
      const fw = f2.getWorldPosition(new V3()).sub(hp).normalize(), sdv = f1.getWorldPosition(new V3()).sub(f4.getWorldPosition(new V3())).normalize();
      this.handAx[sd] = { f: fw.applyQuaternion(iq), s: sdv.applyQuaternion(iq) };
    }
    this.blink = 0; this.nextBlink = rand(1, 4);
    this.flash = 0;
  }
  dispose() { this.mesh.geometry.dispose(); this.mats.forEach(m => m.dispose()); }
  setTint(col, amt) { for (const m of this.mats) { m.emissive.copy(m.userData.emi).lerp(col, amt); } }
  // posizione locale (r=destra del personaggio, y su, f avanti) -> mondo
  L(v, out) { return this.tilt.localToWorld(out.set(-v[0], v[1], v[2])); }
  Ldir(v, out) { out.set(-v[0], v[1], v[2]).transformDirection(this.tilt.matrixWorld); return out; }
  ik(up, lo, end, target, pole) {
    const A = this.B[up], Bo = this.B[lo], E = this.B[end];
    const a = A.getWorldPosition(new V3()), b = Bo.getWorldPosition(new V3()), c = E.getWorldPosition(new V3());
    const l1 = a.distanceTo(b), l2 = b.distanceTo(c);
    const dir = target.clone().sub(a); let d = dir.length(); dir.normalize();
    d = clamp(d, Math.abs(l1 - l2) + 1e-3, (l1 + l2) * .999);
    const cosA = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
    const pp = pole.clone().addScaledVector(dir, -pole.dot(dir)); if (pp.lengthSq() < 1e-6) pp.set(0, -1, 0); pp.normalize();
    const elbow = a.clone().addScaledVector(dir, l1 * cosA).addScaledVector(pp, l1 * sinA);
    const tgt = a.clone().addScaledVector(dir, d);
    aimBone(A, Bo, elbow);
    // torsione: allinea l'asse di piegamento al piano braccio/avambraccio
    const u = elbow.clone().sub(a).normalize(), f = tgt.clone().sub(elbow).normalize();
    const want = new V3().crossVectors(u, f); if (want.lengthSq() > 1e-5) {
      want.normalize(); const cur = this.hinge[up].clone().applyQuaternion(A.getWorldQuaternion(new QT()));
      cur.addScaledVector(u, -cur.dot(u)).normalize(); const ang = Math.atan2(new V3().crossVectors(cur, want).dot(u), cur.dot(want));
      rotWorld(A, u, ang);
    }
    aimBone(Bo, E, tgt);
  }
  /* P: posa (vedi POSE in fight.js) */
  apply(P) {
    const B = this.B, o = this.obj;
    this.bones.forEach((b, i) => b.quaternion.copy(this.rest[i])); B.hip.position.copy(this.restHipPos);
    this.tilt.position.set(-(P.bx || 0), P.by || 0, P.bz || 0); this.tilt.rotation.set(P.brx || 0, -(P.bry || 0), -(P.brz || 0), 'YXZ');
    o.updateMatrixWorld(true);
    const F = this.Ldir([0, 0, 1], new V3()), U = this.Ldir([0, 1, 0], new V3()), Rr = this.Ldir([1, 0, 0], new V3());
    // bacino: spostamento e rotazioni
    const hip = P.hip || [0, 0, 0];
    const want = this.L([hip[0], this.hipY + hip[1], hip[2]], new V3());
    const cur = B.hip.getWorldPosition(new V3());
    B.hip.parent.updateMatrixWorld(true);
    const lpos = B.hip.parent.worldToLocal(want.clone()), lcur = B.hip.parent.worldToLocal(cur.clone());
    B.hip.position.add(lpos.sub(lcur)); B.hip.updateMatrixWorld(true);
    rotWorld(B.hip, U, -(P.yaw || 0)); rotWorld(B.hip, Rr, -(P.pitch || 0)); rotWorld(B.hip, F, -(P.roll || 0));
    // busto (distribuito sulle vertebre)
    const cy = -(P.cy || 0) / 3, cp = -(P.cp || 0) / 3, cr = -(P.cr || 0) / 3;
    for (const s of [B.spine, B.spine1, B.spine2]) { if (!s) continue; rotWorld(s, U, cy); rotWorld(s, Rr, cp); rotWorld(s, F, cr); }
    rotWorld(B.neck, U, -(P.hy || 0) * .4); rotWorld(B.neck, Rr, -(P.hp || 0) * .4);
    rotWorld(B.head, U, -(P.hy || 0) * .6); rotWorld(B.head, Rr, -(P.hp || 0) * .6); rotWorld(B.head, F, -(P.hr || 0));
    // clavicole (spalle in avanti nei pugni)
    if (P.lsh) rotWorld(B.lCla, U, -P.lsh); if (P.rsh) rotWorld(B.rCla, U, P.rsh);
    // braccia
    this.ik('lUp', 'lFo', 'lHa', this.L(P.lh, new V3()), this.Ldir(P.le || [-.3, -.6, -.4], new V3()));
    this.ik('rUp', 'rFo', 'rHa', this.L(P.rh, new V3()), this.Ldir(P.re || [.3, -.6, -.4], new V3()));
    // mani: chiudi a pugno
    const fist = P.fist == null ? 1 : P.fist;
    for (const s of ['l', 'r']) {
      const H = B[s + 'Ha']; if (!H) continue;
      const ho = P[s + 'ho'];
      if (ho && this.handAx[s]) this.orientHand(s, ho);
      else if (P[s + 'hd']) { const tgt = H.getWorldPosition(new V3()).add(this.Ldir(P[s + 'hd'], new V3()).multiplyScalar(.1)); aimBone(H, this.fing[s][2][0] || H.children[0], tgt, 1); }
      const ax = this.fing[s][1][0] && this.fing[s][4][0] ? this.fing[s][4][0].getWorldPosition(new V3()).sub(this.fing[s][1][0].getWorldPosition(new V3())).normalize() : Rr;
      const sg = s === 'l' ? -1 : 1;
      for (let f = 1; f < 5; f++) for (const bn of this.fing[s][f]) rotWorld(bn, ax, sg * fist * 1.35);
      const th = this.fing[s][0]; if (th[0]) rotWorld(th[0], ax, sg * fist * .5); if (th[1]) rotWorld(th[1], ax, sg * fist * .7);
    }
    // gambe
    this.ik('lTh', 'lCa', 'lFt', this.L(P.lf, new V3()), this.Ldir(P.lk || [-.1, 0, 1], new V3()));
    this.ik('rTh', 'rCa', 'rFt', this.L(P.rf, new V3()), this.Ldir(P.rk || [.1, 0, 1], new V3()));
    // piedi: appoggiati (o puntati nei calci)
    for (const s of ['l', 'r']) {
      const Ft = B[s + 'Ft'], Toe = B[s + 'Toe']; if (!Ft || !Toe) continue;
      const fd = P[s + 'fd'] || [s === 'l' ? -.15 : .15, -.05, 1];
      aimBone(Ft, Toe, Ft.getWorldPosition(new V3()).add(this.Ldir(fd, new V3())));
    }
    // mascella e palpebre
    if (B.jaw && P.jaw) rotWorld(B.jaw, Rr, -P.jaw * .35);
    if (this.blink > 0) { const k = Math.sin(this.blink * Math.PI) * .9; for (const b of [B.lBlinkT, B.rBlinkT]) if (b) rotWorld(b, Rr, -k * .5); }
  }
  // orienta la mano: ho = [direzione delle dita r,y,f,  lato mignolo->indice r,y,f]
  orientHand(sd, ho) {
    const H = this.B[sd + 'Ha'], ax = this.handAx[sd], q = H.getWorldQuaternion(new QT());
    let df, ds;
    if (ho.length === 3) { df = H.getWorldPosition(new V3()).sub(this.B[sd + 'Fo'].getWorldPosition(new V3())).normalize(); ds = this.Ldir(ho, new V3()); }
    else { df = this.Ldir([ho[0], ho[1], ho[2]], new V3()).normalize(); ds = this.Ldir([ho[3], ho[4], ho[5]], new V3()); }
    ds.addScaledVector(df, -ds.dot(df)); if (ds.lengthSq() < 1e-6) return; ds.normalize();
    const cf = ax.f.clone().applyQuaternion(q), q1 = new QT().setFromUnitVectors(cf, df);
    const cs = ax.s.clone().applyQuaternion(q).applyQuaternion(q1); cs.addScaledVector(df, -cs.dot(df)).normalize();
    const ang = Math.atan2(new V3().crossVectors(cs, ds).dot(df), cs.dot(ds));
    const q2 = new QT().setFromAxisAngle(df, ang).multiply(q1);
    // limita la piega del polso rispetto all'avambraccio per evitare pose innaturali
    applyWorldRot(H, q2);
  }
  tickFace(dt) { this.nextBlink -= dt; if (this.nextBlink < 0) { this.blink = .001; this.nextBlink = rand(2, 5); } if (this.blink > 0) { this.blink += dt / .16; if (this.blink >= 1) this.blink = 0; } }
}

/* --- pose: interpolazione --- */
function clonePose(p) { const o = {}; for (const k in p) o[k] = Array.isArray(p[k]) ? p[k].slice() : p[k]; return o; }
function mixPose(a, b, t, out = {}) {
  for (const k in a) {
    const x = a[k], y = b[k] === undefined ? x : b[k];
    if (Array.isArray(x)) { const r = out[k] && out[k].length === x.length ? out[k] : new Array(x.length); for (let i = 0; i < x.length; i++) r[i] = x[i] + (y[i] - x[i]) * t; out[k] = r; }
    else if (typeof x === 'number') out[k] = x + ((typeof y === 'number' ? y : x) - x) * t;
    else out[k] = t < .5 ? x : y;
  }
  for (const k in b) if (a[k] === undefined) out[k] = Array.isArray(b[k]) ? b[k].slice() : b[k];
  return out;
}
// sequenza di chiavi: [{f: frame, ...parziale}] -> funzione(frame) -> posa completa
function track(base, keys) {
  const full = []; let prev = clonePose(base);
  for (const k of keys) { const p = Object.assign(clonePose(prev), k); delete p.f; delete p.e; full.push({ f: k.f, e: k.e, p }); prev = p; }
  return (fr, out) => {
    if (fr <= full[0].f) return mixPose(full[0].p, full[0].p, 0, out);
    for (let i = 0; i < full.length - 1; i++) {
      const A = full[i], Bk = full[i + 1];
      if (fr <= Bk.f) { let t = (fr - A.f) / Math.max(1e-6, Bk.f - A.f); const e = Bk.e || 's'; t = e === 'l' ? t : e === 'o' ? easeOut(t) : e === 'i' ? easeIn(t) : smooth(t); return mixPose(A.p, Bk.p, t, out); }
    }
    return mixPose(full[full.length - 1].p, full[full.length - 1].p, 0, out);
  };
}
