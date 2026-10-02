# Ambientazioni

La finestra di configurazione del widget ha tre campi. "Plan" è visualizzato nel
l'editor di piani, che si mostra aprendo le impostazioni; 
Il campo di testo dietro è la versione tecnica grezza e non dovrebbe essere fatto a mano.
può essere modificata. I due campi rimanenti sono direttamente nel dialogo. Il
L'intestazione del piano non è un campo del dialogo, ma viene visualizzata nell'editor del piano
(vedi sotto). 

| Attributo | Etichetta nel dialogo | Descrizione |
| --- | --- | --- |
| 'plan' | Piano | Intestazione, livelli, categorie, voci e la vista iniziale. Mantenuti nell'editor di piani. Predefinito: vuoto. |
| 'mostra-oggi' | Linea mostra oggi | Una linea verticale scura con "Today" nell'asse segna today, se è nella sezione visibile. Predefinito: on. |
| 'permette-esportazione' | Offri esportazione Excel | Mostra ai lettori il pulsante **Esporta**, che usano per scaricare le voci come foglio di calcolo Excel. Predefinito: attivo. |

## Il Direttore dei Piani

L'editor di piani riempie tutto lo schermo. In alto c'è la barra dell'intestazione sotto.
la **Anteprima** e tre schede. Tra Anteprima e schede, e tra
Lista delle iscrizioni e modulo hanno ciascuna una maniglia di tiratura con cui l'altezza del
e modificare la larghezza della lista (mouse o tasti freccia, 
Il doppio clic ripristina il valore predefinito; il browser ricorda le dimensioni). 

### Header

| Elemento di controllo | Descrizione |
| --- | --- |
| Intestazione | Si trova sopra la pianta e dà il nome al file Excel. Opzionale: Lasciare vuoto se la pagina ha già un titolo adatto; il file viene quindi chiamato 'Projektplan_JJJJ-MM-TT.xlsx'. |
| "42 / 300 iscrizioni" | Quante iscrizioni contiene il piano, misurate rispetto al limite superiore. |
| "Modifiche non salvate" | Appare non appena il piano nell'editor differisce da quello salvato. |
| Annullare | Chiude l'editor; nel caso di modifiche non salvate, chiede in anticipo se dovrebbero essere scartate. |
| Applica | Scrivi il piano nelle impostazioni e chiudi l'editor. Viene salvato insieme alla pagina. |

### Visione veloce

| Elemento di controllo | Descrizione |
| --- | --- |
| Anteprima | La stessa linea temporale della pagina, con zoom, senza filtro e senza esportazione. Cliccando su una voce la seleziona nella scheda "Entrazioni" e la porta in vista nell'elenco. Cliccando su **Anteprima** la comprime; spiegata ha l'ultima altezza disegnata. |
| Questa sezione come vista iniziale | Salva la sezione visibile dell'anteprima, fino al mese, come visualizzazione quando la pagina si carica. |
| Rimuovi la vista Start | Elimina la vista principale; il widget mostra di nuovo l'intero piano durante il caricamento. |
| Inizia con Template | Solo se il piano è vuoto: mostra i template tra cui scegliere ("Product Roadmap", "Rischedul"). Cliccando su una scheda si riempie l'editor con essa; **Return** restituisce senza modifica. |
| Inizia vuoto | Solo se il piano è vuoto: crea un livello "Livello 1". |

### Scheda "Voci" 

A sinistra c'è l'elenco delle voci, ordinate per data. Sopra di essa sono
**Sfoglia le voci** e sotto di essa un interruttore per il tipo — 
**Traguardi**, **Periodi**, **Scadenze**, ciascuno con numero (se attivo
cerca: hits); il pulsante **+** accanto a essa crea una voce di questo tipo, 
e la ricerca funziona all'interno della specie. 
Quando si passa il mouse sopra una riga, appare un cestino del riciclo a destra per la cancellazione (con
Query). 

A destra, la forma della voce selezionata; sopra di essa c'è il titolo e
i pulsanti **Duplica** e **Cancella**, sotto i quali si trovano le schede **Generali** 
(Tipo, Titolo, Descrizione), **Classificazione** (Livello, Categoria, Serie), 
**Data** (data o inizio e fine, per la freccia del punto alla fine, provvisoria)
**Dipendenze** e **Contenuto** (pagina collegata o post di notizie). A
il punto rosso sulla scheda mostra una voce non valida; per le date chiave
**Dipendenze** eliminate: 

