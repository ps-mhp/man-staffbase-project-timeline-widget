# Impostazioni

La finestra di dialogo di configurazione del widget presenta tre campi. “Piano” viene
gestito nell’editor del piano, che si apre automaticamente all’apertura delle impostazioni;
il campo di testo sottostante contiene la bozza tecnica e non deve essere modificato
manualmente. Gli altri due campi si trovano direttamente nella finestra di dialogo. Il
titolo del piano non è un campo della finestra di dialogo, ma viene gestito nell’editor del piano
(vedi sotto).

| Attributo | Etichetta nella finestra di dialogo | Descrizione |
| --- | --- | --- |
| `plan` | Piano | Intestazione, livelli, categorie, voci e vista iniziale. Viene gestito nell’editor del piano. Impostazione predefinita: vuoto. |
| `show-today` | Mostra linea “Oggi” | Una linea verticale scura con la scritta “Oggi” sull’asse contrassegna il giorno corrente, purché rientri nella sezione visibile. Impostazione predefinita: attiva. |
| `allow-export` | Consenti esportazione in Excel | Mostra ai lettori il pulsante **Esporta**, tramite il quale possono scaricare le voci come foglio di calcolo Excel. Impostazione predefinita: attiva. |

## L’editor del piano

L’editor del piano occupa l’intero schermo. In alto si trova la barra di intestazione, sotto
l’**anteprima** e tre schede. Tra l’anteprima e le schede, nonché tra
l’elenco delle voci e il modulo, è presente una maniglia di trascinamento che consente di modificare l’altezza dell’
anteprima e la larghezza dell’elenco (con il mouse o i tasti freccia;
un doppio clic ripristina le impostazioni predefinite; il browser memorizza le dimensioni).

### Barra di intestazione

| Elemento di controllo | Descrizione |
| --- | --- |
| Titolo | Si trova sopra il piano e assegna un nome al file Excel. Opzionale: lasciare vuoto se la pagina ha già un titolo appropriato; il file si chiamerà allora `Piano di progetto_AAAA-MM-GG.xlsx`. |
| «42 / 300 voci» | Indica il numero di voci presenti nel piano, rispetto al limite massimo. |
| «Modifiche non salvate» | Appare non appena il piano nell’editor differisce da quello salvato. |
| Annulla | Chiude l’editor; in caso di modifiche non salvate, chiede prima se si desidera scartarle. |
| Applica | Salva il piano nelle impostazioni e chiude l’editor. Viene salvato insieme alla pagina. |

### Anteprima

| Comando | Descrizione |
| --- | --- |
| Anteprima | La stessa linea temporale presente nella pagina, con zoom, senza filtri né esportazione. Cliccando su una voce, questa viene selezionata nella scheda «Voci» e visualizzata nell’elenco. Cliccando su **Anteprima** questa viene nascosta; una volta espansa, torna all’altezza impostata per ultima. |
| Imposta questa sezione come vista iniziale | Salva la sezione visibile dell’anteprima, con precisione mensile, come vista iniziale al caricamento della pagina. |
| Rimuovi vista iniziale | Elimina la vista iniziale; al caricamento, il widget mostra nuovamente l’intera mappa. |
| Inizia con un modello | Solo se la mappa è vuota: mostra i modelli tra cui scegliere («Roadmap del prodotto», «Rinvio della scadenza»). Cliccando su una scheda, questa viene inserita nell’editor; **Indietro** consente di tornare indietro senza apportare modifiche. |
| Inizia da zero | Solo se il piano è vuoto: crea un livello denominato «Livello 1». |

### Scheda «Voci»

A sinistra l’elenco delle voci, ordinato per data. Sopra si trovano
**Cerca voci** e sotto un selettore per il tipo —
**Traguardi**, **Periodi**, **Date di riferimento**, ciascuno con il numero (se la
ricerca: risultati); il pulsante **+** accanto crea una voce di quel tipo,
e la ricerca opera all’interno di quel tipo.
Passando con il mouse su una riga, a destra appare un cestino per l’eliminazione (con
richiesta di conferma).

A destra il modulo della voce selezionata; sopra di esso si trovano il titolo e
i pulsanti **Duplica** e **Elimina**, sotto le schede **Generale**
(Tipo, Titolo, Descrizione), **Classificazione** (Livello, Categoria, Serie),
**Data** (data o inizio e fine; in caso di intervallo, freccia alla fine, provvisorio)
**Dipendenze** e **Contenuto** (pagina collegata o articolo di notizie). Un
punto rosso sulla scheda indica un dato non valido al suo interno; nel caso delle date di riferimento
la voce **Dipendenze** non è disponibile:

