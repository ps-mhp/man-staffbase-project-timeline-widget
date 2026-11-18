# Impostazioni

La finestra di dialogo di configurazione di Staffbase contiene solo il campo “Piano”. Questo viene gestito nell’
editor del piano, che si apre automaticamente all’apertura delle impostazioni;
il campo di testo sottostante contiene la versione tecnica grezza e non deve essere modificato manualmente
. I precedenti campi **Mostra riga "Oggi"** e
**Offri esportazione in Excel** sono nascosti nella finestra di dialogo e si trovano nell’
editor del piano alla voce **Impostazioni**; i loro valori sono presenti nel piano. Un blocco in cui
non sono mai stati spostati nell’editor mantiene ciò che mostrava in precedenza. Anche l’
intestazione del piano non è un campo della finestra di dialogo, ma viene gestita nell’editor del piano
.

| Attributo | Etichetta | Descrizione |
| --- | --- | --- |
| `plan` | Piano | Intestazione, livelli, categorie, voci, vista iniziale e i pulsanti per la riga “Oggi” e l’esportazione. Viene gestito nell’editor del piano. Impostazione predefinita: vuoto. |
| `show-today` | Mostra linea “Oggi” | Ora solo opzione di ripiego per i piani che non presentano il pulsante. Nell’editor come **Mostra linea “Oggi”** in **Impostazioni**: Una linea verticale scura con la scritta «Oggi» sull’asse contrassegna il giorno odierno, purché rientri nella sezione visibile. Impostazione predefinita: attiva. |
| `allow-export` | Offri esportazione in Excel | Solo opzione di ripiego come sopra. Nell’editor come **Offri esportazione in Excel**: mostra ai lettori il pulsante **Esporta**, tramite il quale possono scaricare le voci come foglio di calcolo Excel. Impostazione predefinita: attiva. |

## L’editor dei piani

L’editor dei piani occupa l’intero schermo. In alto si trova l’intestazione del
quadro comune, sotto a sinistra le **voci**, al centro il
modulo della voce selezionata e a destra il pannello **Piano**.

### Intestazione

