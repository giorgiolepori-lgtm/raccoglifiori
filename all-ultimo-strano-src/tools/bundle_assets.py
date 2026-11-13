# Crea game/src/assets.js: mesh, texture di teste, vestiti e mappe normali
import json, base64, io, os, sys
from PIL import Image
B = os.path.dirname(os.path.abspath(__file__)) + '/../build/out/'
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)) + '/../game/src/assets.js'
def durl(im, size, q, mode='RGB'):
    im = im.convert(mode)
    if im.size[0] != size: im = im.resize((size, size), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
meshes = json.load(open(B + 'meshes.json')); meta = json.load(open(B + 'chars_meta.json'))
uniq, meshOf = {}, {}
for k, v in meshes.items():
    key = next((u for u, d in uniq.items() if d['data'] == v['data']), None)
    if key is None: uniq[k] = v; key = k
    meshOf[k] = key
tex, body, bodyOf, norm = {}, {}, {}, {}
for ch, m in meta.items():
    h = Image.open(B + ch + '_hair.png').convert('RGBA')
    tex[ch] = {'head': durl(Image.open(B + ch + '_head.jpg'), 1024, 82), 'head_n': durl(Image.open(B + ch + '_head_n.jpg'), 512, 70),
               'hair': durl(h.convert('RGB'), 512, 80), 'hair_a': durl(h.split()[3], 512, 85, 'L')}
    for i, c in enumerate(m['costumes']):
        cid = f'{ch}_{i + 1}'; body[cid] = durl(Image.open(B + cid + '_body.jpg'), 1024, 80); bodyOf[cid] = c['body']
        if c['body'] not in norm: norm[c['body']] = durl(Image.open(B + 'n_' + c['body'] + '.jpg'), 512, 70)
js = 'window.AUS=' + json.dumps({'mesh': uniq, 'meshOf': meshOf, 'tex': tex, 'body': body, 'bodyOf': bodyOf, 'norm': norm, 'meta': meta}, separators=(',', ':')) + ';'
open(OUT, 'w').write(js); print(OUT, len(js))
