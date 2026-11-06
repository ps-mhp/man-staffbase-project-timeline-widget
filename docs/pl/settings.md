# Ustawienia

Okno dialogowe konfiguracji widżetu zawiera trzy pola. Pole „Plan” jest edytowane w
edytorze planu, który wyświetla się automatycznie po otwarciu ustawień;
pole tekstowe znajdujące się za nim zawiera surową wersję techniczną i nie należy go
edytować ręcznie. Pozostałe dwa pola znajdują się bezpośrednio w oknie dialogowym.
Nagłówek planu nie jest polem okna dialogowego, lecz jest edytowany w edytorze planu
(patrz poniżej).

| Atrybut | Etykieta w oknie dialogowym | Opis |
| --- | --- | --- |
| `plan` | Plan | Nagłówek, poziomy, kategorie, wpisy i widok początkowy. Edytowane w edytorze planu. Ustawienie domyślne: puste. |
| `show-today` | Pokaż linię „Dzisiaj” | Ciemna pionowa linia z napisem „Dzisiaj” na osi zaznacza bieżący dzień, o ile znajduje się on w widocznym fragmencie. Ustawienie domyślne: włączone. |
| `allow-export` | Oferuj eksport do Excela | Wyświetla czytelnikom przycisk **Eksportuj**, za pomocą którego mogą pobrać wpisy w postaci arkusza kalkulacyjnego Excel. Ustawienie domyślne: włączone. |

## Edytor planu

Edytor planu zajmuje cały ekran. U góry znajduje się pasek nagłówka, a poniżej
**podgląd** i trzy zakładki. Pomiędzy podglądem a zakładkami oraz pomiędzy
listą wpisów a formularzem znajduje się po jednym uchwycie, za pomocą którego można zmieniać wysokość
podglądu oraz szerokości listy (myszą lub klawiszami strzałek;
podwójne kliknięcie przywraca ustawienia domyślne; przeglądarka zapamiętuje te rozmiary).

### Pasek nagłówka

| Element sterujący | Opis |
| --- | --- |
| Nagłówek | Znajduje się nad planem i nadaje nazwę plikowi Excel. Opcjonalnie: można pozostawić puste, jeśli strona ma już odpowiedni nagłówek; plik będzie wtedy nosił nazwę `Plan_projektu_RRRR-MM-DD.xlsx`. |
| „42 / 300 wpisów” | Liczba wpisów w planie w stosunku do górnego limitu. |
| „Niezapisane zmiany” | Pojawia się, gdy plan w edytorze różni się od zapisanego. |
| Anuluj | Zamyka edytor; w przypadku niezapisanych zmian wyświetla wcześniej pytanie, czy mają one zostać odrzucone. |
| Zastosuj | Zapisuje plan w ustawieniach i zamyka edytor. Jest on zapisywany wraz ze stroną. |

### Podgląd

| Element sterujący | Opis |
| --- | --- |
| Podgląd | Ta sama oś czasu co na stronie, z funkcją powiększania, bez filtrów i opcji eksportu. Kliknięcie na wpis zaznacza go w zakładce „Wpisy” i wyświetla na liście. Kliknięcie **Podgląd** powoduje jego zwinięcie; po rozwinięciu powraca do ostatnio ustawionego poziomu. |
| Ten fragment jako widok początkowy | Zapisuje widoczny fragment podglądu, z dokładnością do miesiąca, jako widok wyświetlany podczas ładowania strony. |
| Usuń widok początkowy | Usuwa widok początkowy; po załadowaniu widżet ponownie wyświetla cały plan. |
| Rozpocznij od szablonu | Tylko w przypadku pustego planu: wyświetla szablony do wyboru („Plan rozwoju produktu”, „Przesunięcie terminu”). Kliknięcie karty wypełnia nią edytor; **Wstecz** powoduje powrót bez wprowadzania zmian. |
| Zacznij od zera | Tylko w przypadku pustego planu: tworzy warstwę „Warstwa 1”. |

### Zakładka „Wpisy”

