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
È un unico file (circa 11 MB): si apre dal browser, anche offline (tranne la modalità online). Sorgenti e strumenti in `all-ultimo-strano-src/`.

- **La classifica degli strani**: gli strani si sfidano per il titolo di più strano, con un premio in denaro.
- **8 personaggi, 27 vestiti a scelta**: Alex, Bruno, Edo, Pet, Zonco, Josto, Davidino e Gio, ognuno con il suo stile di lotta
  (standard con calci da calciatore, MMA, Muay Thai, Brazilian Jiu Jitsu, Kickboxing, Karate Shotokan), la sua guardia,
  le sue frasi (sottotitoli) e la sua mossa speciale.
- **10 arene**: Capoterra, Porto Sa Ruxi, Maracalagonis, Zona musicisti, Padova, Banari, Quartello, Viale Colombo, Niu Crobu, Pitz'e Serra
  (cartello con il nome in tutte tranne Porto Sa Ruxi).
- **Modalità**: Arcade (tutti gli altri personaggi nelle loro arene, motivazione all'inizio e finale del personaggio),
  Battaglia libera contro il computer, **Online** (sala d'attesa con chi è collegato, sfida diretta, partita veloce, codice stanza,
  chat con frasi rapide, rivincita).
- **Mosse speciali** (tasto SPECIALE quando l'energia scende sotto un quarto, una volta per round): Fiat Punto blu (Alex),
  latte e menta gigante dal cielo (Bruno), calci alle caviglie con aura blu (Edo), attacco telepatico rosso (Pet),
  pallonata con svapo (Zonco), telecamera da spalla che fa esplodere (Josto), braccio di ferro in piedi (Davidino),
  spray al peperoncino (Gio).
- **Comandi touch**: joystick a sinistra (tocco breve su/giù = passo laterale, su tenuto = salto, doppio avanti = scatto),
  pugno sinistro/destro e calcio sinistro/destro a destra, PRESA, SPECIALE, pausa in alto a destra.
  Da computer: frecce o WASD, `U`/`I` pugni, `J`/`K` calci, `O` presa, `L` speciale, `Esc` pausa.

### Online

I messaggi passano da server MQTT pubblici e gratuiti (broker.emqx.io, in alternativa broker.hivemq.com o test.mosquitto.org),
senza registrazione. Chi lancia la sfida fa girare l'incontro e manda all'altro telefono i comandi di entrambi; ogni mezzo secondo
manda anche posizioni, energia e round per tenere i due incontri allineati. Serve aprire il gioco come file o da un sito normale:
nell'anteprima di claude.ai i collegamenti esterni sono bloccati e l'online non si connette.

Crediti: modelli 3D [Microsoft Rocketbox Avatar Library](https://github.com/microsoft/Microsoft-Rocketbox) (MIT), three.js r128 e fflate (MIT).