| Campo | Valido per | Descrizione |
| --- | --- | --- |
| Tipo | tutti | Traguardo, periodo o data di riferimento. Passando alla data di riferimento, il livello non è più disponibile. |
| Titolo | tutti | Obbligatorio. Appare nella voce e nei dettagli. |
| Descrizione | tutti | Facoltativo, su più righe. Appare solo nei dettagli e nell’esportazione in Excel. |
| Livello | Traguardo, periodo | Il livello in cui si trova la voce. **Nuovo livello …** ne crea uno (nome) e lo assegna immediatamente. |
| Categoria | tutte | Determina il colore e, nel caso delle tappe fondamentali, la forma. «Senza categoria» appare in grigio, le tappe fondamentali come rombi. **Nuova categoria …** ne crea una (nome, colore e forma) e la assegna immediatamente. |
| Data | Traguardo, data di riferimento | La data. |
| Inizio, Fine | Periodo | Primo e ultimo giorno; entrambi fanno parte del periodo. |
| Freccia alla fine | Intervallo di tempo | La barra termina con una punta di freccia — «continua». |
| Serie | Traguardo, Intervallo di tempo | Le voci dello stesso livello con lo stesso nome di serie sono disposte su una riga. Il campo espande le serie di quel livello indicando il numero delle relative voci; un nuovo nome digitato viene accettato tramite «Crea nuova serie come “...”», **Nessuna serie** rimuove la voce. |
| Provvisorio | tutti | La data non è ancora fissata; la voce appare come contorno o con bordo tratteggiato. |
| Dipende da | Traguardo, Periodo | I predecessori della voce; visualizzati nella pagina come linea tratteggiata con freccia. |
| Collegamento | tutti | **Nessuno**, **Pagina** o **Articolo di notizie**. Una modifica interrompe un collegamento esistente. Nella pagina, il titolo della voce viene quindi sottolineato e, cliccandoci sopra, il contenuto si apre in una finestra sopra il piano. |
| Pagina | tutte | La pagina Staffbase dall’elenco delle pagine (le ultime 100 modificate). **Nuova pagina …** la crea nell’editor di Staffbase, che si sovrappone all’editor della mappa; una volta creata, viene collegata. |
| Canale, post | tutti | Prima il canale delle notizie (con il relativo tipo: articolo, breve notizia, post con immagine), poi il post. È possibile selezionare le bozze, contrassegnate con «(bozza)» — i lettori le vedranno solo dopo la pubblicazione. **Nuovo post …** ne crea uno nel canale selezionato; dopo il salvataggio, viene collegato. **Apri in una nuova scheda** mostra il contenuto collegato. |
| Allegati | tutti | Fino a dieci file o immagini dalla libreria multimediale, ciascuno con una didascalia opzionale (altrimenti viene visualizzato il nome del file). **Aggiungi file o immagine …** apre la libreria; **↑**/**↓** per ordinare, **×** per rimuovere. Gli allegati vengono conservati dopo il logout. Nella pagina sono visualizzati accanto al contenuto collegato o nei dettagli; nell’esportazione in Excel, nella colonna «Allegati». |
| Duplica | tutti | Crea una copia della voce. |
| Elimina | tutti | Chiede conferma e poi rimuove la voce e tutte le dipendenze che rimandano ad essa; la finestra di conferma elenca le voci dipendenti. |

### Scheda «Livelli»

| Comando | Descrizione |
| --- | --- |
| Nuovo livello | In alto a destra nella scheda. Crea un nuovo livello. |
| Nome | Il nome del livello, a sinistra della sua traccia. Deve essere univoco. Accanto è indicato il numero di voci che contiene. |
| Frecce su / giù | Ordine nella pagina e nell’esportazione in Excel. |
| Elimina | Rimuove il livello. Se contiene voci, l’editor chiede se queste devono essere spostate in un altro livello (selezione **Livello di destinazione**) o se devono essere eliminate insieme al livello. |

### Scheda «Categorie»

| Elemento di comando | Descrizione |
| --- | --- |
| Nuova categoria | In alto a destra nella scheda. Crea una nuova categoria. |
| Casella colore | Davanti al nome; mostra il colore. Un clic espande i dodici colori e il campo **Valore esadecimale**; Esc o un clic accanto a esso chiude la finestra. |
| Valore esadecimale | Un colore personalizzato nel formato `#RRGGBB`, ad esempio `#E40045`. |
| Pulsante forma | Accanto al campo colore; mostra la forma con cui vengono visualizzati i traguardi della categoria. Un clic espande le otto forme: rombo, triangolo, triangolo con la punta rivolta verso il basso, quadrato, cerchio, esagono, stella o croce. I tasti freccia consentono di cambiare la forma. |
| Nome | Il nome nella legenda e nei dettagli. Deve essere univoco. Accanto è indicato a quante voci è assegnata la categoria. |
| Frecce su / giù | Ordine nella legenda. |
| Elimina | Rimuove la categoria; le sue voci diventano “senza categoria”. Il messaggio di conferma ne indica il numero. |

## Limiti

- Un piano può contenere al massimo **300 voci**, **20 livelli** e
  **24 categorie**. L’editor non accetta nulla oltre questi limiti.
- Gli appuntamenti sono **giorni interi** senza ora. La vista iniziale è
  **per mese**.
- Il testo non è mai del colore della categoria — i colori chiari come il giallo rimarrebbero
  altrimenti illeggibili sullo sfondo bianco. Il colore è applicato solo alla forma, alla barra e al
  punto della legenda; il testo nella barra è nero o bianco, a seconda di quale dei due
  risulti più leggibile.
- **Senza voci, il widget non mostra nulla** — né una cornice vuota né
  un messaggio.

## Dipendenze tra le impostazioni

- **Mostra linea di oggi** funziona solo se la data odierna rientra nella
  sezione visibile. In un piano che si colloca interamente nel passato o
  nel futuro, la linea è quindi visibile solo dopo averlo spostato.
- L’**intestazione** determina anche il nome del file Excel; se l’
  esportazione non è attivata, funge solo da intestazione.
- L’**intestazione** e la **vista iniziale** vengono impostate nell’editor del piano, non nella
  finestra di dialogo; entrambe fanno parte del piano.
