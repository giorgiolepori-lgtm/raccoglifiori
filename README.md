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

# Il Cammino di Bruno

`cammino-di-bruno.html` è un gioco in stile avventura a quadretti: Bruno, con uno zaino da 10 kg,
si allena per il Cammino di Santiago andando a piedi da Maracalagonis a Porto Sa Ruxi (Villasimius).
Si apre con un doppio clic e funziona anche offline.

- Il percorso segue le tappe reali: Maracalagonis → colline → Mari Pintau → Geremeas → Torre delle Stelle → Solanas → Porto Sa Ruxi, lungo la litoranea SP17.
- In ogni zona c'è un bar: per proseguire Bruno deve bere un latte e menta, ma davanti al bar un amico lo sfida.
- Sfide: scacchi (matto in una mossa), braccio di ferro, cucina, arrampicata, brazilian jiu-jitsu, FIFA (rigori) e, alla meta, poker contro tutta la banda.
- Camminare consuma energia (lo zaino pesa!): fontanelle e latte e menta la ricaricano.
- I nomi degli amici si cambiano nella lista `AMICI` all'inizio dello script.

# Petalini

`petalini.html`: piccolo gioco di cattura e lotta a turni con creature originali nate dai fiori.
