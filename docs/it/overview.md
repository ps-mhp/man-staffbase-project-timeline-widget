# Piano del progetto

Questo widget mostra un piano di progetto come una **timeline** — come la roadmap
un lancio di veicoli con fiere commerciali, serie di avvii (SOP) e
traguardi del progetto nel corso di diversi anni. Sostituisce la diapositiva PowerPoint, 
che finora è stato mantenuto per tali piani e integrato come un'immagine: Il Piano
è direttamente sulla pagina, può essere cambiata in qualsiasi momento e i lettori
Puoi esplorarlo da solo, filtrarlo e scaricarlo come foglio di calcolo Excel. 

L'intero piano è mantenuto nell'**Editor del piano**, che viene visualizzato quando il
impostazioni da sole. 

## Di cosa consiste un piano

- **Intestazione** — opzionale; si trova sopra la pianta e fornisce il file Excel
  il loro nome. 
- **Livelli** — percorsi orizzontali tra loro, ad esempio "Misurare", 
  "Lanci / SOP" e "Traguardi del Progetto". A sinistra c'è il loro titolo. 
- **Categorie** — danno alle voci il loro colore e appaiono come una leggenda
  sopra il piano, ad esempio "MY26 TG Assist" in viola. 
- **Voci** in tre tipi: 
  - **Milestone** — una singola data, mostrata come simbolo (rombo, 
    triangolo, quadrato o cerchio) con il titolo qui sotto. 
  - **Punto** — una barra dall'inizio alla fine, con un
    Punta di freccia alla fine per "continua a correre". 
  - **Deadline** — una data che si applica a tutti i livelli, come uno nuovo
    regolamentazione. Appare come una linea verticale tratteggiata attraverso l'intero
    Piano, con il titolo qui sotto. 
- **Serie** — Traguardi e periodi dello stesso livello con lo stesso
  I nomi delle serie sono su una linea comune. Se include un periodo di tempo, 
  le pietra miliare si trovano sulla sua trave; altrimenti strette
  Fai la prima con l'ultima. 
- **Dipendenze** — linee tratteggiate con freccia dal predecessore del
  successore, ad esempio da "C4S" alla SOP associata. 
- **Preliminare** — una voce la cui data non è ancora stata determinata. Essa
  appare solo come contorno o riempito di bordi tratteggiati in modo brillante. 

## Cosa vedono i lettori

Dall'alto verso il basso: 

1. **Intestazione** (se impostato) e **"Stato: ..."** — la data dell'ultimo
   Modifica il piano, nel formato di data della lingua della pagina. 
2. **Barra degli strumenti** — Cerca, **Filtro**, Zoom (**−**, **+**, **Tutti
   mostrare**), il toggle **Timeline | List** e **Export**. 
3. **Leggenda** — categorie con il loro colore. Un clic mostra un
   Categoria spenta o riattivata. 
4. **Il piano** — a sinistra i titoli dei livelli, a destra la linea temporale con il
   Voci, sotto l'ultimo livello i titoli delle date chiave. 
5. **Panoramica** — una striscia stretta che si estende per tutto il periodo. Un telaio
   mostra quale sezione viene attualmente vista. 

Inoltre: 

- **Zoom** è infinitamente variabile: tramite i pulsanti **−** e **+**, con il
  tasto Ctrl (Mac: ⌘) e la rotella del mouse oppure con due dita sul trackpad e
  schermo touch. L'asse cambia da anni a quarti e mesi a
  fino alle settimane del calendario e ai singoli giorni. 
- **Move** si fa trascinando con il mouse, con Shift e la rotella del mouse, 
  cancellando orizzontalmente o trascinando il fotogramma nella panoramica. 
- Un **clicca su una voce** ne apre i dettagli: tipo e data, 
  Categoria, livello, serie, descrizione, così come predecessori e successori. 
- **Filtri** e **Cerca** si applicano solo alla tua visita; salvati o
  nulla viene trasmesso agli altri. 
- **Lista** mostra le stesse voci di una tabella, ordinate per data — il
  Metodo più comodo per i lettori di schermo, schermi stretti e per la stampa. 
- **Export** scarica le voci come file Excel, a condizione che il
  L'esportazione è attivata nelle Impostazioni. 
- Una linea scura **"Today"** segna oggi, se
  è attivato e il tag è nella sezione visibile. 
- L'operazione funziona anche senza mouse: Tab salta nel piano, il
  Frecce passano tra le voci, Invio apre i dettagli, 
  **+** e **−** zoom, **0** mostra tutto. 
- Su schermi stretti (meno di 768 pixel di larghezza), filtri e
  I dettagli sono disponibili in un foglio dal basso, e **Lista** ed **Esporta** sono disponibili
  nel menù **Altro**. 
- **Senza voci, il widget non mostra nulla** — nessun fotogramma vuoto e
  Nessun messaggio di errore. 

## Quello che vedi nell'editor CMS

L'editor del piano include una **anteprima** in alto: la stessa linea temporale di su
della pagina, con zoom, ma senza filtri, elenca ed esporta. Clicca su un
L'inserimento nell'anteprima lo seleziona per la modifica. Come i lettori utilizzano il piano
Con tutti i filtri e l'esportazione, controlla nell'anteprima della pagina.