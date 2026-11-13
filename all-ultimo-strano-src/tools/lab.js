// node lab.js out.jpg "<js che ritorna [[id, posa, etichetta], ...]>" [cols]
// rende ogni posa da davanti, di lato e da 3/4 in una griglia
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 400, height: 400 } });
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://localhost:8766/game/pose_lab.html'); await p.waitForTimeout(1500);
  const data = await p.evaluate(async (code) => {
    const list = eval(code); const W = 300, H = 400, views = [['fronte', 0], ['lato', Math.PI / 2], ['3/4', .75]];
    R.setPixelRatio(1); R.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    const cv = document.createElement('canvas'); cv.width = W * views.length; cv.height = H * list.length; const cx = cv.getContext('2d');
    for (let r = 0; r < list.length; r++) {
      const [idc, pose, lab, focus] = list[r]; const [id, cs] = idc.split(':'); const a = new Avatar(id, +(cs || 0)); scene.add(a.obj);
      await new Promise(res => setTimeout(res, 60));
      for (let c = 0; c < views.length; c++) {
        a.obj.rotation.y = views[c][1]; a.obj.updateMatrixWorld(true); a.apply(pose);
        const fy = focus || 1.0, d = focus ? 1.6 : 3.0; camera.position.set(0, fy + .15, d); camera.lookAt(0, fy, 0);
        R.render(scene, camera); cx.drawImage(R.domElement, c * W, r * H);
        cx.fillStyle = '#000'; cx.font = '16px sans-serif'; cx.fillText(lab + ' · ' + views[c][0], c * W + 6, r * H + 18);
      }
      scene.remove(a.obj);
    }
    return cv.toDataURL('image/jpeg', .85);
  }, process.argv[3]);
  fs.writeFileSync(process.argv[2], Buffer.from(data.split(',')[1], 'base64')); await b.close();
})();
