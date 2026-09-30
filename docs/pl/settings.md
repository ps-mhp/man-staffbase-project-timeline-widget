# Ustawienia

Okno konfiguracyjne widgetu zawiera trzy pola. "Plan" jest wyświetlany w
edytor planów, który pojawia się po otwarciu ustawień; 
Pole tekstowe za nim to techniczna, wstępna wersja i nie powinna być wykonywana ręcznie.
można edytować. Pozostałe dwa pola znajdują się bezpośrednio w dialogu. The
Nagłówek planu nie jest polem dialogu, lecz jest wyświetlany w edytorze planu
(patrz niżej). 

| Atrybut | Etykieta w dialogu | Opis |
| --- | --- | --- |
| 'plan' | Plan | Nagłówki, poziomy, kategorie, wpisy oraz widok startowy. Utrzymywane w edytorze planów. Domyślne: puste. |
| 'pokaż dzisiaj' | Pokaż dziś linię | Ciemna pionowa linia z napisem "Today" w osi oznacza dzisiaj, jeśli jest w widocznej części. Domyślnie: włączone. |
| 'zezwalaj-eksport' | Oferta eksportu w Excelu | Pokazuje czytelnikom przycisk **Eksport**, którego używają do pobrania wpisów jako arkusz Excel. Domyślne: włączony. |

## Redaktor Planów

Edytor planu składa się z pola **Nagłów**, **Podgląd** oraz
trzy zakładki. W prawym górnym rogu widnieje, ile wpisów zawiera mapa, dla
Przykład "42 / 300 wpisów". 

### Kurs

| Pole | Opis |
| --- | --- |
| Nagłówek | Na górze edytora planu. Stoi nad planem i nadaje plikowi Excel jego nazwę. Opcjonalnie: Zostawić puste, jeśli strona ma już odpowiedni nagłówek; plik będzie wtedy nazywany 'Projektplan_JJJJ-MM-TT.xlsx'. |

### Szybki widok

| Element sterujący | Opis |
| --- | --- |
| Podgląd | Ta sama oś czasu co na stronie, z powiększaniem, bez filtrów i eksportu. Kliknięcie wpisu wybiera go w zakładce "Wpisy". Można go zwinąć. |
| Ta sekcja jako widok startowy | Zapisuje widoczną sekcję podglądu, aż do miesiąca, jako widok po ładowaniu strony. |
| Usuń widok Start | Usuwa widok główny; widżet ponownie pokazuje cały plan podczas ładowania. |
| Zacznij od Przykładowego Planu | Tylko gdy plan jest pusty: wypełnia edytor nagłówkiem, trzema poziomami, siedmioma kategoriami i przykładowymi wpisami. |

### Zakładka "Wpisy" 

Po lewej stronie lista wszystkich wpisów, posortowana według daty i za pomocą **Wpisy
przeglądanie** do przeszukiwania; powyżej, pod **Dodaj**, znajduje się przycisk dla
**Kamień milowy**, **Kropka** i **Deadline**. Po prawej stronie forma
Wybrany wpis: 

| Pole | Dotyczy | Opis |
| --- | --- | --- |
| Wpisz | Wszystkie | Kamień milowy, okres lub termin. Jeśli zmienisz termin, poziom zostaje pominięty. |
| Tytuł | Wszyscy | Obowiązkowe. Napisane w wpisie i w szczegółach. |
| Opis | Wszystko | Opcjonalne, wieloliniowe. Pojawia się tylko w szczegółach i w eksporcie Excela. |
| Poziom | Kamień milowy, okres | Poziom, na którym znajduje się wpis. |
| Kategoria | Wszystkie | Określa kolor. "Bez kategorii" wydaje się szare. |
| Data | Kamień milowy, termin | Data. |
| Początek, koniec | Krzepka | Pierwszy i ostatni dzień; oba należą do tej kropki. |
| Symbol | Kamień milowy | Romb (domyślny), trójkąt, kwadrat lub koło. |
| Strzałka na końcu | Kropka | Pasek kończy się grotem strzały — "biegnie dalej". |
| Seria | Kamień milowy, Okres | Wpisy tego samego poziomu o tej samej nazwie serii są na linii. Pole wskazuje serię tego poziomu. |
| Tymczasowe | wszystkie | Data nie została jeszcze ustalona; wpis pojawia się jako kontur lub z przerywaną ramką. |
| Zależy od | Kamień milowy, kropka | Poprzednicy wpisu; na stronie jako przerywana linia ze strzałką. |
| Zduplikuj | Wszystkie | Stwórz kopię wpisu. |
| Usuń | Wszystkie | Usuwa wpis oraz wszelkie zależności na niego wskazujące. |

### Zakładka warstw 

| Element sterujący | Opis |
| --- | --- |
| Nowa warstwa | Stwórz nową warstwę. |
| Nazwa | Nazwa warstwy, po lewej stronie jej orbity. Obok niej znajduje się liczba wpisów, które zawiera. |
| Strzałki w górę / w dół | Uporządkuj na stronie i w eksporcie w Excelu. |
| Usuń | Usuwa warstwę. Jeśli zawiera wpisy, edytor pyta, czy należy je przenieść na inną warstwę (wybrać **Docelową warstwę**), czy też je usunąć. |

### Zakładka "Kategorie" 

| Element sterujący | Opis |
| --- | --- |
| Nowa kategoria | Stwórz nową kategorię. |
| Imię | Imię w legendzie i w szczegółach. |
| Kolor | Jedno z dwunastu pól kolorów. |
| Wartość heksadecimalna | Niestandardowy kolor w formacie '#RRGGBB', na przykład '#E40045'. |
| Strzałki w górę / w dół | Kolejność legendy. |
| Usuń | Usuwa kategorię; jej wpisy stają się "bez kategorii". Zapytanie podaje jej numer. |

## Granice

- Plan ma maksymalnie **300 wpisów**, **20 poziomów** oraz
  **24 kategorie**. Poza tym redaktor już nic nie akceptuje. 
- Wizyty to **całe dni** bez czasu. Widok początkowy to
  **Miesięcznie**. 
- Tekst nigdy nie jest w kolorze kategorii — jasne kolory, jak żółty, pozostają
  w przeciwnym razie nieczytelny na białym. Kolor jest nieobecny tylko przez symbol, pasek i
  Legend Point; napis w barze jest czarno-biały, w zależności od rodzaju
  jest łatwiejszy do czytania. 
- **Bez wpisów widżet nie pokazuje nic** — ani pustą ramkę, ani
  wiadomość. 

## Zależności między ustawieniami

- **Linia Pokaż dzisiaj** działa tylko wtedy, gdy dzisiaj jest w widocznym
  fragment. W przypadku planu, który jest całkowicie przeszłością lub
  przyszłość, linia jest widoczna dopiero po jej przesunięciu się. 
- **nagłówek** również określa nazwę pliku Excel; bez
  Działa tylko jako nagłówek. 
- **Nagłówek** i **Widok domowy** są ustawiane w edytorze planów, a nie w
  dialog; oba są częścią planu.