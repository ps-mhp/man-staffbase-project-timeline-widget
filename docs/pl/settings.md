# Ustawienia

Okno dialogowe konfiguracji Staffbase zawiera jedynie pole „Plan”. Jest ono edytowane w
edytorze planu, który wyświetla się automatycznie po otwarciu ustawień;
pole tekstowe znajdujące się za nim zawiera surową wersję techniczną i nie należy go
edytować ręcznie. Poprzednie pola **Pokaż linię „Dzisiaj”** i
**Oferuj eksport do Excela** są ukryte w oknie dialogowym i znajdują się w
edytorze planu w sekcji **Ustawienia**; ich wartości są zapisane w planie. Blok, w
którym nigdy nie zostały one przeniesione w edytorze, zachowuje to, co wyświetlał wcześniej. Również
nagłówek planu nie jest polem okna dialogowego, lecz jest edytowany w edytorze planu
.

| Atrybut | Etykieta | Opis |
| --- | --- | --- |
| `plan` | Plan | Nagłówek, poziomy, kategorie, wpisy, widok początkowy oraz przyciski linii „Dzisiaj” i eksportu. Edytowane w edytorze planu. Domyślnie: puste. |
| `show-today` | Pokaż linię „Dzisiaj” | Funkcja ta jest dostępna wyłącznie jako opcja awaryjna dla planów, które nie posiadają tego przełącznika. W edytorze znajduje się w sekcji **Ustawienia** jako **Pokaż linię „Dzisiaj”**: Ciemna pionowa linia z napisem „Dzisiaj” na osi zaznacza bieżący dzień, o ile znajduje się on w widocznym fragmencie. Ustawienie domyślne: włączone. |
| `allow-export` | Oferuj eksport do Excela | Działa tak samo jak powyżej. W edytorze jako **Oferuj eksport do Excela**: Wyświetla czytelnikom przycisk **Eksportuj**, za pomocą którego mogą pobrać wpisy jako arkusz Excela. Ustawienie domyślne: włączone. |

## Edytor planu

Edytor planu zajmuje cały ekran. U góry znajduje się nagłówek
wspólnej ramki, poniżej po lewej stronie **wpisy**, pośrodku
formularz wybranego wpisu, a po prawej panel **Plan**.

### Nagłówek

