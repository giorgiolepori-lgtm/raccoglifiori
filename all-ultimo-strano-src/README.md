# Sorgenti di All'ultimo strano

Il gioco pubblicato è `../all-ultimo-strano.html` (un unico file). Qui ci sono i sorgenti e gli strumenti per rigenerarlo.

## Struttura

- `game/src/`: codice del gioco, unito in quest'ordine: `engine.js` (renderer, avatar, pose con cinematica inversa),
  `fight.js` (pose, mosse, lottatori, IA), `fx.js` (effetti e mosse speciali), `arenas.js` (arene), `audio.js` (musica e suoni sintetizzati),
  `chars.js` (personaggi, frasi, pose delle scene), `ui.js` (HUD e comandi), `match.js` (incontro, round, telecamera), `main.js` (menù e flusso).
- `game/src/assets.js`: mesh compatte e texture dei personaggi (generato).
- `game/template.html`: pagina e stile; `lib/`: three.js r128, fflate, FBXLoader (MIT).
- `tools/`: pipeline dei personaggi.

## Rigenerare

```
python3 tools/build_game.py            # ricrea ../all-ultimo-strano.html dai sorgenti
```

Per rifare i personaggi servono i file Microsoft Rocketbox (licenza MIT) in `build/rb/` e le texture convertite in `build/tex/`
(i nomi dei file sono in `tools/avatars.js` e `tools/textures.py`), poi:

```
python3 -m http.server 8765            # dalla cartella che contiene build/ e game/
python3 tools/make_alex_zonco.py       # texture: carnagione, barba, occhi, vestiti senza loghi
node tools/avatars.js                  # unisce testa e corpo dei modelli e li comprime (tools/meshes.json)
python3 tools/bundle_assets.py         # crea game/src/assets.js
```

`tools/play.js` e `tools/mobile.js` aprono il gioco con Playwright e scattano foto per i controlli.
