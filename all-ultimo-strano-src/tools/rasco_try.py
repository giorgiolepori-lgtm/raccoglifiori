import sys; sys.path.insert(0, '.')
import make_chars as mc
from make_chars import *
SCALP = lambda d: (d.rectangle((0, 0, 1024, 262), fill=255), d.rectangle((0, 0, 318, 600), fill=255), d.rectangle((706, 0, 1024, 600), fill=255))
def shaved(face, name, beard=.3, brows=.9):
    h = load(face, 'head_color'); h = tone(h, skin_mask(h), (1.03, 1.0, .98))
    youthen(h, .7)
    reg = h[600:1100, 640:1400, :3].reshape(-1, 3); sm_ = skin_mask(h)[600:1100, 640:1400].reshape(-1) > .8
    sk = np.median(reg[sm_], 0) * .97   # pelle del viso
    L = lum(h); hair = mask(2048, SCALP, 18) * np.clip((.7 - L) / .15, 0, 1) * (1 - skin_mask(h) * .5)
    n = (np.random.RandomState(2).rand(2048, 2048, 1) - .5) * .03
    m_ = hair > .5; mL = L[m_].mean() if m_.any() else .3
    shade = np.clip(.97 + (L - mL) * .35, .85, 1.08)[..., None]
    scalp = np.clip(sk * .96 * shade + n, 0, 1) * (1 - .07) + np.array((.12, .11, .12)) * .07   # leggera ricrescita
    h[..., :3] = h[..., :3] * (1 - hair[..., None]) + scalp * hair[..., None]
    thicken_brows(h, brows)
    if beard: h = add_beard(h, 'full', beard)
    h = eyes_brown(h); save(h, name + '_head'); save(load(face, 'head_normal', 1024), name + '_head_n', 1024, 80)
for f in sys.argv[1].split(','): shaved(f, 'v_rasco_' + f); print(f)
