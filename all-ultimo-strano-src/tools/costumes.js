// griglia di tutti i vestiti: node costumes.js out.jpg [char,...]
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(); p.on('pageerror', e => console.log('[err]', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('[c]', m.text()); });
  await p.goto('http://localhost:8766/game/pose_lab.html'); await p.waitForTimeout(1500);
  const data = await p.evaluate(async (args) => {
    const [only, mode] = args; const list = []; for (const c of CHARS) if (!only || only.includes(c.id)) c.costumes.forEach((x, i) => list.push([c.id, i, c.name + ' ' + (i + 1)]));
    const W = 240, H = mode === 'face' ? 240 : 360, cols = 6; R.setPixelRatio(1); R.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    const cv = document.createElement('canvas'); cv.width = W * cols; cv.height = H * Math.ceil(list.length / cols); const cx = cv.getContext('2d');
    for (let i = 0; i < list.length; i++) {
      const [id, cos, lab] = list[i]; const a = new Avatar(id, cos); scene.add(a.obj); a.obj.rotation.y = .35;
      await new Promise(r => { const chk = () => TEX_PENDING > 0 ? setTimeout(chk, 50) : r(); chk(); });
      a.obj.updateMatrixWorld(true); a.apply(P({ yaw: 0, cy: 0, hp: 0, lh: [-.25, 1.0, .1], rh: [.25, 1.0, .1], lho: [0, 1, 0], rho: [0, 1, 0], fist: .5 }));
      if (mode === 'face') { camera.position.set(.15, 1.66, .75); camera.lookAt(0, 1.62, 0); } else { camera.position.set(0, 1.1, 3.0); camera.lookAt(0, .95, 0); }
      R.render(scene, camera); cx.drawImage(R.domElement, (i % cols) * W, Math.floor(i / cols) * H); cx.fillStyle = '#000'; cx.font = '15px sans-serif'; cx.fillText(lab, (i % cols) * W + 5, Math.floor(i / cols) * H + 16);
      scene.remove(a.obj); a.dispose();
    }
    return cv.toDataURL('image/jpeg', .85);
  }, [process.argv[3] ? process.argv[3].split(',') : null, process.argv[4] || 'body']);
  fs.writeFileSync(process.argv[2], Buffer.from(data.split(',')[1], 'base64')); await b.close();
})();
