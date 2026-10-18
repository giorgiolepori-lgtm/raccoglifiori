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

# Macchina del Tempo

`macchina-del-tempo.html` è un videogioco 3D in prima persona (Three.js). Scrivi un luogo e una data
e Claude progetta la scena: architettura, materiali, abiti, oggetti, animali, persone, ora del giorno,
meteo e suoni. Il motore la costruisce con texture e rilievi procedurali, ombre, riflessi del cielo e nebbia.

- Comandi: tasti a schermo ▲ ▼ ◀ ▶ (o WASD/frecce), trascina per guardarti intorno, tasto rosso per
  **Parla**, **Tocca** o **Osserva** (o `E`), **Corri** (o Shift). Gli oggetti piccoli vanno nello zaino.
- Le persone rispondono davvero, interpretate da Claude, e sanno solo ciò che si sapeva nella loro epoca.
- Otto destinazioni pronte partono subito: Roma (80 d.C.), Pompei (79 d.C.), Giza (2560 a.C.),
  Venezia (1295), Firenze (1504), Parigi (1889), il Cretaceo e Roma nella notte dell'allunaggio (1969).

Le destinazioni libere e le conversazioni funzionano con la pagina aperta come Artifact su claude.ai;
le destinazioni pronte funzionano anche aprendo il file nel browser.
