import sys; sys.path.insert(0, '.')
from make_chars import *
V = {'josto_a': ('a08', 'b02', 'full', .6, TAN, (.06, .045, .04), .3), 'josto_b': ('a08', 'a02', 'full', .55, TAN, (.06, .045, .04), .3), 'josto_c': ('b03', 'b02', 'full', .6, TAN, (.06, .045, .04), .3),
     'edo_a': ('b03', 'a06', 'jaw', 1.15, TAN, (.04, .035, .03), .9), 'edo_b': ('b03', 'b02', 'jaw', 1.15, TAN, (.04, .035, .03), .9), 'edo_c': ('b03', 'a10', 'jaw', 1.15, (1.08, 1.0, .93), (.04, .035, .03), .5),
     'dav_a': ('a10', 'a06', 'full', 1.25, TAN, (.05, .04, .035), .6), 'dav_b': ('a10', 'a02', 'full', 1.25, TAN, (.05, .04, .035), .6), 'dav_c': ('b02', 'a06', 'full', 1.25, TAN, (.05, .04, .035), .6)}
for n, (g, f, b, d, t, hc, br) in V.items(): head(f, b, d, t, 'v_' + n, hc, br); cards(g, 'v_' + n, hc); print(n)
