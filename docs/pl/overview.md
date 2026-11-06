# Plan projektu

Ten widget przedstawia plan projektu w formie **osi czasu** — na przykład harmonogram
wprowadzenia pojazdu na rynek, obejmujący targi, rozpoczęcie produkcji seryjnej (SOP) oraz
kamienie milowe projektu rozłożone na kilka lat. Zastępuje on slajd z programu PowerPoint,
który dotychczas był używany do tworzenia takich planów i wstawiany jako obraz: plan
znajduje się bezpośrednio na stronie, można go w każdej chwili edytować, a czytelnicy
mogą samodzielnie przeglądać, filtrować i pobierać go w formie arkusza kalkulacyjnego Excel.

Cały plan jest edytowany w **edytorze planu**, który wyświetla się automatycznie po otwarciu
ustawień.

## Z czego składa się plan

- **Nagłówek** — opcjonalny; znajduje się nad planem i nadaje plikowi Excel
  nazwę.
- **Poziomy** — poziome pasy umieszczone jeden pod drugim, na przykład „Targi”,
  „Premiery / SOP” oraz „Kamienie milowe projektu”. Po lewej stronie znajduje się tytuł każdego z nich.
- **Kategorie** — nadają wpisom kolor i pojawiają się jako legenda
  nad planem, na przykład „MY26 TG Assist” w kolorze fioletowym.
- **Wpisy** w trzech rodzajach:
  - **Kamień milowy** — pojedynczy termin, przedstawiony jako symbol (romb,
    trójkąt, kwadrat lub okrąg) z tytułem poniżej.
  - **Okres** — pasek od początku do końca, na życzenie z
    strzałką na końcu oznaczającą „trwa”.
  - **Termin kluczowy** — termin obowiązujący na wszystkich poziomach, na przykład nowe
    przepisy. Wyświetla się jako przerywana pionowa linia przebiegająca przez cały
    plan, z tytułem poniżej.
- **Seria** — kamienie milowe i okresy tego samego poziomu o tej samej
  nazwie serii znajdują się w jednym wierszu. Jeśli do serii należy jakiś okres,
  kamienie milowe znajdują się na jego pasku; w przeciwnym razie wąski
  pasek łączy pierwszy z ostatnim.
- **Zależności** — przerywane linie ze strzałką od poprzednika do
  następcy, na przykład od „C4S” do powiązanego SOP.
- **Wstępne** — wpis, którego termin nie został jeszcze ustalony. Pojawia się
  tylko jako kontur lub jasno wypełniony z przerywaną ramką.

## Co widzą czytelnicy

Od góry do dołu:

1. **Nagłówek** (jeśli został ustawiony) i **„Stan na: …”** — data ostatniej
   zmiany w planie, w formacie daty zgodnym z językiem strony.
2. **Pasek narzędzi** — wyszukiwanie, **filtry**, powiększenie (**−**, **+**, **Pokaż wszystko**),
  przełącznik **Oś czasu | Lista**, **Eksportuj**,
  **Pełny ekran** i **Pomoc**.
3. **Legenda** — kategorie wraz z ich kolorami. Jedno kliknięcie powoduje
   ukrycie lub ponowne wyświetlenie kategorii.
4. **Plan** — po lewej stronie tytuły warstw, po prawej osi czasu z
   wpisami, a pod ostatnią warstwą tytuły dat kluczowych. Strzałka przy
   nagłówku zwija daną warstwę; opcja **Zwiń wszystko** nad nagłówkami zwija
   wszystkie naraz, a następnie ponownie je rozwija.
5. **Przegląd** — wąski pasek obejmujący cały okres. Ramka
   wskazuje, który fragment jest aktualnie widoczny.

Ponadto:

- **Powiększanie** i **pomniejszanie** odbywa się płynnie: za pomocą przycisków **−** i **+**, przy wciśniętym
  klawiszu Ctrl (Mac: ⌘) i kółku myszy lub dwoma palcami na gładziku i
  ekranie dotykowym. Oś zmienia się przy tym od lat, przez kwartały i miesiące, aż
  do tygodni kalendarzowych i poszczególnych dni.
- **Przesuwanie** odbywa się poprzez przeciągnięcie myszą, przytrzymaniem klawisza Shift i kółkiem myszy,
  przez przesunięcie w poziomie lub przeciągnięcie ramki w widoku ogólnym.
- **Kliknięcie na wpis** otwiera jego szczegóły: rodzaj i termin,
  kategorię, poziom, serię, opis oraz poprzednik i następnik.
- **Filtry** i **wyszukiwanie** dotyczą wyłącznie własnej wizyty; nic nie jest zapisywane ani
  udostępniane innym.
- **Lista** wyświetla te same wpisy w formie tabeli, posortowanej według terminu — jest to
  wygodniejsze rozwiązanie dla czytników ekranu, wąskich ekranów oraz do drukowania.
- **Eksport** pozwala pobrać wpisy jako plik Excel, o ile
  opcja eksportu jest włączona w ustawieniach.
- Ciemna linia **„Dzisiaj”** zaznacza bieżący dzień, o ile jest
  włączona, a dzień ten znajduje się w widocznym fragmencie ekranu.
- Obsługa działa również bez myszy: klawisz Tab przenosi do planu,
  klawisze strzałek przełączają między wpisami, klawisz Enter otwiera szczegóły,
  **+** i **−** powiększają lub pomniejszają widok, a **0** wyświetla wszystko.
- Na wąskich ekranach (o szerokości poniżej 768 pikseli) plan zaczyna się od
  **listy** — w formie kart zamiast tabeli, ponieważ oś czasu nie zajmuje tam
  całej szerokości; przycisk przełączający w menu **Więcej** w każdej chwili przenosi do osi czasu.
  Podobnie filtry i szczegóły otwierają się jako panel z dolnej krawędzi, a
  **Lista** i **Eksportuj** znajdują się w menu **Więcej**.
- **Tryb pełnoekranowy** wyświetla plan na całym ekranie, z tym samym
  sposobem obsługi; przesuwa się tylko sam plan, oś i przegląd pozostają w miejscu.
  Klawisz **Esc** lub opcja **Zamknij tryb pełnoekranowy** powodują powrót do strony. Tam, gdzie przeglądarka nie
  pozwala na prawdziwy tryb pełnoekranowy (np. Safari na iPhonie), plan zajmuje
  całą stronę.
- **Pomoc** wyjaśnia czytelnikom bezpośrednio na stronie, co oznaczają symbole
  (zakładka **Legenda**, zawierająca kategorie tego planu) oraz jak obsługiwać
  plan za pomocą myszy, gładzika, ekranu dotykowego i klawiatury (zakładka **Obsługa**).
  Również w samym planie przycisk **?** otwiera pomoc. W edytorze planu
  przycisk ten nie jest dostępny.
- **Bez wpisów widżet nie wyświetla nic** — ani pustej ramki, ani
  komunikatu o błędzie.

## Co widać w edytorze CMS

W górnej części edytora planu znajduje się **podgląd**: ta sama oś czasu, co na
stronie, z funkcją powiększania, ale bez filtrów, listy i opcji eksportu. Kliknięcie
wpisu w podglądzie zaznacza go do edycji. Aby sprawdzić, jak czytelnicy widzą plan
z wszystkimi filtrami i opcją eksportu, należy skorzystać z podglądu strony.