| Elemento di controllo | Descrizione |
| --- | --- |
| Editor · Desktop · Tablet · Mobile | **Editor** mostra il modulo. Le visualizzazioni per dispositivo mostrano invece il piano a larghezza dello schermo — la stessa visualizzazione presente nella pagina, con zoom, senza filtri né esportazione; cliccando su una voce la si seleziona. |
| Stato | «3 voci modificate · livelli” — che differisce dall’ultimo stato salvato. Una voce priva di livello impedisce il salvataggio. |
| Annulla / Ripeti | Annulla o ripristina le modifiche passo dopo passo (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Aiuto | Spiega il funzionamento (F1). |
| Annulla | Chiude l’editor; se sono presenti modifiche non salvate, chiede prima se si desidera scartarle. |
| Salva | Salva il piano nelle impostazioni (⌘/Ctrl S); **Salva e chiudi** anche con ⌘/Ctrl ↵. Viene salvato insieme alla pagina. |

### Barra laterale «Voci»

A sinistra l’elenco delle voci, ordinato per data, con il numero (“12 di
300”). **Nuovo** crea una **traguardo**, un **periodo** o una **data di riferimento**;
senza livello è possibile solo la data di riferimento. Sotto si trovano **Cerca voci** e
la selezione del tipo (**Tutti i tipi**, **Traguardi**, **Periodi**,
**Date di scadenza**, ciascuno con il numero corrispondente; se la ricerca è attiva: risultati).

### Modulo della voce

Sopra il modulo compaiono «Voce 4 di 12», il tipo e i pulsanti **Duplica voce**
e **Elimina voce**; sotto, le schede **Generale**
(Tipo, Titolo, Descrizione, Provvisorio), **Classificazione** (livello, categoria,
serie), **Data** (data o inizio e fine; per il periodo, freccia alla fine),
**Dipendenze** e **Contenuto** (pagina collegata o articolo di notizie,
allegati). «(Errore)» dietro una scheda indica un inserimento non valido al suo interno;
in caso di date di riferimento, la voce **Dipendenze** viene omessa:

| Campo | Si applica a | Descrizione |
| --- | --- | --- |
| Tipo | tutti | Traguardo, periodo o data di riferimento. Passando alla data di riferimento, il livello viene omesso. Senza livello, una data di riferimento rimane tale. |
| Titolo | tutti | Obbligatorio. Appare nella voce e nei dettagli. |
| Descrizione | tutti | Facoltativa, su più righe. Appare solo nei dettagli e nell’esportazione in Excel. |
| Provvisorio | tutti | La data non è ancora stata fissata; la voce appare come contorno o con bordo tratteggiato. |
| Livello | Traguardo, Periodo | Il livello in cui si trova la voce. **Nuovo livello …** ne crea uno (nome) e lo assegna immediatamente. |
| Categoria | tutti | Determina il colore e, nel caso dei traguardi, la forma. «Senza categoria» appare in grigio, le tappe fondamentali come rombi. **Nuova categoria …** ne crea una (nome, colore e forma) e la assegna immediatamente. |
| Serie | Tappa fondamentale, periodo | Le voci dello stesso livello con lo stesso nome di serie sono disposte su una riga. Il campo espande le serie di questo livello indicando il numero delle relative voci; un nuovo nome digitato viene acquisito tramite «Crea nuova serie con “...”», **Nessuna serie** rimuove la voce. |
| Data | Traguardo, data di riferimento | La data. |
| Inizio, Fine | Intervallo di tempo | Primo e ultimo giorno; entrambi fanno parte dell’intervallo di tempo. |
| Freccia alla fine | Intervallo di tempo | La barra termina con una punta di freccia — «continua». |
| Dipende da | Traguardo, periodo | I predecessori della voce; visualizzati nella pagina come linea tratteggiata con freccia. |
| Collegamento | tutti | **Nessuno**, **Pagina** o **Articolo di notizie**. Una modifica interrompe un collegamento esistente. Nella pagina, il titolo della voce viene quindi sottolineato e, cliccandoci sopra, il contenuto si apre in una finestra sopra il piano. |
| Pagina | tutte | La pagina Staffbase dall’elenco delle pagine (le ultime 100 modificate). **Nuova pagina …** la crea nell’editor di Staffbase, che si sovrappone all’editor della mappa; una volta creata, viene collegata. |
| Canale, post | tutti | Prima il canale delle notizie (con il relativo tipo: articolo, breve notizia, post con immagine), poi il post. Le bozze sono selezionabili e contrassegnate con «(bozza)» — i lettori le vedranno solo dopo la pubblicazione. **Nuovo contributo …** ne crea uno nel canale selezionato; dopo il salvataggio, viene collegato. **Apri in una nuova scheda** mostra il contenuto collegato. |
| Allegati | tutti | Fino a dieci file o immagini dalla libreria multimediale, ciascuno con una didascalia opzionale (altrimenti il nome del file). **Aggiungi file o immagine …** apre la libreria; le frecce ordinano, la croce rimuove. Gli allegati rimangono dopo l’accesso. Nella pagina sono visualizzati accanto al contenuto collegato o nei dettagli, nell’esportazione Excel nella colonna «Allegati». |
| Duplica voce | tutti | Crea una copia della voce. |
| Elimina voce | tutte | Richiede conferma e poi rimuove la voce e tutte le dipendenze che rimandano ad essa; la richiesta di conferma elenca le voci dipendenti. |

### Pannello «Piano»: Impostazioni

| Elemento di controllo | Descrizione |
| --- | --- |
| Titolo del piano | Si trova sopra il piano e assegna il nome al file Excel. Opzionale: lasciare vuoto se la pagina ha già un'intestazione adeguata; il file si chiamerà allora `Piano di progetto_AAAA-MM-GG.xlsx`. |
| Mostra linea "Oggi" | Pulsante, vedi sopra. Finché non viene attivato nell’editor, indica che il blocco mantiene l’impostazione precedente. |
| Offri esportazione in Excel | Pulsante, vedi sopra; lo stesso vale qui. |
| Applica questa sezione | Salva la sezione visibile dell’anteprima (vista desktop, tablet o mobile), con precisione mensile, come visualizzazione al caricamento della pagina. Disabilitato se non è stata selezionata alcuna sezione. |
| Rimuovi vista iniziale | Cancella la vista iniziale; al caricamento, il widget mostra nuovamente l’intero piano. |
| Inizia con un modello | Solo se il piano è vuoto, al centro: mostra i modelli tra cui scegliere (“Roadmap del prodotto”, “Rinvio della scadenza”). Cliccando su una scheda, questa riempie l’editor; **Indietro** torna indietro senza apportare modifiche. Su un piano con voci presenti questa opzione non è disponibile — il modello le sostituirebbe. |
| Inizia da zero | Solo se il piano è vuoto: crea un livello denominato «Livello 1». |

### Pannello «Piano»: Livelli

| Elemento di comando | Descrizione |
| --- | --- |
| Nuovo livello | Crea un nuovo livello. |
| Nome | Il nome del livello, a sinistra della sua riga. Deve essere univoco. Sotto è indicato il numero di voci che contiene. |
| Frecce su / giù | Ordine nella pagina e nell’esportazione in Excel. |
| Elimina | Rimuove il livello. Se contiene voci, l’editor chiede se queste devono essere spostate in un altro livello (selezione **Livello di destinazione**) o se devono essere eliminate insieme al livello. |

### Pannello «Piano»: Categorie

| Elemento di comando | Descrizione |
| --- | --- |
| Nuova categoria | Crea una nuova categoria. |
| Campo colore | Davanti al nome; mostra il colore. Un clic espande i dodici colori e il campo **Valore esadecimale**; Esc o un clic accanto a esso chiude la finestra. |
| Valore esadecimale | Un colore personalizzato nel formato `#RRGGBB`, ad esempio `#E40045`. |
| Pulsante forma | Accanto al campo colore; mostra la forma con cui vengono visualizzati i traguardi della categoria. Cliccando si aprono le otto forme: rombo, triangolo, triangolo con la punta verso il basso, quadrato, cerchio, esagono, stella o croce. I tasti freccia consentono di cambiare la forma. |
| Nome | Il nome nella legenda e nei dettagli. Deve essere univoco. Sotto è indicato a quante voci è assegnata la categoria. |
| Frecce su / giù | Ordine nella legenda. |
| Elimina | Rimuove la categoria; le sue voci diventano “senza categoria”. Il messaggio di conferma ne indica il numero. |

## Limiti

- Un piano può contenere al massimo **300 voci**, **20 livelli** e
  **24 categorie**. L’editor non accetta nulla oltre questi limiti.
- Gli appuntamenti sono **giorni interi** senza ora. La vista iniziale è
  **per mese**.
- Il testo non è mai del colore della categoria — i colori chiari come il giallo risulterebbero
  illeggibili su sfondo bianco. Il colore è applicato solo alla forma, alla barra e al
  punto della legenda; il testo nella barra è nero o bianco, a seconda di quale dei due
  risulti più leggibile.
- **Senza voci, il widget non mostra nulla** — né una cornice vuota né
  un messaggio.

## Dipendenze tra le impostazioni

- **Mostra linea di oggi** funziona solo se la data odierna rientra nella
  sezione visibile. Nel caso di un piano che si colloca interamente nel passato o
  nel futuro, la linea è quindi visibile solo dopo lo spostamento.
- L'**intestazione** determina anche il nome del file Excel; se
  l'esportazione non è attivata, funge solo da intestazione.
- **Titolo del piano**, **Vista iniziale**, **Linea "Oggi"** ed **Esportazione** vengono impostati nell’
editor del piano, non nella finestra di dialogo; tutti fanno parte del piano.
