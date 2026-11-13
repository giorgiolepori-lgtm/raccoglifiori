# Assembla il gioco in un unico file HTML
import os, sys
G = os.path.dirname(os.path.abspath(__file__)) + '/../game/'
out = sys.argv[1] if len(sys.argv) > 1 else G + '../../all-ultimo-strano.html'
t = open(G + 'template.html').read()
L = os.path.dirname(os.path.abspath(__file__)) + '/../lib/'
libs = ''.join('<script>' + open(L + f).read() + '\n</script>\n' for f in ['three.js', 'fflate.js'])
libs = '<script>/* three.js r128 (MIT) */</script>\n' + libs + '<script>' + open(G + 'src/assets.js').read() + '</script>\n'
order = ['engine.js', 'fight.js', 'fx.js', 'arenas.js', 'arenas2.js', 'audio.js', 'chars.js', 'ui.js', 'match.js', 'net.js', 'main.js']
game = '<script>\n' + '\n'.join(open(G + 'src/' + f).read() for f in order) + '\n</script>'
html = t.replace('<!--LIBS-->', libs).replace('<!--GAME-->', game)
open(out, 'w').write(html); print(out, len(html))
