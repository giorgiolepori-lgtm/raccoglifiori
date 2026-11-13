# Crea teste e vestiti di tutti i personaggi. Coordinate UV in scala 1024 (texture lavorate a 2048).
import sys, os, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from textures import *
N = 2048; K = N / 1024
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / K     # coordinate in scala 1024
TAN = (1.0, .93, .85); PALE = (1.03, 1.0, .98)
def box(x0, y0, x1, y1): return ((xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)).astype(np.float32)
def near(img, ref, tol): d = np.sqrt(((img[..., :3] - np.array(ref)) ** 2).sum(-1)); return np.clip((tol - d) / (tol * .35), 0, 1)
def recolor(img, m, col, keep=1.0):
    L = lum(img); sel = m > .5
    mean = L[sel].mean() if sel.any() else .5
    shade = (L / max(mean, .03)) ** keep
    tgt = np.clip(np.array(col)[None, None, :] * shade[..., None], 0, 1)
    img[..., :3] = img[..., :3] * (1 - m[..., None]) + tgt * m[..., None]
def paint(img, m, rgb):   # rgb: array NxNx3 (motivo) moltiplicato per l'ombreggiatura
    L = lum(img); sel = m > .5; mean = L[sel].mean() if sel.any() else .5
    shade = np.clip(L / max(mean, .03), .3, 1.6)[..., None]
    img[..., :3] = img[..., :3] * (1 - m[..., None]) + np.clip(rgb * shade, 0, 1) * m[..., None]
def cloth(img): return 1 - skin_mask(img)
ZPANTS = lambda: np.clip(box(0, 0, 335, 450) + box(689, 0, 1024, 450), 0, 1)
ZSHOES = lambda: np.clip(box(225, 690, 335, 1024) + box(689, 690, 800, 1024), 0, 1)
def ztop(): return np.clip(1 - ZPANTS() - ZSHOES(), 0, 1)
def roll_sleeves(img, y0=640, y1=880):
    arm = img[int(930 * K):int(990 * K), int(40 * K):int(180 * K), :3].reshape(-1, 3).mean(0)
    for x0, x1 in ((0, 335), (689, 1024)):
        m = box(x0, y0, x1, y1) * cloth(img); n = (lum(img)[..., None] - .5) * .12
        img[..., :3] = img[..., :3] * (1 - m[..., None]) + np.clip(arm + n, 0, 1) * m[..., None]
def erase(img, b, ref_box):   # copre loghi/scritte con il colore mediano di un'altra zona
    x0, y0, x1, y1 = ref_box; c = np.median(img[int(y0 * K):int(y1 * K), int(x0 * K):int(x1 * K), :3].reshape(-1, 3), 0)
    m = box(*b); n = (np.random.RandomState(3).rand(N, N, 1) - .5) * .02
    img[..., :3] = img[..., :3] * (1 - m[..., None]) + np.clip(c + n, 0, 1) * m[..., None]
