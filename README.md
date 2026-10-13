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

`ufficio.html`: gioco in 3D in stile GTA ambientato in un ufficio, con la telecamera alle spalle del personaggio.
È un unico file (circa 9 MB, con Three.js, modelli e texture inclusi): si apre dal browser del telefono o del computer, senza registrazione, anche offline (la partita online richiede internet).

- All'inizio scegli con chi giocare: una ragazza con occhiali, lunghi capelli neri, camicia bianca e jeans chiari,
  oppure un ragazzo con i capelli neri in tuta Adidas nera a tre strisce. Ti vedi da dietro le spalle.
- L'ufficio ha open space (un unico grande tavolo con postazioni e computer), reception, sala riunioni, cucina, bagno, archivio e ufficio del capo.
- Persone realistiche (modelli 3D con pelle, capelli e vestiti veri) con animazioni in motion capture per camminare, correre, parlare e gesticolare.
- Cinque colleghi girano per le stanze e vengono a parlarti (con la voce del dispositivo, senza fumetti) di tasse, clienti e cose da fare:
  un uomo anziano, uno pelato, un ragazzo sui 30 anni, una segretaria riccia sulla sessantina e una ragazza sui 30 in pigiama con gli occhiali.
- Quando li colpisci si lamentano e scappano; nessuna barra della vita. Chi muore resta a terra e rientra dall'ingresso solo dopo un po', ogni volta più tardi.
- Ogni colpo dà punti. I punti si spendono nel negozio sul PC della **tua postazione** (cerchio verde e simbolo €). Più l'arma è forte e costosa, più punti dà.
- Armi (prezzi da 15 a 3.200 punti): pugni, tastiera, padella, merluzzo surgelato, mazza da baseball, coltello, taser, pistola, estintore a schiuma, katana, lanciatorte,
  fucile a pompa, motosega, mitragliatrice, bomba ai coriandoli, lanciafiamme, lanciarazzi e **Death Note** (5.000 punti)
  (scegli il volto di un collega e scrivi come morirà: succede davvero; se scrivi una stanza, ci va da solo).
- **Online a due giocatori**: premete «Gioca online» nello stesso momento su due dispositivi (con lo stesso codice stanza, se volete trovarvi tra voi).
  Partite entrambi da zero, con gli stessi colleghi e lo stesso negozio, e vi contendete i punti. Potete attaccarvi: chi fa fuori l'altro
  si prende tutti i suoi punti e le sue armi, e chi muore rientra poco dopo in un'altra stanza. Nel Death Note compare anche il volto dell'avversario.
  I progressi della partita da solo restano salvati a parte. Serve internet: i messaggi passano da un server MQTT pubblico e gratuito
  (broker.emqx.io, in alternativa broker.hivemq.com o test.mosquitto.org), senza registrazione.
- In sottofondo: condizionatore, tastiere, telefoni, stampante, macchina del caffè e brusio.
- Comandi touch sempre visibili (joystick, trascina a destra per guardare, COLPISCI, ARMA, CORRI, NEGOZIO).
  Da computer: `WASD`, mouse per guardare (clic sullo schermo), clic/`Spazio` per colpire, `Q`, `Shift`, `E`, `1`–`0`.

### Crediti

- Persone 3D e animazioni motion capture: [Microsoft Rocketbox Avatar Library](https://github.com/microsoft/Microsoft-Rocketbox) (licenza MIT).
- Three.js r128, FBXLoader, fflate e le texture di parquet e piastrelle: [three.js](https://github.com/mrdoob/three.js) (licenza MIT).
- Foto del parco fuori dalle finestre: Emil Persson ("Humus", http://www.humus.name), licenza Creative Commons Attribution 3.0.
