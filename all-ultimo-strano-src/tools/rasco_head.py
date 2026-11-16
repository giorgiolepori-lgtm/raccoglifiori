import sys; sys.path.insert(0, '.')
from make_chars import *
FACE = lambda d: d.ellipse((300, 150, 724, 640), fill=255)
def rasco_head(face='b03', name='rasco', beard=.28, brows=1.0):
    base = load('b04', 'head_color'); fc = load(face, 'head_color')
    m = mask(2048, FACE, 40)[..., None]
    # colore della pelle del cranio portato su quello del viso
    sm_b = skin_mask(base) > .8; sm_f = skin_mask(fc) > .8
    reg = np.zeros((2048, 2048), bool); reg[600:1100, 640:1400] = True
    cf = np.median(fc[..., :3][sm_f & reg], 0); cb = np.median(base[..., :3][sm_b & ~reg & (mask(2048, FACE, 1) < .5)], 0)
    base[..., :3] = np.clip(base[..., :3] * (cf / cb), 0, 1)
    h = base.copy(); h[..., :3] = base[..., :3] * (1 - m) + fc[..., :3] * m
    h = tone(h, skin_mask(h), (1.03, 1.0, .98)); youthen(h, .75); thicken_brows(h, brows)
    if beard: h = add_beard(h, 'full', beard)
    h = eyes_brown(h); save(h, name + '_head')
    nb = load('b04', 'head_normal'); nf = load(face, 'head_normal'); mm = m
    n = nb * (1 - mm) + nf * mm; n[..., :3] = n[..., :3] * .5 + np.array((.5, .5, 1.0)) * .5
    save(n, name + '_head_n', 1024, 80)
if __name__ == '__main__': rasco_head(*(sys.argv[1:2] or ['b03'])); print('ok')
