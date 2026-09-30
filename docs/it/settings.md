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

L'editor di piani è composto dal campo **Heading**, dall'**Anteprima** e
tre schede. In alto a destra c'è il numero di voci che la mappa porta, per il
Esempio "42 / 300 voci". 

### Direzione

| Campo | Descrizione |
| --- | --- |
| Intestazione | In cima all'editor di piani. Si posiziona sopra il piano e dà il nome al file Excel. Opzionale: Lasciare vuoto se la pagina ha già un titolo adatto; il file sarà quindi chiamato 'Projektplan_JJJJ-MM-TT.xlsx'. |

### Visione veloce

| Elemento di controllo | Descrizione |
| --- | --- |
| Anteprima | La stessa timeline della pagina, con zoom, senza filtri e esportazione. Cliccando su una voce viene selezionata nella scheda "Voci". Può essere compressa. |
| Questa sezione come vista iniziale | Salva la sezione visibile dell'anteprima, fino al mese, come visualizzazione quando la pagina si carica. |
| Rimuovi la vista Start | Elimina la vista principale; il widget mostra di nuovo l'intero piano durante il caricamento. |
| Inizia con Piano Esempio | Solo quando il piano è vuoto: riempie l'editor con un titolo, tre livelli, sette categorie e voci di esempio. |

### Scheda "Voci" 

A sinistra c'è l'elenco di tutte le voci, ordinate per data e tramite **Voci
sfoglia** ricercabile; sopra questo, sotto **Aggiungi**, un pulsante per
**Milestone**, **Punto** e **Deadline**. A destra, la forma del
Voce selezionata: 

| Campo | Si applica a | Descrizione |
| --- | --- | --- |
| Tipo | Tutti | Milestone, Periodo o Scadenza. Se cambi la scadenza, il livello viene omesso. |
| Titolo | Tutti | Obbligatorio. Scritto sulla voce e nei dettagli. |
| Descrizione | Tutti | Opzionale, multi-linea. Appare solo nei dettagli e nell'esportazione Excel. |
| Livello | Milestone, Periodo | Il livello in cui si trova l'ingresso. |
| Categoria | Tutti | Determina il colore. "Senza categoria" appare grigio. |
| Data | Pietra miliare, scadenza | La data. |
| Inizio, fine | Punto | Primo e ultimo giorno; entrambi appartengono al periodo. |
| Simbolo | Milestone | Rombo (predefinito), triangolo, quadrato o cerchio. |
| Freccia alla fine | Punto | La barra termina con una punta di freccia — "corre avanti". |
| Serie | Pietra miliare, Periodo | Le voci dello stesso livello con lo stesso nome di serie sono su una linea. Il campo suggerisce la serie di questo livello. |
| Provvisorio | tutti | La data non è ancora stata fissata; la voce appare come contorno o con un bordo tratteggiato. |
| Dipende da | Milestone, Punto | I predecessori della voce; sulla pagina come una linea tratteggiata con una freccia. |
| Duplicato | Tutti | Crea una copia della voce. |
| Elimina | Tutti | Rimuove la voce e tutte le dipendenze che vi indicano. |

### Scheda Strati 

| Elemento di controllo | Descrizione |
| --- | --- |
| Nuovo livello | Crea un nuovo livello. |
| Nome | Il nome dello strato, a sinistra della sua orbita. Accanto a esso c'è quante voci contiene. |
| Frecce su/giù | Ordina sulla pagina e in Export. |
| Elimina | Rimuove il livello. Se contiene voci, l'editor chiede se dovrebbero essere spostate su un altro livello (seleziona **Target Layer**) o se dovrebbero essere eliminate anche loro. |

### Scheda "Categorie" 

| Elemento di controllo | Descrizione |
| --- | --- |
| Nuova categoria | Crea una nuova categoria. |
| Nome | Il nome nella leggenda e nei dettagli. |
| Colore | Uno dei dodici campi di colore. |
| Valore esagonale | Un colore personalizzato nel formato '#RRGGBB', ad esempio '#E40045'. |
| Frecce su / giù | Ordine della leggenda. |
| Elimina | Rimuove la categoria; le sue voci diventano "senza categoria". La query fornisce il suo numero. |

## Confini

- Un piano ha un massimo di **300 iscrizioni**, **20 livelli** e
  **24 categorie**. Oltre a questo, l'editor non accetta più nulla. 
- Gli appuntamenti sono **intere giornate** senza tempo. La visuale iniziale è
  **Mensile**. 
- Il testo non è mai del colore della categoria — colori vivaci come il giallo rimangono
  altrimenti illeggibile sul bianco. Il colore è portato solo dal simbolo, barra e
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