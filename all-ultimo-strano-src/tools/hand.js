const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(); p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://localhost:8766/game/pose_lab.html'); await p.waitForTimeout(1500);
  const data = await p.evaluate(async (code) => {
    const list = eval(code); const W = 300, H = 300;
    R.setPixelRatio(1); R.setSize(W, H); camera.aspect = 1; camera.updateProjectionMatrix();
    const cv = document.createElement('canvas'); cv.width = W * 3; cv.height = H * list.length; const cx = cv.getContext('2d');
    for (let r = 0; r < list.length; r++) {
      const [pose, lab] = list[r]; const a = new Avatar('alex', 'alex_1'); scene.add(a.obj); await new Promise(res => setTimeout(res, 60));
      if (list[r][2]) list[r][2](); a.obj.updateMatrixWorld(true); a.apply(pose); const h = a.B[(list[r][3]||'l')+'Ha'].getWorldPosition(new THREE.Vector3());
      const views = [[0, 0, .45], [.45, 0, 0], [0, .45, .05]];
      for (let c = 0; c < 3; c++) { camera.position.copy(h).add(new THREE.Vector3(...views[c])); camera.lookAt(h); R.render(scene, camera); cx.drawImage(R.domElement, c * W, r * H); cx.fillStyle = '#000'; cx.font = '16px sans-serif'; cx.fillText(lab + ' ' + ['davanti', 'fuori', 'sopra'][c], c * W + 6, r * H + 18); }
      scene.remove(a.obj);
    }
    return cv.toDataURL('image/jpeg', .85);
  }, process.argv[3]);
  fs.writeFileSync(process.argv[2], Buffer.from(data.split(',')[1], 'base64')); await b.close();
})();
