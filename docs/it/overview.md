# Piano di progetto

Questo widget mostra un piano di progetto sotto forma di **linea temporale** — ad esempio il calendario
del lancio di un veicolo con fiere, avviamenti della produzione in serie (SOP) e
traguardi del progetto nell’arco di diversi anni. Sostituisce la diapositiva PowerPoint,
che finora veniva aggiornata per tali piani e inserita come immagine: il piano
è direttamente sulla pagina, può essere modificato in qualsiasi momento e i lettori
possono esplorarlo autonomamente, filtrarlo e scaricarlo come foglio di calcolo Excel.

L’intero piano viene gestito nell’**editor di piani**, che si apre automaticamente all’apertura delle
impostazioni.

## Da cosa è composto un piano

- **Titolo** — facoltativo; si trova sopra il piano e dà al file Excel
  il suo nome.
- **Livelli** — righe orizzontali una sotto l’altra, ad esempio «Misurazioni»,
  «Lanci / SOP» e «Tappe fondamentali del progetto». A sinistra compare il titolo di ciascuna.
- **Categorie** — assegnano un colore alle voci e appaiono come legenda
  sopra il piano, ad esempio «MY26 TG Assist» in viola.
- **Voci** di tre tipi:
  - **Traguardo** — una singola data, rappresentata da un simbolo (rombo,
    triangolo, quadrato o cerchio) con il titolo sottostante.
  - **Periodo** — una barra dall’inizio alla fine, se lo si desidera con una
    punta di freccia all’estremità per indicare che «è in corso».
  - **Data di riferimento** — una data valida per tutti i livelli, ad esempio una nuova
    normativa. Appare come una linea verticale tratteggiata che attraversa l’intero
    piano, con il titolo sottostante.
- **Serie** — le tappe fondamentali e i periodi dello stesso livello con lo stesso
  nome di serie sono riportati su una riga comune. Se un periodo fa parte della serie,
  le tappe fondamentali si trovano sulla sua barra; altrimenti, una sottile
  barra collega la prima all’ultima.
- **Dipendenze** — linee tratteggiate con freccia dal predecessore al
  successore, ad esempio da «C4S» al relativo SOP.
- **Provvisorio** — una voce la cui data non è ancora stata fissata.
  Appare solo come contorno o con riempimento chiaro e bordo tratteggiato.

## Cosa vedono i lettori

Dall’alto verso il basso:

1. **Titolo** (se impostato) e **«Aggiornato al: …»** — la data dell’ultima
   modifica al piano, nel formato data della lingua della pagina.
2. **Barra degli strumenti** — Ricerca, **Filtri**, Zoom (**−**, **+**, **Mostra tutto
  **), il pulsante di commutazione **Linea temporale | Elenco**, **Esporta**,
   **Schermo intero** e **Aiuto**.
3. **Legenda** — le categorie con i relativi colori. Un clic nasconde o
   mostra nuovamente una categoria.
4. **Il piano** — a sinistra i titoli dei livelli, a destra la linea temporale con le
   voci, sotto l’ultimo livello i titoli delle date di riferimento. La freccia accanto al
   titolo nasconde un livello; **Nascondi tutto** sopra i titoli nasconde
   tutti i livelli contemporaneamente e poi li mostra nuovamente.
5. **Panoramica** — una striscia sottile che copre l’intero periodo. Una cornice
   indica quale sezione è attualmente visibile.

Inoltre:

- Lo **zoom** è continuo: tramite i pulsanti **−** e **+**, tenendo premuto il
  tasto Ctrl (Mac: ⌘) e utilizzando la rotellina del mouse o con due dita sul trackpad e
  sul touchscreen. L’asse passa da anni a trimestri e mesi fino
  a settimane di calendario e singoli giorni.
- È possibile **spostare** trascinando con il mouse, con il tasto Maiusc e la rotellina del mouse,
  scorrendo orizzontalmente o trascinando la cornice nella panoramica.
- Un **clic su una voce** ne apre i dettagli: tipo e data,
  categoria, livello, serie, descrizione, nonché predecessore e successore.
- **Filtro** e **ricerca** si applicano solo alla propria sessione; nulla viene salvato o
  condiviso con altri.
- **Elenco** mostra le stesse voci sotto forma di tabella, ordinate per data: il
  modo più comodo per gli screen reader, gli schermi stretti e per la stampa.
- **Esporta** scarica le voci come file Excel, a condizione che l’
  esportazione sia attivata nelle impostazioni.
- Una linea scura **«Oggi»** evidenzia il giorno corrente, a condizione che sia
  attivata e che il giorno si trovi nella sezione visibile.
- È possibile navigare anche senza mouse: il tasto Tab permette di passare al calendario, i
  tasti freccia consentono di spostarsi tra le voci, Invio apre i dettagli,
  **+** e **−** ingrandiscono o rimpiccioliscono la visualizzazione, **0** mostra tutto.
- Sugli schermi stretti (larghezza inferiore a 768 pixel) il programma inizia nell’
  **Elenco** — sotto forma di schede anziché di tabella, poiché la linea temporale lì non ha
  larghezza; il pulsante di commutazione nel menu **Altro** porta in qualsiasi momento alla linea temporale.
  Allo stesso modo, i filtri e i dettagli si aprono come una scheda dal bordo inferiore, e
  **Elenco** ed **Esporta** si trovano nel menu **Altro**.
- **Schermo intero** mostra il piano a tutto schermo, con le stesse
  funzionalità; solo il piano stesso scorre, mentre l’asse e la panoramica rimangono fissi.
  **Esc** o **Esci da schermo intero** riportano alla pagina. Laddove il browser non
  consente una vera modalità a schermo intero (ad esempio Safari su iPhone), il piano si estende su
  tutta la pagina.
- **Aiuto** spiega ai lettori direttamente nella pagina il significato dei simboli
  (scheda **Legenda**, con le categorie di questa mappa) e come utilizzare la
  mappa con mouse, trackpad, touch e tastiera (scheda **Funzionamento**).
  Anche dal piano, il tasto **?** apre la guida. Nell’editor del piano
  questo pulsante non è presente.
- **Senza voci, il widget non mostra nulla** — né una cornice vuota né
  un messaggio di errore.

## Cosa vedete nell’editor CMS

L’editor del piano contiene in alto un’**anteprima**: la stessa timeline presente sulla
pagina, con lo zoom, ma senza filtri, elenco ed esportazione. Cliccando su una
voce nell’anteprima, questa viene selezionata per la modifica. Per verificare come i lettori vedranno il piano
con tutti i filtri e la funzione di esportazione, controllate l’anteprima della pagina.
