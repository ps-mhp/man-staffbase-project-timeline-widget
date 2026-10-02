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

Edytor planów zajmuje cały ekran. Na górze znajduje się pasek nagłówka, poniżej niego
**Podgląd** i trzy zakładki. Pomiędzy Podglądem a zakładkami, oraz pomiędzy
Lista i formularz mają uchwyt, którym wyznacza wysokość
oraz zmieniać szerokość listy (myszka lub strzałki, 
Podwójne kliknięcie przywraca domyślny poziom; przeglądarka zapamiętuje rozmiary). 

### Nagłówek

| Element sterujący | Opis |
| --- | --- |
| Nagłówek | Stoi nad planem i nadaje plikowi Excel jego nazwę. Opcjonalnie: Zostawić puste, jeśli strona ma już odpowiedni nagłówek; plik nazywa się wtedy 'Projektplan_JJJJ-MM-TT.xlsx'. |
| "42 / 300 wpisów" | Ile wpisów zawiera plan, mierzone względem górnego limitu. |
| "Niezapisane zmiany" | Pojawia się, gdy plan w edytorze różni się od zapisanego. |
| Anuluj | Zamyka edytor; w przypadku niezapisanych zmian pyta wcześniej, czy powinny zostać odrzucone. |
| Zastosowanie | Zapisz plan w ustawieniach i zamknij edytor. Jest zapisywany wraz ze stroną. |

### Szybki widok

| Element sterujący | Opis |
| --- | --- |
| Podgląd | Ta sama oś czasu co na stronie, z powiększeniem, bez filtrowania i eksportu. Kliknięcie na wpis wybiera go w zakładce "Wpisy" i wyświetla w liście. Kliknięcie na **Podgląd** powoduje jego zwinięcie; po rozłożeniu ma ostatnią wykreśloną wysokość. |
| Ta sekcja jako widok startowy | Zapisuje widoczną sekcję podglądu, aż do miesiąca, jako widok po ładowaniu strony. |
| Usuń widok Start | Usuwa widok główny; widżet ponownie pokazuje cały plan podczas ładowania. |
| Zacznij od szablonu | Tylko jeśli plan jest pusty: pokazuje szablony do wyboru ("Plan drogowy produktu", "Przeplanowanie"). Kliknięcie na kartę wypełnia edytor nią; **Return** zwraca bez zmian. |
| Zaczynaj pusty | Tylko jeśli plan jest pusty: stwórz warstwę "Poziom 1". |

### Zakładka "Wpisy" 

Po lewej stronie znajduje się lista wpisów, posortowana według daty. Powyżej znajdują się
**Przeglądaj wpisy**, a poniżej przełącznik typu — 
**Kamienie milowe**, **Okresy**, **Terminy**, każdy z numerem (jeśli aktywny
wyszukiwanie: trafienia); przycisk **+** obok tworzy wpis tego rodzaju, 
a poszukiwania działają w obrębie gatunku. 
Po najechaniu kursorem nad linią, po prawej stronie pojawia się kosz na śmieci do usunięcia (z
Zapytanie). 

Po prawej stronie forma wybranego wpisu; nad nim jego tytuł oraz
przyciski **Zduplikuj** i **Usuń**, poniżej znajdują się zakładki **Ogólne** 
(Typ, tytuł, opis), **Klasyfikacja** (Poziom, Kategoria, Seria), 
**Data** (data lub początek i koniec, dla strzałki kropki na końcu – tymczasowe)
**Zależności** i **Treść** (strona powiązana lub post informacyjny). A
czerwony punkt na zakładce pokazuje nieprawidłowy wpis; dla kluczowych dat
Wyeliminowane **zależności**: 