Po lewej stronie znajduje się lista wpisów, posortowana według terminu. Nad nią u góry znajduje się
**Przeglądaj wpisy**, a poniżej przełącznik typu —
**Kamienie milowe**, **Okresy**, **Terminy**, każdy z liczbą (przy aktywnej
wyszukiwania: liczba wyników); przycisk **+** obok tworzy wpis tego typu,
a wyszukiwanie działa w obrębie danego typu.
Po najechaniu kursorem na wiersz po prawej stronie pojawia się kosz do usunięcia (z
potwierdzeniem).

Po prawej stronie znajduje się formularz wybranego wpisu; nad nim widnieje jego tytuł oraz
przyciski **Duplikuj** i **Usuń**, a poniżej zakładki **Ogólne**
(rodzaj, tytuł, opis), **Klasyfikacja** (poziom, kategoria, seria),
**Termin** (data lub początek i koniec, w przypadku okresu strzałka na końcu, tymczasowy)
**Zależności** oraz **Treść** (powiązana strona lub wpis w aktualnościach).
Czerwona kropka na zakładce wskazuje na nieprawidłowy wpis w tej zakładce; w przypadku terminów kluczowych
nie ma pozycji **Zależności**:

| Pole | Dotyczy | Opis |
| --- | --- | --- |
| Rodzaj | wszystkie | Kamień milowy, okres lub termin kluczowy. Po zmianie na termin kluczowy poziom nie ma zastosowania. |
| Tytuł | wszystkie | Obowiązkowe. Wyświetla się przy wpisie i w szczegółach. |
| Opis | wszystkie | Opcjonalne, wielowierszowe. Wyświetla się tylko w szczegółach i w eksporcie do Excela. |
| Poziom | Kamień milowy, okres | Poziom, na którym znajduje się wpis. **Nowy poziom …** tworzy nowy poziom (nazwa) i od razu go przypisuje. |
| Kategoria | wszystkie | Określa kolor, a w przypadku kamieni milowych – kształt. „Bez kategorii” wyświetla się na szaro, kamienie milowe jako romby. **Nowa kategoria …** tworzy kategorię (nazwa, kolor i kształt) i od razu ją przypisuje. |
| Data | Kamień milowy, data graniczna | Termin. |
| Początek, koniec | Okres | Pierwszy i ostatni dzień; oba należą do okresu. |
| Strzałka na końcu | Okres | Pasek kończy się grotem strzałki — „trwa dalej”. |
| Seria | Kamień milowy, Okres | Wpisy tego samego poziomu o tej samej nazwie serii znajdują się w jednym wierszu. Pole to rozwijają serie tego poziomu wraz z liczbą ich wpisów; wpisana nowa nazwa zostanie przyjęta poprzez opcję „Utwórz nową serię jako „…“”, a wybór opcji **Brak serii** spowoduje usunięcie wpisu. |
| Wstępny | wszystkie | Termin nie został jeszcze ustalony; wpis pojawia się jako kontur lub z przerywaną krawędzią. |
| Zależy od | Kamień milowy, okres | Poprzedniki wpisu; na stronie przedstawione jako linia przerywana ze strzałką. |
| Powiązanie | wszystkie | **Brak**, **Strona** lub **Wpis w aktualnościach**. Zmiana powoduje usunięcie istniejącego połączenia. Na stronie nazwa wpisu jest wtedy podkreślona, a kliknięcie otwiera treść w oknie nad planem. |
| Strona | wszystkie | Strona Staffbase z listy stron (100 ostatnio edytowanych). Opcja **Nowa strona …** tworzy ją w edytorze Staffbase, który nakłada się na edytor planu; po utworzeniu strona jest powiązana. |
| Kanał, wpis | wszystkie | Najpierw kanał wiadomości (z jego typem: artykuł, krótka wiadomość, wpis z obrazkiem), a następnie wpis. Można wybierać wersje robocze, które są oznaczone jako „(wersja robocza)” — czytelnicy widzą je dopiero po opublikowaniu. **Nowy wpis…** tworzy wpis w wybranym kanale; po zapisaniu jest on powiązany. **Otwórz w nowej karcie** wyświetla powiązaną treść. |
| Załączniki | wszystkie | Do dziesięciu plików lub zdjęć z biblioteki multimediów, każdy z opcjonalnym opisem (w przeciwnym razie wyświetlana jest nazwa pliku). **Dodaj plik lub zdjęcie …** otwiera bibliotekę; **↑**/**↓** porządkuje, **×** usuwa. Załączniki pozostają po zalogowaniu. Na stronie znajdują się obok powiązanej treści lub w szczegółach, a w eksporcie do Excela – w kolumnie „Załączniki”. |
| Duplikuj | wszystkie | Tworzy kopię wpisu. |
| Usuń | wszystkie | Wyświetla monit, a następnie usuwa wpis i wszystkie zależności, które do niego odwołują się; monit wymienia zależne wpisy. |

### Zakładka „Poziomy”

| Element sterujący | Opis |
| --- | --- |
| Nowa warstwa | W prawym górnym rogu zakładki. Tworzy nową warstwę. |
| Nazwa | Nazwa warstwy, po lewej stronie jej ścieżki. Musi być unikalna. Obok podana jest liczba zawartych w niej wpisów. |
| Strzałki w górę / w dół | Kolejność na stronie i w eksporcie do Excela. |
| Usuń | Usuwa warstwę. Jeśli zawiera ona wpisy, edytor zapyta, czy mają one zostać przeniesione do innej warstwy (wybór **warstwy docelowej**), czy też mają zostać usunięte wraz z warstwą. |

### Zakładka „Kategorie”

| Element sterujący | Opis |
| --- | --- |
| Nowa kategoria | W prawym górnym rogu zakładki. Tworzy nową kategorię. |
| Pole koloru | Przed nazwą; pokazuje kolor. Kliknięcie powoduje rozwinięcie listy dwunastu kolorów i pola **wartość szesnastkowa**; klawisz Esc lub kliknięcie obok zamyka okno. |
| Wartość szesnastkowa | Niestandardowy kolor w formacie `#RRGGBB`, na przykład `#E40045`. |
| Przycisk kształtu | Obok pola koloru; pokazuje kształt, w jakim wyświetlane są kamienie milowe kategorii. Jedno kliknięcie rozwija osiem kształtów: romb, trójkąt, trójkąt z wierzchołkiem skierowanym w dół, kwadrat, okrąg, sześciokąt, gwiazda lub krzyż. Klawisze strzałek zmieniają kształt. |
| Nazwa | Nazwa w legendzie i w szczegółach. Musi być unikalna. Obok podana jest liczba wpisów przypisanych do tej kategorii. |
| Strzałki w górę / w dół | Kolejność w legendzie. |
| Usuń | Usuwa kategorię; jej wpisy stają się „bez kategorii”. W oknie dialogowym podana jest ich liczba. |

## Ograniczenia

- Plan może zawierać maksymalnie **300 wpisów**, **20 poziomów** i
  **24 kategorie**. Edytor nie akceptuje większej liczby.
- Terminy to **całe dni** bez godziny. Widok początkowy jest
  **z dokładnością do miesiąca**.
- Tekst nigdy nie jest w kolorze kategorii — jasne kolory, takie jak żółty, byłyby
  na białym tle nieczytelne. Kolor mają tylko kształty, paski i
  punkty legendy; czcionka w pasku jest czarna lub biała, w zależności od tego, co
  jest lepiej czytelne.
- **Bez wpisów widżet nic nie wyświetla** — ani pustej ramki, ani
  komunikatu.

## Zależności między ustawieniami

- Opcja **Pokaż linię dzisiejszą** działa tylko wtedy, gdy dzisiejszy dzień znajduje się w widocznym
  fragmencie. W przypadku planu, który w całości leży w przeszłości lub
  przyszłości, linia ta jest zatem widoczna dopiero po przesunięciu.
- **Nagłówek** określa również nazwę pliku Excel; bez
  włączonej funkcji eksportu pełni on jedynie rolę nagłówka.
- **Nagłówek** i **Widok początkowy** ustawia się w edytorze planu, a nie w
  oknie dialogowym; oba elementy stanowią część planu.