def pattern_floral(cols, scale=34, seed=1):
    r = np.random.RandomState(seed); out = np.zeros((N, N, 3), np.float32); out[:] = cols[0]
    im = Image.fromarray((out * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for _ in range(int(1400 * (34 / scale) ** 2)):
        x, y, rr = r.uniform(0, N), r.uniform(0, N), r.uniform(.5, 1) * scale * K * .5
        c = tuple(int(v * 255) for v in cols[1 + r.randint(len(cols) - 1)])
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=c)
        c2 = tuple(int(v * 255) for v in cols[r.randint(len(cols))]); d.ellipse((x - rr * .45, y - rr * .45, x + rr * .45, y + rr * .45), fill=c2)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255
def pattern_burst(base, fg, scale=40, seed=2):    # fiori "a riccio di mare" bianchi su nero
    r = np.random.RandomState(seed); im = Image.new('RGB', (N, N), tuple(int(v * 255) for v in base)); d = ImageDraw.Draw(im)
    for _ in range(1100):
        x, y, rr = r.uniform(0, N), r.uniform(0, N), scale * K * r.uniform(.35, .55)
        c = tuple(int(v * 255) for v in fg)
        for a in np.linspace(0, TAU, 18, endpoint=False): d.line((x + np.cos(a) * rr * .3, y + np.sin(a) * rr * .3, x + np.cos(a) * rr, y + np.sin(a) * rr), fill=c, width=max(1, int(K * 1.5)))
        d.ellipse((x - rr * .22, y - rr * .22, x + rr * .22, y + rr * .22), outline=c, width=max(1, int(K)))
    return np.asarray(im).astype(np.float32) / 255
TAU = 6.283185
def pattern_check(c1, c2, size=46):
    a = ((xx // size) % 2 + (yy // size) % 2); out = np.zeros((N, N, 3), np.float32)
    col = np.where((a == 0)[..., None], np.array(c2) * .55, np.where((a == 2)[..., None], np.array(c1), (np.array(c1) + np.array(c2) * .55) / 2))
    lines = (((xx % size) < 3) | ((yy % size) < 3)).astype(np.float32)[..., None]
    return col * (1 - lines * .25)
def pattern_pinstripe(base, line, step=18):
    out = np.zeros((N, N, 3), np.float32); out[:] = base; m = ((xx % step) < 1.4)[..., None]
    return np.where(m, np.array(line), out)
def denim(base=(.24, .33, .48)):
    r = np.random.RandomState(5); n = r.rand(N, N).astype(np.float32)
    tw = (np.sin((xx + yy) * 2.2) * .5 + .5) * .25 + n * .25
    return np.clip(np.array(base)[None, None] * (.8 + tw[..., None]), 0, 1)
def text_on(img, text, cx, cy, w, color=(0.08, .08, .08), fs=60):
    im = Image.fromarray((np.clip(img[..., :3], 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    try:
        from PIL import ImageFont
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(fs * K))
    except Exception: font = None
    lines = text.split('\n'); y = (cy - len(lines) * fs * .6) * K
    for ln in lines:
        tw = d.textlength(ln, font=font); sc = 1
        d.text((cx * K - tw / 2, y), ln, fill=tuple(int(v * 255) for v in color), font=font); y += fs * 1.15 * K
    out = np.asarray(im).astype(np.float32) / 255; img[..., :3] = out

def body(av): return load(av, 'body_color')
def finish(img, tone, name):
    img = tone_fn(img, tone); save(img, name)
def tone_fn(img, tone): return tone(img, skin_mask(img), tone) if False else globals()['tone'](img, skin_mask(img), tone)

# ---------------- teste ----------------
HAIRZONE = lambda d: (d.rectangle((0, 0, 1024, 250), fill=255), d.rectangle((0, 0, 300, 560), fill=255), d.rectangle((724, 0, 1024, 560), fill=255))
JAW = lambda d: (FULL(d),)
def jaw_mask(size):
    m = mask(size, FULL, 10); cheek = mask(size, lambda d: (d.ellipse((330, 330, 470, 520), fill=255), d.ellipse((554, 330, 694, 520), fill=255), d.ellipse((410, 405, 614, 470), fill=255)), 16)
    must = mask(size, lambda d: d.ellipse((445, 372, 579, 398), fill=255), 5) * .75
    return np.clip(m * (1 - cheek) + must, 0, 1) * (1 - mask(size, MOUTH, 4))
def head(face, beard, dens, tone_, name, hair=(.075, .055, .045)):
    h = load(face, 'head_color'); h = tone(h, skin_mask(h), tone_)
    hz = mask(2048, HAIRZONE, 20); h2 = hair_color(h, hair); h[..., :3] = h[..., :3] * (1 - hz[..., None]) + h2[..., :3] * hz[..., None]
    if beard == 'jaw':
        ba = beard_alpha(); a = np.clip(ba * jaw_mask(2048) * dens, 0, 1)[..., None]
        h[..., :3] = h[..., :3] * (1 - a) + np.array((.07, .05, .04)) * (.6 + .8 * h[..., :3].mean(-1, keepdims=True)) * a
    elif beard: h = add_beard(h, beard, dens)
    h = eyes_brown(h); save(h, name + '_head'); save(load(face, 'head_normal', 1024), name + '_head_n', 1024, 80)
def cards(geom, name, col):
    a = load(geom, 'opacity_color'); out = hair_color(a, col, 1.); out[..., 3] = a[..., 3]; save(out, name + '_hair', 1024)
HEADS = {   # personaggio: (geometria testa, volto, barba, densità, tono, colore capelli)
    'alex': ('a07', 'a07', 'full', 1.15, TAN, (.075, .055, .045)), 'zonco': ('a01', 'a06', 'mg', 1.25, TAN, (.06, .045, .04)),
    'bruno': ('a06', 'a20', 'full', .62, TAN, (.11, .075, .055)), 'edo': ('b03', 'a08', 'jaw', 1.1, TAN, (.05, .04, .035)),
    'pet': ('a02', 'a02', 'full', 1.25, TAN, (.1, .07, .05)), 'josto': ('a08', 'b03', 'full', .75, TAN, (.07, .05, .04)),
    'davidino': ('a10', 'b06', 'full', 1.15, TAN, (.06, .045, .04)), 'gio': ('b01', 'b01', 'full', .22, PALE, (.1, .07, .05)),
}
# ---------------- vestiti ----------------
def C_alex_1():
    b = body('b06'); m = box(0, 0, 1024, 1024) * np.clip((lum(b) - .55) / .1, 0, 1)
    b[..., :3] *= (1 - m * ((xx // 11) % 3 == 0)[...] * .28)[..., None]; roll_sleeves(b); return b
def s02_base():
    z = load('s02', 'body_color')
    def fill_rows(img, x0, x1, y0, y1, sy0, sy1):
        col = np.median(img[int(sy0 * K):int(sy1 * K), int(x0 * K):int(x1 * K), :3], axis=0)
        n = (np.random.RandomState(1).rand(int(y1 * K) - int(y0 * K), 1, 1) - .5) * .03
        img[int(y0 * K):int(y1 * K), int(x0 * K):int(x1 * K), :3] = np.clip(col[None] + n, 0, 1)
    fill_rows(z, 330, 690, 560, 715, 720, 960); fill_rows(z, 300, 720, 95, 210, 75, 95); fill_rows(z, 425, 600, 205, 430, 432, 446)
    for bx in ((150, 140, 200, 200), (825, 180, 880, 200), (280, 420, 300, 520), (110, 0, 200, 175), (830, 0, 920, 175)):
        m = box(*bx) * np.clip((lum(z) - .3) / .1, 0, 1); z[..., :3] = z[..., :3] * (1 - m[..., None]) + .06 * m[..., None]
    r, g, bl = z[..., 0], z[..., 1], z[..., 2]
    orange = np.clip((r - g - .25) / .1, 0, 1) * np.clip((r - bl - .3) / .1, 0, 1); L = lum(z)[..., None]; z[..., :3] = z[..., :3] * (1 - orange[..., None]) + (L * .25) * orange[..., None]
    return z
S02_JERSEY = lambda: np.clip(box(260, 40, 765, 880), 0, 1)
S02_SHORTS = lambda: np.clip(box(0, 0, 300, 205) + box(724, 0, 1024, 205), 0, 1)
S02_SOCKS = lambda: np.clip(box(0, 200, 300, 640) + box(724, 200, 1024, 640), 0, 1)
S02_SHOES = lambda: np.clip(box(215, 690, 330, 1024) + box(694, 690, 810, 1024), 0, 1)
def flat(img, m, col, keep=.3):   # tinta unita: parti chiare e scure portate allo stesso colore
    L = lum(img); light = m * np.clip((L - .3) / .1, 0, 1); dark = m * (1 - np.clip((L - .3) / .1, 0, 1))
    recolor(img, light, col, keep); recolor(img, dark, col, keep)
def s02_bare_legs(z):
    leg = z[int(230 * K):int(280 * K), int(60 * K):int(200 * K), :3].reshape(-1, 3).mean(0); m = S02_SOCKS() * cloth(z); n = (lum(z)[..., None] - .5) * .1
    z[..., :3] = z[..., :3] * (1 - m[..., None]) + np.clip(leg + n, 0, 1) * m[..., None]
def C_alex_2():
    z = s02_base(); flat(z, S02_JERSEY() * cloth(z), (.06, .06, .065)); paint(z, S02_SHORTS() * cloth(z), denim()); s02_bare_legs(z)
    recolor(z, S02_SHOES() * np.clip((lum(z) - .3) / .1, 0, 1), (.05, .05, .05), .5); return z
def C_zonco_1():
    z = s02_base(); j = S02_JERSEY() * cloth(z); L = lum(z)
    recolor(z, j * np.clip((L - .3) / .1, 0, 1), (.55, .76, .9), .5); recolor(z, j * np.clip((.3 - L) / .1, 0, 1), (.93, .95, .97), .3)
    recolor(z, S02_SOCKS() * cloth(z), (.55, .76, .9), .4); return z
def C_zonco_2(): return s02_base()
def C_bruno_2():
    z = s02_base(); flat(z, S02_JERSEY() * cloth(z), (.11, .15, .27)); recolor(z, S02_SHORTS() * cloth(z), (.62, .58, .5), .6); s02_bare_legs(z); return z
def b06_shirt(): b = body('b06'); return b, ztop() * np.clip((lum(b) - .5) / .1, 0, 1)
def C_bruno_1(): b, sh = b06_shirt(); roll_sleeves(b); recolor(b, ZPANTS() * cloth(b), (.11, .14, .24), .7); return b
def C_pet_3(): b, sh = b06_shirt(); paint(b, sh, pattern_floral([(.82, .46, .18), (.42, .26, .14), (.18, .32, .55), (.3, .48, .3), (.9, .7, .35)], 30, 4)); roll_sleeves(b, 600); return b
def C_zonco_3(): b, sh = b06_shirt(); paint(b, sh, pattern_floral([(.1, .17, .4), (.35, .5, .75), (.85, .88, .92), (.15, .3, .6)], 26, 7)); roll_sleeves(b, 600); return b
def C_gio_4(): b, sh = b06_shirt(); paint(b, sh, pattern_burst((.05, .05, .055), (.85, .85, .82), 40)); recolor(b, ZPANTS() * cloth(b), (.82, .8, .74), .5); return b
def a09_base(keep_tattoo=False):
    b = body('a09'); erase(b, (420, 560, 620, 860), (400, 500, 620, 540))
    if not keep_tattoo:
        arm = b[int(780 * K):int(800 * K), int(40 * K):int(80 * K), :3].reshape(-1, 3).mean(0); m = box(85, 750, 140, 850) * np.clip((.45 - lum(b)) / .15, 0, 1)
        b[..., :3] = b[..., :3] * (1 - m[..., None]) + arm * m[..., None]
    return b
A09_T = lambda: np.clip(box(330, 0, 690, 900) + box(0, 450, 335, 600) + box(689, 450, 1024, 600), 0, 1)
def C_pet_2(): b = a09_base(); recolor(b, A09_T() * cloth(b), (.5, .51, .53), .7); return b
def C_zonco_5():
    b = a09_base(True); recolor(b, A09_T() * cloth(b), (.48, .49, .5), .7)
    im = Image.fromarray((np.clip(b[..., :3], 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.ellipse((460 * K, 580 * K, 560 * K, 680 * K), outline=(30, 30, 32), width=int(6 * K)); d.rectangle((485 * K, 690 * K, 535 * K, 720 * K), fill=(30, 30, 32))
    b[..., :3] = np.asarray(im).astype(np.float32) / 255; return b
def C_josto_2(): b = a09_base(); recolor(b, A09_T() * cloth(b), (.92, .92, .9), .45); text_on(b, 'CURIOSO\nCOME\nGIOSTO', 512, 660, 200, fs=34); return b
def C_davidino_2():
    b = a09_base(); t = np.clip(np.abs(yy - 470) / 400, 0, 1)[..., None]; grad = np.array((.25, .55, .45)) * (1 - t) + np.array((.93, .94, .92)) * t
    paint(b, A09_T() * cloth(b), grad); m = ZPANTS() * cloth(b); b[..., :3] = b[..., :3] * (1 - m[..., None]) + np.clip(b[..., :3] * 1.45 + .05, 0, 1) * m[..., None]
    recolor(b, ZSHOES() * cloth(b), (.92, .92, .9), .4); return b
def a06(): return body('a06')
ZHANDS = lambda: np.clip(box(0, 845, 230, 1024) + box(795, 845, 1024, 1024), 0, 1)
TOPZ = lambda: ztop() * (1 - ZHANDS()) * (1 - ZSHOES())
A06_TOP = lambda b: np.clip(TOPZ() * np.clip((lum(b) - .03) / .05, 0, 1) + near(b, (.65, .12, .1), .35) * (1 - ZHANDS()), 0, 1)
def C_bruno_3(): b = a06(); recolor(b, A06_TOP(b), (.78, .78, .77), .6); return b
def C_josto_3(): b = a06(); paint(b, A06_TOP(b), pattern_check((.62, .08, .08), (.05, .05, .05), 44)); return b
def C_gio_3(): b = a06(); recolor(b, A06_TOP(b), (.07, .07, .075), .6); recolor(b, ZPANTS() * cloth(b), (.9, .89, .86), .45); return b
def a10(): return body('a10')
A10_RED = lambda b: near(b, (.6, .12, .1), .4) * (1 - ZSHOES())
A10_WHITE = lambda b: np.clip((lum(b) - .55) / .12, 0, 1) * np.clip(box(0, 0, 335, 700) + box(689, 0, 1024, 700) + box(335, 0, 689, 700), 0, 1) * (1 - ZSHOES())
def C_pet_1(): b = a10(); w = A10_WHITE(b); recolor(b, w * ztop(), (.55, .1, .09), .6); recolor(b, A10_RED(b), (.6, .1, .09), .8); return b
def C_davidino_1(): b = a10(); recolor(b, A10_RED(b), (.88, .72, .12), .75); recolor(b, box(400, 200, 620, 260) * cloth(b) * (1 - A10_RED(b)), (.6, .68, .58), .5); return b
def C_gio_2(): b = a10(); recolor(b, A10_RED(b), (.07, .07, .075), .6); return b
def C_edo_1(): b = body('b01'); w = np.clip((lum(b) - .55) / .1, 0, 1) * cloth(b); recolor(b, w, (.55, .57, .6), .6); recolor(b, near(b, (.6, .1, .1), .35), (.16, .17, .2), .6); return b
def C_josto_1(): b = body('b02'); recolor(b, np.clip(box(390, 890, 525, 940) + box(495, 925, 610, 1005), 0, 1) * cloth(b), (.82, .16, .48), .6); return b
def C_edo_2():
    b = body('a04'); jacket = near(b, (.42, .38, .26), .25) * cloth(b); recolor(b, jacket, (.07, .07, .075), .5)
    q = ((yy % 34) < 3).astype(np.float32); b[..., :3] *= (1 - jacket * q * .5)[..., None]
    recolor(b, near(b, (.1, .5, .6), .3) * cloth(b), (.08, .08, .085), .5); recolor(b, near(b, (.75, .3, .6), .3) * cloth(b), (.55, .56, .58), .5)
    recolor(b, ZPANTS() * cloth(b), (.1, .1, .11), .6); recolor(b, ZSHOES() * cloth(b) * np.clip((lum(b) - .35) / .1, 0, 1), (.9, .9, .9), .3); return b
def C_edo_3(): b = body('a20'); recolor(b, ztop() * near(b, (.3, .2, .15), .25), (.6, .1, .1), .7); recolor(b, ZPANTS() * cloth(b), (.07, .07, .08), .6); return b
def C_edo_4(): b = body('a02'); recolor(b, TOPZ() * np.clip((lum(b) - .2) / .1, 0, 1), (.38, .1, .14), .7); return b
def C_gio_1(): b = body('a02'); recolor(b, TOPZ() * np.clip((lum(b) - .2) / .1, 0, 1), (.62, .46, .3), .7); return b
def a07(): return body('a07')
A07_JACKET = lambda b: ztop() * near(b, (.38, .38, .38), .2)
A07_SHIRT = lambda b: ztop() * near(b, (.62, .38, .3), .25)
def C_zonco_4():
    b = a07(); recolor(b, A07_JACKET(b), (.28, .33, .16), .7); recolor(b, A07_SHIRT(b), (.32, .45, .66), .6)
    paint(b, ZPANTS() * cloth(b), pattern_pinstripe((.3, .2, .13), (.55, .45, .35), 16))
    im = Image.fromarray((np.clip(b[..., :3], 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for (x, y, c) in ((395, 600, (200, 60, 50)), (590, 640, (230, 190, 60)), (110, 520, (60, 90, 170)), (860, 560, (220, 220, 210))):
        d.rounded_rectangle((x * K, y * K, (x + 46) * K, (y + 40) * K), radius=int(8 * K), fill=c, outline=(30, 30, 30), width=int(2 * K))
    b[..., :3] = np.asarray(im).astype(np.float32) / 255; return b
def C_gio_5():
    b = a07(); n = (np.random.RandomState(9).rand(N, N) * .08).astype(np.float32); m = ztop() * cloth(b) * (1 - A07_SHIRT(b)) * (1 - ZSHOES())
    recolor(b, m, (.93, .89, .8), .3); b[..., :3] = np.clip(b[..., :3] - (m * n)[..., None], 0, 1)
    recolor(b, A07_SHIRT(b), (.12, .12, .13), .5); return b
COSTUMES = {   # id: (corpo, funzione, accessori, nome)
    'alex': [('b06', C_alex_1, [], 'Camicia a righe'), ('s02', C_alex_2, [], 'Maglietta nera e jeans corti')],
    'bruno': [('b06', C_bruno_1, [], 'Camicia bianca'), ('s02', C_bruno_2, ['glasses:dark'], 'Maglietta blu e occhiali'), ('a06', C_bruno_3, [], 'Felpa grigia')],
    'edo': [('b01', C_edo_1, ['earrings'], 'Completo da laurea'), ('a04', C_edo_2, ['earrings'], 'Piumino nero'), ('a20', C_edo_3, ['earrings'], 'Felpa rossa'), ('a02', C_edo_4, ['earrings'], 'Maglione bordeaux')],
    'pet': [('a10', C_pet_1, [], 'Felpa rossa con zip'), ('a09', C_pet_2, [], 'Maglietta grigia'), ('b06', C_pet_3, ['cap:green'], 'Camicia a fantasia')],
    'zonco': [('s02', C_zonco_1, [], 'Maglia celeste'), ('s02', C_zonco_2, [], 'Maglia bianconera'), ('b06', C_zonco_3, ['bandana'], 'Camicia blu e bandana'), ('a07', C_zonco_4, ['cap:dark', 'glasses:dark'], 'Bomber verde'), ('a09', C_zonco_5, ['sunglasses:black'], 'Maglietta grigia')],
    'josto': [('b02', C_josto_1, ['glasses:gold'], 'Completo blu'), ('a09', C_josto_2, ['glasses:gold'], 'Curioso come Giosto'), ('a06', C_josto_3, ['sunglasses:mirror'], 'Camicia a quadri')],
    'davidino': [('a10', C_davidino_1, ['sunhead', 'chain'], 'Tuta gialla'), ('a09', C_davidino_2, ['chain', 'watch'], 'Maglietta sfumata')],
    'gio': [('a02', C_gio_1, [], 'Felpa cammello'), ('a10', C_gio_2, ['sunglasses:black'], 'Tuta nera'), ('a06', C_gio_3, ['smartwatch'], 'Maglia nera'), ('b06', C_gio_4, ['chain', 'watch'], 'Camicia a fantasia'), ('a07', C_gio_5, [], 'Pile panna')],
}
if __name__ == '__main__':
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    meta = {}
    for ch, lst in COSTUMES.items():
        g, face, beard, dens, tn, hc = HEADS[ch]
        if not only or ch in only:
            head(face, beard, dens, tn, ch, hc); cards(g, ch, hc)
            for i, (bd, fn, acc, nm) in enumerate(lst):
                img = fn(); img = tone(img, skin_mask(img), tn); save(img, f'{ch}_{i + 1}_body', 1024, 84); print(ch, i + 1, nm)
        meta[ch] = {'head': g, 'costumes': [{'body': bd, 'acc': acc, 'name': nm} for bd, fn, acc, nm in lst]}
    for bd in sorted({c[0] for l in COSTUMES.values() for c in l}):
        if not os.path.exists(B + 'out/n_' + bd + '.jpg'): save(load(bd, 'body_normal', 1024), 'n_' + bd, 512, 75)
    json.dump(meta, open(B + 'out/chars_meta.json', 'w'), indent=1)
