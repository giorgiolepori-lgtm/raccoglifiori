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

# Grand Theft Ufficio

`ufficio.html`: gioco in stile GTA visto dall'alto, ambientato in un ufficio. Si apre con un doppio clic o dal telefono, senza registrazione, e funziona anche offline.

- Sei una ragazza con occhiali, capelli neri lunghi, camicia bianca e jeans chiari.
- L'ufficio ha open space (grande tavolo con postazioni e computer), reception, sala riunioni, cucina, bagno, archivio e ufficio del capo.
- Cinque colleghi girano per le stanze e ti assillano con tasse, clienti e cose da fare: il Ragioniere Anziano, il Pelato, il Trentenne, la Segretaria (riccia, sulla sessantina) e la Ragazza in Pigiama.
- Ogni colpo dà punti. I punti si spendono nel negozio sul computer della **tua postazione** (punto verde € sulla mappa). Più l'arma è forte e costosa, più punti dà a colpo.
- Armi: pugni, spillatrice, tastiera, fionda di elastici, mazza, estintore, sparachiodi, katana, lanciarazzi e **Death Note**: scrivi il nome di un collega e come morirà, e succede davvero (se scrivi una stanza, ci va da solo).
- I colleghi eliminati ricompaiono in un'altra stanza come se niente fosse.
- Comandi touch sempre visibili (joystick, COLPISCI, ARMA, CORRI, NEGOZIO). Da tastiera: `WASD`/frecce, `Spazio`, `Q`, `Shift`, `E`, `1`–`0`.
