import sys; sys.path.insert(0, '.')
import make_chars as mc
from make_chars import *
V = {'edo_g': ('a10', 'a01'), 'edo_h': ('a10', 'a06'), 'edo_i': ('a08', 'a01'), 'edo_j': ('b03', 'a06')}
for n, (g, f) in V.items(): mc.YOUNG['v_' + n] = .85; head(f, 'full', .65, TAN, 'v_' + n, (.04, .035, .03), .8); cards(g, 'v_' + n, (.04, .035, .03)); print(n)
