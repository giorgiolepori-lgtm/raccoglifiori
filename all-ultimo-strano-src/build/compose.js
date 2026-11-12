// Estrae e compone avatar Rocketbox (testa+capelli da un modello, corpo da un altro) in un formato compatto.
async function loadFBX(path) {
  const buf = await (await fetch('rb/' + path + '.fbx')).arrayBuffer();
  const mgr = new THREE.LoadingManager(); mgr.setURLModifier(() => 'data:image/gif;base64,R0lGODlhAQABAAAAACw=');
  const model = new THREE.FBXLoader(mgr).parse(buf, '');
  let mesh = null; model.traverse(c => { if (c.isSkinnedMesh && !mesh) mesh = c; });
  model.updateMatrixWorld(true);
  return { model, mesh };
}
// vertici nello spazio del modello (cm), skin per nome osso
function extract(A) {
  const { mesh } = A, g = mesh.geometry, sk = mesh.skeleton;
  const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
  const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(m => /_head$/.test(m.name) ? 'head' : /_body$/.test(m.name) ? 'body' : 'hair');
  const bm = sk.bones.map((b, k) => new THREE.Matrix4().multiplyMatrices(b.matrixWorld, sk.boneInverses[k]).multiply(mesh.bindMatrix));
  const M = new THREE.Matrix4(), N3 = new THREE.Matrix3(), v = new THREE.Vector3(), n = new THREE.Vector3();
  const comp = (a, i, k) => [a.getX(i), a.getY(i), a.getZ(i), a.getW(i)][k];
  const V = [];
  for (let i = 0; i < pos.count; i++) {
    M.elements.fill(0); const sk4 = [];
    for (let k = 0; k < 4; k++) { const w = comp(sw, i, k); if (!w) continue; const bi = comp(si, i, k); sk4.push([sk.bones[bi].name, w]); const e = bm[bi].elements; for (let q = 0; q < 16; q++) M.elements[q] += e[q] * w; }
    v.fromBufferAttribute(pos, i).applyMatrix4(M); n.fromBufferAttribute(nor, i).applyNormalMatrix(N3.getNormalMatrix(M)).normalize();
    V.push({ p: [v.x, v.y, v.z], n: [n.x, n.y, n.z], uv: [uv.getX(i), uv.getY(i)], sk: sk4 });
  }
  const tris = [];   // [vertex index a,b,c, material name]
  for (const gr of g.groups) for (let i = gr.start; i < gr.start + gr.count; i += 3) tris.push([i, i + 1, i + 2, mats[gr.materialIndex]]);
  // ossa: matrice mondo a riposo
  const bones = sk.bones.map(b => ({ name: b.name, parentName: b.parent && b.parent.isBone ? b.parent.name : null, world: b.matrixWorld.clone() }));
  return { V, tris, bones };
}
function bonePos(E, name) { const b = E.bones.find(b => b.name === name); return new THREE.Vector3().setFromMatrixPosition(b.world); }
// headFrom: estratto donatore testa; body: estratto corpo. opts.headScale
function compose(body, headFrom, opts = {}) {
  const verts = [], tris = [], key = new Map();
  const add = (E, i, off, sc, piv) => {
    const k = (E === body ? 'b' : 'h') + i; if (key.has(k)) return key.get(k);
    const s = E.V[i]; let p = s.p;
    if (off) p = [ (p[0] - piv.x) * sc + piv.x + off.x, (p[1] - piv.y) * sc + piv.y + off.y, (p[2] - piv.z) * sc + piv.z + off.z ];
    verts.push({ ...s, p }); key.set(k, verts.length - 1); return verts.length - 1;
  };
  const useHead = headFrom && headFrom !== body;
  for (const t of body.tris) if (!useHead || t[3] === 'body') tris.push([add(body, t[0]), add(body, t[1]), add(body, t[2]), t[3]]);
  if (useHead) {
    const hp = bonePos(headFrom, opts.anchor || 'Bip01_Neck'), bp = bonePos(body, opts.anchor || 'Bip01_Neck');
    const off = bp.clone().sub(hp).add(new THREE.Vector3(...(opts.nudge || [0, 0, 0]))), sc = opts.headScale || 1;
    for (const t of headFrom.tris) if (t[3] !== 'body' || opts.keepHeadBody) tris.push([add(headFrom, t[0], off, sc, hp), add(headFrom, t[1], off, sc, hp), add(headFrom, t[2], off, sc, hp), t[3]]);
  }
  return { verts, tris, bones: body.bones };
}
// serializza: dedup vertici, quantizza, raggruppa per materiale
function pack(C) {
  const boneIdx = new Map(C.bones.map((b, i) => [b.name, i]));
  const uniq = new Map(), out = [], remap = new Array(C.verts.length);
  C.verts.forEach((v, i) => {
    const k = v.p.map(x => Math.round(x * 100)).join() + '|' + v.uv.map(x => Math.round(x * 4096)).join() + '|' + v.n.map(x => Math.round(x * 50)).join();
    if (!uniq.has(k)) { uniq.set(k, out.length); out.push(v); } remap[i] = uniq.get(k);
  });
  const order = ['body', 'head', 'hair'], groups = [], idx = [];
  for (const m of order) { const st = idx.length; for (const t of C.tris) if (t[3] === m) idx.push(remap[t[0]], remap[t[1]], remap[t[2]]); if (idx.length > st) groups.push([st, idx.length - st, m]); }
  const n = out.length, min = [1e9, 1e9, 1e9], max = [-1e9, -1e9, -1e9];
  for (const v of out) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], v.p[k]); max[k] = Math.max(max[k], v.p[k]); }
  const P = new Uint16Array(n * 3), Nn = new Int8Array(n * 3), U = new Uint16Array(n * 2), SI = new Uint8Array(n * 4), SW = new Uint8Array(n * 4);
  let umin = [1e9, 1e9], umax = [-1e9, -1e9]; for (const v of out) for (let k = 0; k < 2; k++) { umin[k] = Math.min(umin[k], v.uv[k]); umax[k] = Math.max(umax[k], v.uv[k]); }
  out.forEach((v, i) => {
    for (let k = 0; k < 3; k++) { P[i * 3 + k] = Math.round((v.p[k] - min[k]) / (max[k] - min[k]) * 65535); Nn[i * 3 + k] = Math.round(v.n[k] * 127); }
    for (let k = 0; k < 2; k++) U[i * 2 + k] = Math.round((v.uv[k] - umin[k]) / (umax[k] - umin[k]) * 65535);
    const s = v.sk.slice().sort((a, b) => b[1] - a[1]).slice(0, 4); const tot = s.reduce((a, b) => a + b[1], 0);
    let acc = 0; s.forEach(([nm, w], k) => { SI[i * 4 + k] = boneIdx.get(nm); const q = k === s.length - 1 ? 255 - acc : Math.round(w / tot * 255); SW[i * 4 + k] = q; acc += q; });
  });
  const I = n > 65535 ? new Uint32Array(idx) : new Uint16Array(idx);
  const bones = C.bones.map(b => { const parent = b.parentName && boneIdx.has(b.parentName) ? boneIdx.get(b.parentName) : -1;
    const pw = parent >= 0 ? C.bones[parent].world : new THREE.Matrix4(); const L = new THREE.Matrix4().copy(pw).invert().multiply(b.world);
    const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(); L.decompose(p, q, s);
    return [b.name, parent, ...p.toArray().map(x => +x.toFixed(3)), ...q.toArray().map(x => +x.toFixed(5))]; });
  const meta = { n, idx: I.length, i32: I instanceof Uint32Array, min, max, umin, umax, groups, bones };
  const parts = [P, Nn, U, SI, SW, I].map(a => new Uint8Array(a.buffer));
  const len = parts.reduce((a, b) => a + b.length, 0), bin = new Uint8Array(len); let o = 0; for (const p of parts) { bin.set(p, o); o += p.length; }
  const z = fflate.zlibSync(bin, { level: 9 }); let s = ''; for (let i = 0; i < z.length; i += 8192) s += String.fromCharCode.apply(null, z.subarray(i, i + 8192));
  return { meta, data: btoa(s) };
}
// --- runtime (uguale a quello del gioco) ---
function unpackAvatar(A) {
  const m = A.meta; const s = atob(A.data), z = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) z[i] = s.charCodeAt(i);
  const bin = fflate.unzlibSync(z); let o = 0; const take = (T, cnt) => { const a = new T(bin.buffer.slice(bin.byteOffset + o, bin.byteOffset + o + cnt * T.BYTES_PER_ELEMENT)); o += cnt * T.BYTES_PER_ELEMENT; return a; };
  const n = m.n, P = take(Uint16Array, n * 3), Nn = take(Int8Array, n * 3), U = take(Uint16Array, n * 2), SI = take(Uint8Array, n * 4), SW = take(Uint8Array, n * 4), I = take(m.i32 ? Uint32Array : Uint16Array, m.idx);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), sw = new Float32Array(n * 4);
  for (let i = 0; i < n * 3; i++) { const k = i % 3; pos[i] = m.min[k] + P[i] / 65535 * (m.max[k] - m.min[k]); nor[i] = Nn[i] / 127; }
  for (let i = 0; i < n * 2; i++) { const k = i % 2; uv[i] = m.umin[k] + U[i] / 65535 * (m.umax[k] - m.umin[k]); }
  for (let i = 0; i < n * 4; i++) sw[i] = SW[i] / 255;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(SI, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4)); g.setIndex(new THREE.BufferAttribute(I, 1));
  m.groups.forEach(([st, c, name], k) => g.addGroup(st, c, k));
  const bones = m.bones.map(b => { const bn = new THREE.Bone(); bn.name = b[0]; bn.position.set(b[2], b[3], b[4]); bn.quaternion.set(b[5], b[6], b[7], b[8]); return bn; });
  const root = new THREE.Group(); m.bones.forEach((b, i) => (b[1] >= 0 ? bones[b[1]] : root).add(bones[i]));
  return { geometry: g, bones, root, groups: m.groups.map(gr => gr[2]) };
}
function texPath(av, code, kind) { return 'tex/' + av + '__Textures__' + code + '_' + kind + '.png'; }
function buildTest(U, T, x) {
  const tl = new THREE.TextureLoader(), tx = (u, s) => { const t = tl.load(u); if (s) t.encoding = THREE.sRGBEncoding; return t; };
  const mats = U.groups.map(gn => gn === 'body' ? new THREE.MeshStandardMaterial({ map: tx(T.body, 1), normalMap: T.body_n ? tx(T.body_n) : null, roughness: .8, skinning: true })
    : gn === 'head' ? new THREE.MeshStandardMaterial({ map: tx(T.head, 1), normalMap: T.head_n ? tx(T.head_n) : null, roughness: .6, skinning: true })
    : new THREE.MeshStandardMaterial({ map: tx(T.hair, 1), alphaTest: .42, side: THREE.DoubleSide, skinning: true }));
  const mesh = new THREE.SkinnedMesh(U.geometry, mats); mesh.frustumCulled = false;
  U.root.add(mesh); U.root.updateMatrixWorld(true); mesh.bind(new THREE.Skeleton(U.bones));
  U.root.scale.setScalar(.01); U.root.position.x = x; sc.add(U.root); return { mesh, root: U.root, bones: U.bones };
}
