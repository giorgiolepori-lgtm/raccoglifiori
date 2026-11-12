# Raccogli Fiori

Gioco 3D nel browser: cammini in un prato al tramonto e raccogli più fiori che puoi in 60 secondi.

- Grafica 3D con Three.js: erba mossa dal vento, alberi, laghetto, farfalle, polline e nuvole.
- Musica di pianoforte ambient generata in tempo reale (stile Minecraft), canto degli uccelli e vento.
- Due modalità: **Gioca** (60 secondi, con record) e **Passeggiata libera** (di giorno, senza tempo e senza mostro).
- In **Gioca**, dopo 10 secondi cala la notte, la musica diventa tetra e un mostro esce dal bosco e ti insegue,
  sempre più veloce. Correre consuma il fiato (barra gialla). Se ti prende la partita finisce;
  se resisti fino alla fine guadagni 15 punti bonus.
- Mani in prima persona: quando raccogli un fiore la mano si allunga e il fiore finisce nel mazzo che tieni nell'altra mano.
- Fiori: margherita (1), papavero (2), tulipano (2), fiordaliso (3), girasole (5), fiore d'oro (10).
  Per raccogliere un fiore avvicinati e premi **Raccogli** (o `E`). Raccogliendo fiori di fila il moltiplicatore sale fino a ×5.

## Come giocare

Apri `index.html` in un browser moderno (serve la connessione per caricare Three.js e i font).

- Computer: `WASD` o frecce per camminare, mouse per guardarti intorno, `E`/`Spazio`/clic per raccogliere, `Shift` per correre, `Esc`/`P` per la pausa.
- Telefono/tablet: tasti ▲ ▼ per camminare e ◀ ▶ per girarti, tasto **Corri**, tasto **Raccogli** (si accende quando un fiore è a portata); trascina il dito sullo schermo per guardarti intorno.

## Versione senza internet

`raccogli-fiori.html` è lo stesso gioco in un unico file, con Three.js già incluso:
si apre con un doppio clic e funziona anche offline (senza rete usa i font di sistema).

---

# All'ultimo strano

`all-ultimo-strano.html`: picchiaduro in 3D in stile Tekken, pensato per il telefono in orizzontale (funziona anche da computer).
È un unico file (circa 1,9 MB): si apre dal browser, anche offline. Sorgenti e strumenti in `all-ultimo-strano-src/`.

- **La classifica degli strani**: gli strani si sfidano per il titolo di più strano, con un premio in denaro.
- **Modalità**: Arcade (gli altri personaggi uno dopo l'altro, con la motivazione all'inizio e il finale del personaggio),
  Battaglia libera contro il computer (scelta di avversario, arena e difficoltà). Online in arrivo.
- **Personaggi pronti**: Alex (arena Capoterra, mossa speciale: la Fiat Punto blu) e Zonco (arena Quartello, mossa speciale:
  pallonata in faccia mentre svapa). In arrivo: Bruno, Edo, Pet, Josto, Davidino, Gio.
- Modelli 3D realistici costruiti dai modelli Rocketbox (testa e corpo uniti, carnagione, barba, occhi e vestiti rifatti),
  animati con pose a cinematica inversa: guardia, diretti, ganci, montante, calcio basso, tiro al volo, punta, scivolata, prese, salti.
- Colpi alti, medi e bassi, parate (stando fermi o indietro; accucciati per i bassi), contrattacchi, combo, cadute e rialzate.
- Mossa speciale come in Tekken: quando l'energia scende sotto un quarto compare il tasto SPECIALE, una volta per round.
- Frasi di inizio, vittoria e sconfitta come sottotitoli; musica da combattimento e suoni generati in tempo reale.
- **Comandi touch**: joystick a sinistra (tocco breve su/giù = passo laterale, su tenuto = salto, doppio avanti = scatto),
  pugno sinistro/destro e calcio sinistro/destro a destra, PRESA, SPECIALE, pausa.
  Da computer: frecce o WASD, `U`/`I` pugni, `J`/`K` calci, `O` presa, `L` speciale, `Esc` pausa.

Crediti: modelli 3D [Microsoft Rocketbox Avatar Library](https://github.com/microsoft/Microsoft-Rocketbox) (MIT), three.js r128 e fflate (MIT).
