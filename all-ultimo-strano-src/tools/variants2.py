import sys; sys.path.insert(0, '.')
from make_chars import *
AV['s02'] = ('Professions__Sports_Male_02', 'm301'); AV['b06'] = ('Professions__Business_Male_06', 'm025')
V = {'edo_d': ('b03', 's02', 'jaw', 1.6, TAN, (.04, .035, .03), .9), 'edo_e': ('b03', 'a01', 'jaw', 1.6, TAN, (.04, .035, .03), .9), 'edo_f': ('b03', 'a06', 'jaw', 1.6, TAN, (.04, .035, .03), .9),
     'dav_d': ('b02', 'a01', 'full', 1.25, TAN, (.05, .04, .035), .6), 'dav_e': ('b02', 's02', 'full', 1.25, TAN, (.05, .04, .035), .6), 'dav_f': ('b02', 'b06', 'full', 1.25, TAN, (.05, .04, .035), .6)}
for n, (g, f, b, d, t, hc, br) in V.items(): head(f, b, d, t, 'v_' + n, hc, br); cards(g, 'v_' + n, hc); print(n)