| Campo | Si applica a | Descrizione |
| --- | --- | --- |
| Tipo | Tutti | Milestone, Periodo o Scadenza. Se cambi la scadenza, il livello viene omesso. |
| Titolo | Tutti | Obbligatorio. Scritto sulla voce e nei dettagli. |
| Descrizione | Tutti | Opzionale, multi-linea. Appare solo nei dettagli e nell'esportazione Excel. |
| Livello | Milestone, Punto | Il livello in cui si trova l'ingresso. **Nuovo livello ...** ne crea uno (nome) e lo assegna immediatamente. |
| Categoria | tutti | Determina il colore e per le milestone la forma. "Senza categoria" appare grigio, milestone come un diamante. **Nuova categoria ...** ne crea una (nome, colore e forma) e la assegna immediatamente. |
| Data | Pietra miliare, scadenza | La data. |
| Inizio, fine | Punto | Primo e ultimo giorno; entrambi appartengono al periodo. |
| Freccia alla fine | Punto | La barra termina con una punta di freccia — "corre avanti". |
| Serie | Pietra miliare, Periodo | Le voci dello stesso livello con lo stesso nome della serie sono su una riga. Il campo espande la serie di questo livello con il numero delle loro voci; un nuovo nome digitato viene preso tramite ""..." create come una nuova serie", **Nessuna serie** elimina la voce. |
| Provvisorio | tutti | La data non è ancora stata fissata; la voce appare come contorno o con un bordo tratteggiato. |
| Dipende da | Milestone, Punto | I predecessori della voce; sulla pagina come una linea tratteggiata con una freccia. |
| Link | tutti | **Nessuno**, **Pagina** o **Articolo di notizie**. Un cambiamento interrompe un collegamento esistente. Sulla pagina, l'iscrizione della voce viene poi sottolineata, e un clic apre il contenuto in una finestra sopra il piano. |
| Pagina | Tutti | La pagina Staffbase dalla lista delle pagine (le 100 più recenti modificate). **Nuova pagina ...** la crea nell'editor Staffbase, che sovrappone l'editor del piano; dopo averla creata, viene collegata. |
| Canale, Post | tutti | Prima il canale di notizie (con il suo tipo: articolo, breve messaggio, post immagine), poi il post. Le bozze sono selezionabili e contrassegnate con "(bozza)" — i lettori le vedono solo dopo la pubblicazione. **Nuovo post ...** ne crea uno nel canale selezionato; dopo aver salvato, viene collegato. **Apri in una nuova scheda** mostra il contenuto collegato. |
| Allegati | Tutti | Fino a dieci file o immagini dalla libreria multimediale, ciascuno con didascalia opzionale (altrimenti il nome del file). **Aggiungi file o immagine ...** apre la libreria; **↑**/**↓** dispongono, **×** rimosso. Gli allegati rimangono dietro l'accesso. Sulla pagina, sono accanto al contenuto collegato o nei dettagli, nell'esportazione Excel nella colonna "Allegati". |
| Duplicato | Tutti | Crea una copia della voce. |
| Elimina | tutti | Chiede e poi rimuove la voce e tutte le dipendenze che vi indicano; la query nomina le voci dipendenti. |

### Scheda Strati 

| Elemento di controllo | Descrizione |
| --- | --- |
| Nuovo livello | Nell'angolo in alto a destra della scheda. Crea un nuovo livello. |
| Nome | Il nome dello strato, a sinistra della sua orbita. Deve essere unico. Accanto c'è quante voci contiene. |
| Frecce su/giù | Ordina sulla pagina e in Export. |
| Elimina | Rimuove il livello. Se contiene voci, l'editor chiede se dovrebbero essere spostate su un altro livello (seleziona **Target Layer**) o se dovrebbero essere eliminate anche loro. |

### Scheda "Categorie" 

| Elemento di controllo | Descrizione |
| --- | --- |
| Nuova categoria | In alto a destra della scheda. Crea una nuova categoria. |
| Campo Colore | Davanti al nome; mostra il colore. Un clic espande i dodici colori e il campo **Valore Esadecimale**; Esc o un clic accanto si chiude. |
| Valore esagonale | Un colore personalizzato nel formato '#RRGGBB', ad esempio '#E40045'. |
| Pulsante Forma | Accanto al campo colore; mostra la forma con cui appaiono le pietra miliare della categoria. Un clic apre le otto forme: rombo, triangolo, triangolo con la punta verso il basso, quadrato, cerchio, esagono, stella o croce. I tasti freccia cambiano la forma. |
| Nome | Il nome nella legenda e nei dettagli. Deve essere unico. Accanto c'è il numero di voci a cui è assegnata la categoria. |
| Frecce su / giù | Ordine della leggenda. |
| Elimina | Rimuove la categoria; le sue voci diventano "senza categoria". La query fornisce il suo numero. |

## Confini

- Un piano ha un massimo di **300 iscrizioni**, **20 livelli** e
  **24 categorie**. Oltre a questo, l'editor non accetta più nulla. 
- Gli appuntamenti sono **intere giornate** senza tempo. La visuale iniziale è
  **Mensile**. 
- Il testo non è mai del colore della categoria — colori vivaci come il giallo rimangono
  altrimenti illegibile sul bianco. Il colore è rilevato solo dalla forma, dalle barre e
  punto leggenda; la scrittura nel bar è in bianco o nero, a seconda di cosa
  è più facile da leggere. 
- **Senza voci, il widget non mostra nulla** — né un frame vuoto né
  Un messaggio. 

## Dipendenze tra ambientazioni

- **Linea Mostra oggi** funziona solo se oggi è visibile
  estratto. Nel caso di un piano che sia completamente passato o
  Future, la linea può quindi essere vista solo dopo essere stata spostata. 
- L'**intestazione** determina anche il nome del file Excel; senza
  Funziona solo come titolo. 
- **Heading** e **Home view** sono impostati nell'editor di piani, non nel
  dialogo; entrambi fanno parte del piano.