| Pole | Dotyczy | Opis |
| --- | --- | --- |
| Wpisz | Wszystkie | Kamień milowy, okres lub termin. Jeśli zmienisz termin, poziom zostaje pominięty. |
| Tytuł | Wszyscy | Obowiązkowe. Napisane w wpisie i w szczegółach. |
| Opis | Wszystko | Opcjonalne, wieloliniowe. Pojawia się tylko w szczegółach i w eksporcie Excela. |
| Poziom | Kamień milowy, Kropka | Poziom, na którym znajduje się wpis. **Nowa warstwa ...** tworzy jeden (nazwa) i natychmiast go przypisuje. |
| Kategoria | wszystkie | Określa kolor, a dla kamieni milowych kształt. "Bez kategorii" pojawia się szaro, kamienie milowe jak diament. **Nowa kategoria ...** tworzy jeden (nazwa, kolor i kształt) i natychmiast go przypisuje. |
| Data | Kamień milowy, termin | Data. |
| Początek, koniec | Krzepka | Pierwszy i ostatni dzień; oba należą do tej kropki. |
| Strzałka na końcu | Kropka | Pasek kończy się grotem strzały — "biegnie dalej". |
| Seria | Kamień milowy, Okres | Wpisy tego samego poziomu z tą samą nazwą serii znajdują się w jednej linii. Pole rozszerza serię tego poziomu o liczbę ich wpisów; wpisana nowa nazwa jest przejmowana przez "..." utwór jako nową serię", **Brak serii** usuwa wpis. |
| Tymczasowe | wszystkie | Data nie została jeszcze ustalona; wpis pojawia się jako kontur lub z przerywaną ramką. |
| Zależy od | Kamień milowy, kropka | Poprzednicy wpisu; na stronie jako przerywana linia ze strzałką. |
| Link | wszystkie | **Brak**, **Strony** ani **Artykułu informacyjnego**. Zmiana psuje istniejący link. Na stronie inskrypcja wpisu jest podkreślona, a kliknięcie otwiera treść w oknie powyżej planu. |
| Strona | Wszystkie | Strona Staffbase z listy stron (100 ostatnio edytowanych). **Nowa strona ...** tworzy ją w edytorze Staffbase, który nakłada się na edytor planu; po jej utworzeniu jest linkowana. |
| Kanał, Post | wszystkie | Najpierw kanał informacyjny (z typem: artykuł, krótka wiadomość, post obrazkowy), potem post. Wersje robocze są wybieralne i oznaczone "(szkic)" — czytelnicy widzą je dopiero po publikacji. **Nowy post ...** tworzy taki w wybranym kanale; po zapisaniu jest powiązany. **Otwórz w nowej karcie** pokazuje powiązaną treść. |
| Załączniki | Wszystkie | Do dziesięciu plików lub obrazów z biblioteki multimedialnej, każdy z opcjonalnym podpisem (w przeciwnym razie nazwą pliku). **Dodaj plik lub obraz ...** otwiera bibliotekę; **↑**/**↓** uporządkowano, **×** usunięte. Załączniki pozostają za logowaniem. Na stronie znajdują się obok powiązanej treści lub w szczegółach, w eksporcie Excel w kolumnie "Załączniki". |
| Zduplikuj | Wszystkie | Stwórz kopię wpisu. |
| Usuń | wszystkie | Pyta o wpis, a następnie usuwa go oraz wszystkie zależności, które na niego wskazują; zapytanie nazywa wpisy zależne. |

### Zakładka warstw 

| Element sterujący | Opis |
| --- | --- |
| Nowa warstwa | W prawym górnym rogu zakładki. Stwórz nową warstwę. |
| Nazwa | Nazwa warstwy, po lewej stronie jej orbity. Musi być unikalna. Obok niej jest liczba wpisów, które zawiera. |
| Strzałki w górę / w dół | Uporządkuj na stronie i w eksporcie w Excelu. |
| Usuń | Usuwa warstwę. Jeśli zawiera wpisy, edytor pyta, czy należy je przenieść na inną warstwę (wybrać **Docelową warstwę**), czy też je usunąć. |

### Zakładka "Kategorie" 

| Element sterujący | Opis |
| --- | --- |
| Nowa kategoria | W prawym górnym rogu zakładki. Utwórz nową kategorię. |
| Pole kolorów | Przed nazwą; pokazuje kolor. Jedno kliknięcie powiększa dwanaście kolorów, a pole **Wartość Heksagonalna**; Esc lub kliknięcie obok niego zamyka się. |
| Wartość heksadecimalna | Niestandardowy kolor w formacie '#RRGGBB', na przykład '#E40045'. |
| Przycisk kształtu | Obok pola kolorów; pokazuje kształt, w którym pojawiają się kamienie milowe kategorii. Kliknięcie otwiera osiem kształtów: romb, trójkąt, trójkąt z opuszczonym czubkiem, kwadrat, koło, sześciokąt, gwiazda lub krzyż. Strzałki zmieniają kształt. |
| Nazwa | Nazwa w legendzie i szczegółach. Musi być unikalna. Obok niej jest liczba wpisów, do których przypisana jest kategoria. |
| Strzałki w górę / w dół | Kolejność legendy. |
| Usuń | Usuwa kategorię; jej wpisy stają się "bez kategorii". Zapytanie podaje jej numer. |

## Granice

- Plan ma maksymalnie **300 wpisów**, **20 poziomów** oraz
  **24 kategorie**. Poza tym redaktor już nic nie akceptuje. 
- Wizyty to **całe dni** bez czasu. Widok początkowy to
  **Miesięcznie**. 
- Tekst nigdy nie jest w kolorze kategorii — jasne kolory, jak żółty, pozostają
  w przeciwnym razie nieczytelny na bieli. Kolor utrzymuje się jedynie przez kształt, paski i
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