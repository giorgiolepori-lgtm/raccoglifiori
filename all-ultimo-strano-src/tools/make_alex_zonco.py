import sys; sys.path.insert(0, __import__('os').path.dirname(__file__))
from textures import *
HAIRZONE = lambda d: (d.rectangle((0, 0, 1024, 250), fill=255), d.rectangle((0, 0, 300, 560), fill=255), d.rectangle((724, 0, 1024, 560), fill=255))
def head(base, beard_shape, dens, tan, name, hair=(.075, .055, .045)):
    h = load(base, 'head_color')
    sm = skin_mask(h); h = tone(h, sm, tan)
    hz = mask(2048, HAIRZONE, 20); h2 = hair_color(h, hair); h[..., :3] = h[..., :3] * (1 - hz[..., None]) + h2[..., :3] * hz[..., None]
    if beard_shape: h = add_beard(h, beard_shape, dens)
    h = eyes_brown(h); save(h, name + '_head')
def cards(base, name, col=(.08, .06, .05)):
    a = load(base, 'opacity_color'); out = hair_color(a, col, 1.); out[..., 3] = a[..., 3]; save(out, name + '_hair', 1024)
TAN = (1.0, .93, .85)
head('a07', 'full', 1.15, TAN, 'alex'); cards('a07', 'alex')
head('a06', 'mg', 1.25, TAN, 'zonco', (.06, .045, .04)); cards('a04', 'zonco', (.06, .045, .04))
# --- corpo Alex: camicia bianca a righe grigie sottili, maniche arrotolate ---
b = load('b06', 'body_color'); S = 2048
yy, xx = np.mgrid[0:S, 0:S]
shirt = np.clip((lum(b) - .55) / .1, 0, 1) * (1 - region(S, (0, 0, 1024, 0)))          # parti bianche = camicia
stripe = ((xx // 22) % 3 == 0).astype(np.float32)                                   # righe verticali sottili
b[..., :3] = b[..., :3] * (1 - shirt[..., None] * stripe[..., None] * .28)
# maniche arrotolate: avambracci (parte bassa delle maniche) color pelle presa dalla mano
arm_skin = b[1840:1900, 60:200, :3].mean((0, 1))
for x0, x1 in ((0, 330), (694, 1024)):
    m = mask(S, lambda d: d.rectangle((x0, 640, x1, 860), fill=255), 6) * shirt
    noise = (lum(b)[..., None] - .8) * .25
    b[..., :3] = b[..., :3] * (1 - m[..., None]) + np.clip(arm_skin + noise, 0, 1) * m[..., None]
b = tone(b, skin_mask(b), TAN); save(b, 'alex_body')
# --- corpo Zonco: maglia a righe bianconere senza loghi ---
z = load('s02', 'body_color')
def fill_rows(img, x0, x1, y0, y1, sy0, sy1):   # sostituisce le righe y0..y1 con il colore per colonna preso da sy0..sy1
    s = 2; col = np.median(img[sy0 * s:sy1 * s, x0 * s:x1 * s, :3], axis=0)
    n = (np.random.RandomState(1).rand(y1 * s - y0 * s, 1, 1) - .5) * .03
    img[y0 * s:y1 * s, x0 * s:x1 * s, :3] = np.clip(col[None] + n, 0, 1)
fill_rows(z, 330, 690, 560, 715, 720, 960)        # davanti: logo, stemma, sponsor
fill_rows(z, 300, 720, 95, 210, 75, 95)
r, g, bl = z[..., 0], z[..., 1], z[..., 2]
orange = np.clip((r - g - .25) / .1, 0, 1) * np.clip((r - bl - .3) / .1, 0, 1)
L = lum(z)[..., None]; z[..., :3] = z[..., :3] * (1 - orange[..., None]) + (L * .25) * orange[..., None]
# retro: numero e scritte bianche sul nero -> nero
for box in ((420, 205, 600, 430), (150, 140, 200, 200), (825, 180, 880, 200), (280, 420, 300, 520)):
    rg = region(2048, box) > 0; dark = z[..., :3][rg & (lum(z) < .1)]; bg = np.median(dark, 0) if len(dark) else np.array([.05, .05, .05])
    m = region(2048, box) * np.clip((lum(z) - bg.mean() - .015) / .05, 0, 1)
    z[..., :3] = z[..., :3] * (1 - m[..., None]) + bg * m[..., None]
for box in ((110, 0, 200, 175), (830, 0, 920, 175)):   # scia bianca sui pantaloncini
    m = region(2048, box) * np.clip((lum(z) - .35) / .15, 0, 1); z[..., :3] = z[..., :3] * (1 - m[..., None]) + .06 * m[..., None]
z = tone(z, skin_mask(z), TAN); save(z, 'zonco_body')
# normal map
for av, nm in (('b06', 'alex'), ('s02', 'zonco')): save(load(av, 'body_normal', 1024), nm + '_body_n', 1024, 80)
for av, nm in (('a07', 'alex'), ('a06', 'zonco')): save(load(av, 'head_normal', 1024), nm + '_head_n', 1024, 80)
print('fatto')