| Element sterujący | Opis |
| --- | --- |
| Edytor · Komputer stacjonarny · Tablet · Urządzenie mobilne | **Edytor** wyświetla formularz. Widoki na urządzeniach mobilnych pokazują zamiast niego plan dostosowany do szerokości ekranu — ten sam widok, co na stronie, z powiększeniem, bez filtrów i funkcji eksportu; kliknięcie wpisu powoduje jego zaznaczenie. |
| Status | „3 wpisy zmieniono · poziomy” — co różni się od ostatnio zapisanego stanu. Brak poziomu w wpisie uniemożliwia zapisanie zmian. |
| Cofnij / Powtórz | Cofają zmiany krok po kroku lub przywracają je (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Pomoc | Wyjaśnia obsługę (F1). |
| Anuluj | Zamyka edytor; w przypadku niezapisanych zmian pyta wcześniej, czy mają zostać odrzucone. |
| Zapisz | Zapisuje plan w ustawieniach (⌘/Ctrl S); **Zapisz i zamknij** również za pomocą ⌘/Ctrl ↵. Plan jest zapisywany wraz ze stroną. |

### Pasek boczny „Wpisy”

Po lewej stronie znajduje się lista wpisów, posortowana według terminu, z liczbą („12 z
300”). **Nowy** tworzy **kamień milowy**, **okres** lub **termin**;
bez poziomu można utworzyć tylko termin. Poniżej znajdują się opcje **Przeszukaj wpisy** oraz
wybór typu (**Wszystkie typy**, **Kamienie milowe**, **Okresy**,
**Terminy**, każdy z liczbą; przy aktywnym wyszukiwaniu: wyniki).

### Formularz wpisu

Nad formularzem widnieje napis „Wpis 4 z 12”, rodzaj oraz przyciski **Duplikuj wpis**
i **Usuń wpis**, a poniżej zakładki **Ogólne**
(rodzaj, tytuł, opis, tymczasowy), **Klasyfikacja** (poziom, kategoria,
seria), **Termin** (data lub początek i koniec, w przypadku okresu strzałka na końcu),
**Zależności** oraz **Treść** (powiązana strona lub wpis w aktualnościach,
załączniki). „(Błąd)” za zakładką oznacza nieprawidłowy wpis w tej zakładce;
w przypadku terminów kluczowych nie ma zakładki **Zależności**:

| Pole | Dotyczy | Opis |
| --- | --- | --- |
| Rodzaj | wszystkie | Kamień milowy, przedział czasowy lub termin. W przypadku zmiany na termin pomija się poziom. Bez poziomu termin pozostaje tym, czym jest. |
| Tytuł | wszystkie | Obowiązkowe. Wyświetla się przy wpisie i w szczegółach. |
| Opis | wszystkie | Opcjonalny, wielowierszowy. Wyświetla się tylko w szczegółach i w eksporcie do Excela. |
| Wstępny | wszystkie | Termin nie został jeszcze ustalony; wpis wyświetla się jako kontur lub z przerywaną ramką. |
| Poziom | Kamień milowy, Okres | Poziom, na którym znajduje się wpis. **Nowy poziom …** tworzy nowy poziom (nazwa) i od razu go przypisuje. |
| Kategoria | wszystkie | Określa kolor, a w przypadku kamieni milowych – kształt. „Bez kategorii” wyświetla się na szaro, kamienie milowe jako romby. **Nowa kategoria…** tworzy kategorię (nazwa, kolor i kształt) i natychmiast ją przypisuje. |
| Seria | Kamień milowy, okres | Wpisy tego samego poziomu o tej samej nazwie serii znajdują się w jednym wierszu. Pole to rozwija serie na tym poziomie wraz z liczbą ich wpisów; nowa nazwa wpisana w polu zostanie zapisana jako nowa seria po kliknięciu „„…“ utwórz jako nową serię”, a opcja **Brak serii** usuwa wpis. |
| Data | Kamień milowy, data graniczna | Termin. |
| Początek, koniec | Okres | Pierwszy i ostatni dzień; oba należą do okresu. |
| Strzałka na końcu | Okres | Pasek kończy się grotem strzałki — „trwa dalej”. |
| Zależy od | Kamień milowy, okres | Poprzednicy wpisu; na stronie przedstawieni jako przerywana linia ze strzałką. |
| Powiązanie | wszystkie | **Brak**, **Strona** lub **Wpis w aktualnościach**. Zmiana powoduje usunięcie istniejącego powiązania. Na stronie nazwa wpisu jest wtedy podkreślona, a kliknięcie otwiera treść w oknie nad planem. |
| Strona | wszystkie | Strona Staffbase z listy stron (100 ostatnio edytowanych). **Nowa strona …** tworzy ją w edytorze Staffbase, który nakłada się na edytor planu; po utworzeniu jest ona powiązana. |
| Kanał, wpis | wszystkie | Najpierw kanał wiadomości (z jego typem: artykuł, krótka wiadomość, wpis z obrazkiem), a następnie wpis. Można wybierać wersje robocze, które są oznaczone jako „(wersja robocza)” — czytelnicy zobaczą je dopiero po opublikowaniu. **Nowy wpis…** tworzy wpis w wybranym kanale; po zapisaniu jest on powiązany. **Otwórz w nowej karcie** wyświetla powiązaną treść. |
| Załączniki | wszystkie | Do dziesięciu plików lub obrazów z biblioteki multimediów, każdy z opcjonalnym opisem (w przeciwnym razie wyświetlana jest nazwa pliku). **Dodaj plik lub obraz …** otwiera bibliotekę; strzałki porządkują, krzyżyk usuwa. Załączniki pozostają po zalogowaniu. Na stronie znajdują się obok powiązanej treści lub w szczegółach, a w eksporcie do Excela – w kolumnie „Załączniki”. |
| Duplikuj wpis | wszystkie | Tworzy kopię wpisu. |
| Usuń wpis | wszystkie | Wyświetla monit, a następnie usuwa wpis i wszystkie zależności, które do niego odwołują się; monit wymienia zależne wpisy. |

### Panel „Plan”: Ustawienia

| Element sterujący | Opis |
| --- | --- |
| Tytuł planu | Znajduje się nad planem i nadaje nazwę plikowi Excel. Opcjonalnie: pozostaw puste, jeśli strona ma już odpowiedni nagłówek; plik będzie wtedy nosił nazwę `Plan_projektu_RRRR-MM-DD.xlsx`. |
| Pokaż linię dzisiejszą | Przełącznik, patrz wyżej. Dopóki nie został on nigdy uruchomiony w edytorze, wyświetla się informacja, że blok zachowuje dotychczasowe ustawienie. |
| Oferuj eksport do Excela | Przełącznik, patrz wyżej; to samo. |
| Przejmij ten fragment | Zapisuje widoczny fragment podglądu (widok na komputerze stacjonarnym, tablecie lub urządzeniu mobilnym), z dokładnością do miesiąca, jako widok wyświetlany po załadowaniu strony. Opcja zablokowana, jeśli nie zaznaczono fragmentu. |
| Usuń widok początkowy | Usuwa widok początkowy; po załadowaniu widżet ponownie wyświetla cały plan. |
| Zacznij od szablonu | Tylko w przypadku pustego planu, pośrodku: wyświetla szablony do wyboru („Plan rozwoju produktu”, „Przesunięcie terminu”). Kliknięcie karty wypełnia nią edytor; przycisk **Wstecz** powoduje powrót bez wprowadzania zmian. Nie jest to dostępne w przypadku planu zawierającego wpisy — szablon zastąpiłby je. |
| Zacznij od pustego planu | Tylko w przypadku pustego planu: tworzy warstwę „Warstwa 1”. |

### Panel „Plan”: Poziomy

| Element sterujący | Opis |
| --- | --- |
| Nowy poziom | Tworzy nowy poziom. |
| Nazwa | Nazwa warstwy, po lewej stronie jej ścieżki. Musi być unikalna. Poniżej podana jest liczba wpisów, które zawiera. |
| Strzałki w górę / w dół | Kolejność na stronie oraz w eksporcie do Excela. |
| Usuń | Usuwa warstwę. Jeśli zawiera ona wpisy, edytor zapyta, czy mają one zostać przeniesione do innej warstwy (wybór **warstwy docelowej**), czy też mają zostać usunięte wraz z warstwą. |

### Panel „Plan”: Kategorie

| Element sterujący | Opis |
| --- | --- |
| Nowa kategoria | Tworzy nową kategorię. |
| Pole koloru | Przed nazwą; pokazuje kolor. Kliknięcie powoduje rozwinięcie dwunastu kolorów i pola **wartość szesnastkowa**; klawisz Esc lub kliknięcie obok zamyka okno. |
| Wartość szesnastkowa | Własny kolor w formacie `#RRGGBB`, na przykład `#E40045`. |
| Przycisk kształtu | Obok pola koloru; pokazuje kształt, w jakim wyświetlane są kamienie milowe kategorii. Kliknięcie powoduje rozwinięcie ośmiu kształtów: romb, trójkąt, trójkąt z wierzchołkiem skierowanym w dół, kwadrat, okrąg, sześciokąt, gwiazda lub krzyż. Klawisze strzałek zmieniają kształt. |
| Nazwa | Nazwa w legendzie i w szczegółach. Musi być unikalna. Poniżej podana jest liczba wpisów przypisanych do tej kategorii. |
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
  przyszłości, Dlatego linia ta jest widoczna dopiero po przesunięciu.
- **Nagłówek** określa również nazwę pliku Excel; bez
  włączonej funkcji eksportu pełni on jedynie rolę nagłówka.
- **Tytuł planu**, **Widok początkowy**, **Linia „Dzisiaj”** i **Eksport** są ustawiane w
  edytorze planu, a nie w oknie dialogowym; wszystkie te elementy należą do planu.
