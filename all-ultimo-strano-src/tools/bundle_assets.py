# Crea game/src/assets.js con mesh e texture in base64
import json, base64, io, os, sys
from PIL import Image
B = os.path.dirname(os.path.abspath(__file__)) + '/../build/out/'
OUT = os.path.dirname(os.path.abspath(__file__)) + '/../game/src/assets.js'
def durl(im, size, q, mode='RGB'):
    im = im.convert(mode)
    if im.size[0] != size: im = im.resize((size, size), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
meshes = json.load(open(B + 'meshes.json'))
CHARS = sys.argv[1].split(',') if len(sys.argv) > 1 else ['alex', 'zonco']
tex = {}
for c in CHARS:
    t = {}
    t['body'] = durl(Image.open(B + c + '_body.jpg'), 1024, 82)
    t['body_n'] = durl(Image.open(B + c + '_body_n.jpg'), 512, 72)
    t['head'] = durl(Image.open(B + c + '_head.jpg'), 1024, 84)
    t['head_n'] = durl(Image.open(B + c + '_head_n.jpg'), 512, 72)
    h = Image.open(B + c + '_hair.png').convert('RGBA')
    t['hair'] = durl(h.convert('RGB'), 512, 80); t['hair_a'] = durl(h.split()[3], 512, 85, 'L')
    tex[c] = t
js = 'window.AUS=' + json.dumps({'mesh': meshes, 'tex': tex}, separators=(',', ':')) + ';'
open(OUT, 'w').write(js); print(len(js))
