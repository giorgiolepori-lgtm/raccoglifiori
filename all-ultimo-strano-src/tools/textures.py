# Strumenti per creare le texture dei personaggi dalle texture Rocketbox (coordinate UV in scala 1024).
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os
B = os.path.dirname(os.path.abspath(__file__)) + '/../build/'
AV = {'a01': ('Adults__Male_Adult_01', 'm002'), 'a04': ('Adults__Male_Adult_04', 'm006'), 'a06': ('Adults__Male_Adult_06', 'm011'), 'a07': ('Adults__Male_Adult_07', 'm013'),
      'a09': ('Adults__Male_Adult_09', 'm017'), 'a10': ('Adults__Male_Adult_10', 'm024'), 'b06': ('Professions__Business_Male_06', 'm025'), 's02': ('Professions__Sports_Male_02', 'm301')}
def path(av, kind): a, c = AV[av]; return B + 'tex/' + a + '__Textures__' + c + '_' + kind + '.png'
def load(av, kind, size=2048):
    im = Image.open(path(av, kind)); im = im.convert('RGBA' if im.mode == 'RGBA' else 'RGB')
    if im.size != (size, size): im = im.resize((size, size), Image.LANCZOS)
    return np.asarray(im).astype(np.float32) / 255
def save(arr, name, size=1024, q=86):
    im = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))
    if im.size[0] != size: im = im.resize((size, size), Image.LANCZOS)
    if im.mode == 'RGBA': im.save(B + 'out/' + name + '.png', optimize=True)
    else: im.save(B + 'out/' + name + '.jpg', quality=q)
def lum(a): return a[..., 0] * .299 + a[..., 1] * .587 + a[..., 2] * .114
def mask(size, draw_fn, blur=8):
    m = Image.new('L', (1024, 1024), 0); draw_fn(ImageDraw.Draw(m)); m = m.filter(ImageFilter.GaussianBlur(blur))
    if size != 1024: m = m.resize((size, size), Image.BILINEAR)
    return np.asarray(m).astype(np.float32) / 255
def skin_mask(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; L = lum(a)
    return np.clip(((r - b) - .06) / .08, 0, 1) * np.clip((L - .18) / .1, 0, 1) * np.clip((r - g + .02) / .05, 0, 1)
def tone(a, m, mul):   # moltiplica il colore dove m (pelle)
    out = a.copy(); out[..., :3] = a[..., :3] * (1 - m[..., None]) + np.clip(a[..., :3] * np.array(mul), 0, 1) * m[..., None]; return out
# --- barba: trasferisce il disegno della barba del modello a04 ---
_beard = None
def beard_alpha():
    global _beard
    if _beard is None:
        h = load('a04', 'head_color'); L = lum(h); ref = L[340:440, 940:1100].mean()
        _beard = np.clip((ref - L) / (ref - .1), 0, 1) ** .8
    return _beard
FULL = lambda d: d.polygon([(292, 300), (330, 300), (345, 360), (420, 372), (512, 378), (604, 372), (680, 360), (695, 300), (735, 300), (738, 420), (712, 520), (660, 600), (590, 640), (512, 650), (434, 640), (364, 600), (312, 520), (288, 420)], fill=255)
MOUTH = lambda d: d.ellipse((462, 398, 562, 428), fill=255)
MG = lambda d: (d.ellipse((440, 368, 584, 404), fill=255), d.ellipse((462, 420, 562, 560), fill=200))
def add_beard(h, shape='full', dens=1., col=(.07, .05, .04), blur=10):
    size = h.shape[0]; ba = beard_alpha()
    if size != 2048: ba = np.asarray(Image.fromarray((ba * 255).astype(np.uint8)).resize((size, size))).astype(np.float32) / 255
    if shape == 'full': m = mask(size, FULL, blur) * (1 - mask(size, MOUTH, 4))
    elif shape == 'mg': m = mask(size, MG, 6) * (1 - mask(size, MOUTH, 3))
    else: m = mask(size, shape, blur)
    a = np.clip(ba * m * dens, 0, 1)[..., None]
    out = h.copy(); out[..., :3] = h[..., :3] * (1 - a) + np.array(col) * (.6 + .8 * h[..., :3].mean(-1, keepdims=True)) * a; return out
def eyes_brown(h, col=(.36, .2, .1)):
    size = h.shape[0]; s = size / 1024; out = h.copy()
    cy, cx = int(955 * s), int(270 * s); r = int(22 * s)
    yy, xx = np.mgrid[0:size, 0:size]; d = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2)
    m = np.clip((r - d) / (3 * s), 0, 1) * (lum(h) > .02)
    L = lum(h)[..., None]; tint = np.array(col) * (.5 + 1.5 * L)
    out[..., :3] = h[..., :3] * (1 - m[..., None]) + tint * m[..., None]; return out
def hair_color(a, col=(.09, .065, .05), amt=1.):  # ricolora i capelli scuri mantenendo il dettaglio
    L = lum(a)[..., None]; target = np.array(col) * (L / max(L.mean(), .05)) ** .9
    out = a.copy(); m = np.clip((.42 - L[..., 0]) / .15, 0, 1)[..., None] * amt
    out[..., :3] = a[..., :3] * (1 - m) + np.clip(target * .9 + a[..., :3] * .1, 0, 1) * m; return out
def region(size, box): m = np.zeros((size, size), np.float32); s = size / 1024; x0, y0, x1, y1 = [int(v * s) for v in box]; m[y0:y1, x0:x1] = 1; return m
