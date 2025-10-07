# 📚 Instrukcja Użytkownika
## Narzędzie do Wizualizacji Przepływów Finansowych

**Wersja:** 2.0 (Finalna)  
**Data:** 7 października 2025  
**Kompatybilność:** Windows, macOS, Linux

---

## 🎯 Cel Narzędzia

To narzędzie służy do wizualizacji przepływów finansowych między podmiotami na podstawie historii transakcji z pliku CSV. Generuje grafiki wektorowe (SVG) przedstawiające diagram Sankey - typ wykresu idealny do prezentacji przepływu wartości między węzłami.

**Dwie wersje dostępu:**
1. **Standalone Python** - szybkie generowanie wykresów z linii komend
2. **Aplikacja Webowa** - pełny interfejs graficzny z zakładkami i modalami

---

## 📋 Wymagania

### Minimalne wymagania techniczne:
- **Python 3.9 lub nowszy** - sprawdź wersję:
  - macOS/Linux: `python3 --version`
  - Windows: `python --version`
- **Node.js 18+ i npm** (tylko dla wersji webowej)
- **Przeglądarka internetowa** (Chrome, Firefox, Safari, Edge)
- **Plik CSV z danymi** o przepływach finansowych

### Wymagane biblioteki:
✅ **TYLKO bezpłatne standardowe biblioteki Python:**
- `csv` - przetwarzanie plików CSV
- `json` - obsługa danych JSON  
- `datetime` - operacje na datach
- `collections` - struktury danych
- `os` - operacje systemowe
- `pathlib` - ścieżki plików

**✅ ZERO zewnętrznych zależności dla wersji standalone!**

---

## 📁 Format Pliku CSV

### Wymagane kolumny:

| Kolumna | Opis | Przykład | Wymagane |
|---------|------|----------|----------|
| **Nadawca** | Nazwa podmiotu wysyłającego | "Firma A" | ✅ TAK |
| **Odbiorca** | Nazwa podmiotu odbierającego | "Firma B" | ✅ TAK |
| **Kwota** | Wartość transakcji | 15000.50 | ✅ TAK |
| **Data** | Data transakcji | 2024-01-15 | ⚪ Nie (dla filtrowania) |
| **Opis** | Opis transakcji | "Płatność za usługi" | ⚪ Nie |

### Przykładowy plik CSV:

```csv
Nadawca,Odbiorca,Kwota,Data,Opis
Firma A,Firma B,15000.50,2024-01-15,Płatność za usługi
Firma B,Firma C,8500.00,2024-01-20,Zakup materiałów
Firma A,Firma C,12000.00,2024-02-01,Inwestycja
Firma C,Firma D,5500.75,2024-02-10,Wynagrodzenie
Firma A,Firma D,7800.00,2024-02-15,Konsulting
```

### Obsługiwane formaty kwot:
- `15000.50` (kropka dziesiętna)
- `15000,50` (przecinek dziesiętny)
- `15 000.50` (spacje jako separator tysięcy)
- `15 000,50` (spacje + przecinek)

### Obsługiwane formaty dat:
- `2024-01-15` (YYYY-MM-DD) ← ZALECANE
- `2024/01/15` (YYYY/MM/DD)
- `15-01-2024` (DD-MM-YYYY)

---

## 🚀 Metoda 1: Standalone Python (Szybka)

### Krok 1: Przygotuj plik CSV

Umieść swój plik CSV w folderze `python-scripts/` lub użyj przykładowego.

### Krok 2: Edytuj parametry (opcjonalnie)

Otwórz plik `python-scripts/flows_standalone.py` i edytuj sekcję na początku:

```python
# =============================================================================
# PARAMETRY UŻYTKOWNIKA - EDYTUJ TĘ SEKCJĘ
# =============================================================================

# Ścieżka do pliku wejściowego CSV
CSV_INPUT_FILE = 'dane_transakcji.csv'  # ← Zmień na swoją nazwę pliku

# Ścieżka do pliku wyjściowego SVG
SVG_OUTPUT_FILE = 'wykres_przeplywow.svg'

# NAZWY KOLUMN w pliku CSV (dostosuj do swojego pliku)
COLUMN_SENDER = 'Nadawca'      # Kolumna z nadawcą
COLUMN_RECEIVER = 'Odbiorca'   # Kolumna z odbiorcą
COLUMN_AMOUNT = 'Kwota'        # Kolumna z kwotą
COLUMN_DATE = 'Data'           # Kolumna z datą (opcjonalne)

# FILTRY (pozostaw puste [] lub '' aby nie filtrować)
FILTER_ENTITIES = []           # Przykład: ['Firma A', 'Firma B']
FILTER_DATE_FROM = ''          # Przykład: '2024-01-01'
FILTER_DATE_TO = ''            # Przykład: '2024-12-31'

# PARAMETRY WIZUALIZACJI
SVG_WIDTH = 800               # Szerokość wykresu w pikselach
SVG_HEIGHT = 600              # Wysokość wykresu w pikselach
SVG_MARGIN = 100              # Margines dookoła wykresu
NODE_WIDTH = 20               # Szerokość węzłów (pasków)
```

### Krok 3: Uruchom skrypt

**macOS/Linux:**
```bash
cd python-scripts
python3 flows_standalone.py
```

**Windows:**
```cmd
cd python-scripts
python flows_standalone.py
```

### Krok 4: Otwórz wygenerowany wykres

**macOS:**
```bash
open wykres_przeplywow.svg
```

**Windows:**
```cmd
start wykres_przeplywow.svg
```

**Linux:**
```bash
xdg-open wykres_przeplywow.svg
```

Lub po prostu kliknij dwukrotnie na plik `wykres_przeplywow.svg` w eksploratorze plików.

---

## 🌐 Metoda 2: Aplikacja Webowa (GUI)

### Krok 1: Instalacja (jednorazowa)

**macOS/Linux:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Python
cd ../python-scripts
pip3 install -r requirements.txt
```

**Windows:**
```cmd
# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install

# Python
cd ..\python-scripts
pip install -r requirements.txt
```

### Krok 2: Uruchomienie

Otwórz **DWA terminale** (lub dwie zakładki w terminalu):

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Poczekaj na: `🚀 Backend server running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Poczekaj na: `✓ Ready in XXXms`

### Krok 3: Otwórz w przeglądarce

```
http://localhost:3000
```

### Krok 4: Używanie Interfejsu

#### **Zakładka "Rejestr Dokumentów Finansowych"**

1. **Dodawanie dokumentu:**
   - Kliknij "Wybierz plik"
   - Wybierz plik CSV z dysku (lub z folderu `przyklady_csv/`)
   - Kliknij "Wyślij"
   - Plik zostanie automatycznie przetworzony

2. **Przeglądanie dokumentów:**
   - Lista wszystkich wgranych plików
   - Każdy plik pokazuje:
     - Nazwę pliku
     - Rozmiar
     - Datę dodania

3. **Akcje na dokumentach:**
   - **Ikona "i"** - Wyświetla szczegóły pliku w modalu:
     - Data dodania
     - Liczba wpisów
     - Liczba unikalnych firm
     - Liczba transakcji
   - **Ikona kosza** - Usuwa dokument:
     - Pojawi się modal z prośbą o potwierdzenie
     - Kliknij "Usuń" aby potwierdzić
     - Lub "Anuluj" aby wrócić

#### **Zakładka "Diagram Przepływów"**

1. **Jeśli nie ma dokumentów:**
   - Zobaczysz komunikat: "Brak dokumentów do przetwarzania..."
   - Kliknij przycisk "Przejdź do zakładki Rejestr dokumentów..."

2. **Generowanie diagramu:**
   - **(Opcjonalnie)** Ustaw datę początkową i końcową
   - **(Opcjonalnie)** Wybierz konkretne podmioty z listy
   - Kliknij **"Wygeneruj Diagram"**
   - Wykres Sankey pojawi się poniżej

3. **Podsumowanie:**
   - Pod wykresem zobaczysz tabelę z:
     - Liczba przetworzonych dokumentów
     - Liczba unikalnych firm
     - Liczba transakcji
   - To podsumowanie generuje się automatycznie po wygenerowaniu wykresu

4. **Czyszczenie filtrów:**
   - Kliknij **"Wyczyść wszystko"** aby zresetować filtry

---

## 📊 Przykłady Użycia

### Przykład 1: Wizualizacja wszystkich przepływów

**Standalone Python:**
```python
# W flows_standalone.py
CSV_INPUT_FILE = 'dane_transakcji.csv'
FILTER_ENTITIES = []        # Brak filtrowania
FILTER_DATE_FROM = ''
FILTER_DATE_TO = ''
```

**Aplikacja Webowa:**
1. Wgraj plik CSV
2. Przejdź do zakładki "Diagram Przepływów"
3. Kliknij "Wygeneruj Diagram" (bez ustawiania filtrów)

### Przykład 2: Filtrowęnie według firm

**Standalone Python:**
```python
# W flows_standalone.py
FILTER_ENTITIES = ['Firma A', 'Firma B', 'Firma C']
```

**Aplikacja Webowa:**
1. W zakładce "Diagram Przepływów"
2. W sekcji "Wybierz podmioty" zaznacz: Firma A, Firma B, Firma C
3. Kliknij "Wygeneruj Diagram"

### Przykład 3: Filtrowanie według zakresu dat

**Standalone Python:**
```python
# W flows_standalone.py
FILTER_DATE_FROM = '2024-01-01'
FILTER_DATE_TO = '2024-06-30'
```

**Aplikacja Webowa:**
1. W zakładce "Diagram Przepływów"
2. Ustaw "Data od": 2024-01-01
3. Ustaw "Data do": 2024-06-30
4. Kliknij "Wygeneruj Diagram"

### Przykład 4: Kombinacja filtrów

**Standalone Python:**
```python
# W flows_standalone.py
FILTER_ENTITIES = ['Firma A', 'Firma B']
FILTER_DATE_FROM = '2024-03-01'
FILTER_DATE_TO = '2024-03-31'
```

**Aplikacja Webowa:**
1. Zaznacz firmy: Firma A, Firma B
2. Ustaw daty: 2024-03-01 do 2024-03-31
3. Kliknij "Wygeneruj Diagram"

---

## 📂 Przykładowe Dane

W folderze `przyklady_csv/` znajdziesz **10 gotowych przykładów**:

| Plik | Opis | Firmy | Transakcje |
|------|------|-------|------------|
| `01_lancuch_dostaw.csv` | Łańcuch dostaw w produkcji | 6 | 15 |
| `02_ekosystem_startupowy.csv` | Finansowanie startupów | 7 | 15 |
| `03_platforma_ecommerce.csv` | E-commerce | 7 | 15 |
| `04_agencja_kreatywna.csv` | Agencja reklamowa | 6 | 15 |
| `05_sektor_energetyczny.csv` | Handel energią | 6 | 15 |
| `06_ekosystem_edukacyjny.csv` | Edukacja | 7 | 15 |
| `07_eksport_import.csv` | Handel międzynarodowy | 6 | 15 |
| `08_siec_franczyzowa.csv` | Franczyzy | 5 | 15 |
| `09_fundusz_inwestycyjny.csv` | Fundusze VC | 6 | 15 |
| `10_platforma_streamingowa.csv` | Streaming muzyczny | 6 | 15 |

**Każdy plik zawiera realistyczne dane do testowania różnych scenariuszy biznesowych!**

---

## 🐛 Rozwiązywanie Problemów

### Problem 1: Python nie działa

**Objaw:**
```
python: command not found
```

**Rozwiązanie (macOS/Linux):**
```bash
# Sprawdź czy Python jest zainstalowany
python3 --version

# Jeśli nie, zainstaluj:
# macOS:
brew install python3

# Linux (Ubuntu/Debian):
sudo apt update
sudo apt install python3 python3-pip
```

**Rozwiązanie (Windows):**
1. Pobierz Python z https://www.python.org/downloads/
2. Podczas instalacji zaznacz "Add Python to PATH"
3. Zrestartuj terminal
4. Sprawdź: `python --version`

---

### Problem 2: Backend nie uruchamia się

**Objaw:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Rozwiązanie (macOS/Linux):**
```bash
# Znajdź proces na porcie 3001
lsof -i :3001

# Zabij proces
kill -9 <PID>
```

**Rozwiązanie (Windows):**
```cmd
# Znajdź proces
netstat -ano | findstr :3001

# Zabij proces
taskkill /PID <PID> /F
```

---

### Problem 3: Frontend nie łączy się z backendem

**Objaw:**
```
AxiosError: Network Error
```

**Rozwiązanie:**
1. Upewnij się, że backend działa (Terminal 1): `🚀 Backend server running...`
2. Sprawdź czy port 3001 jest otwarty: http://localhost:3001
3. Zrestartuj oba serwery (backend i frontend)
4. Wyczyść cache przeglądarki (Ctrl+Shift+R lub Cmd+Shift+R)

---

### Problem 4: Wykres SVG nie generuje się

**Objaw (standalone):**
```
FileNotFoundError: [Errno 2] No such file or directory: 'dane_transakcji.csv'
```

**Rozwiązanie:**
1. Sprawdź czy plik CSV istnieje w folderze `python-scripts/`
2. Sprawdź poprawność nazwy pliku w `CSV_INPUT_FILE`
3. Użyj pełnej ścieżki: `CSV_INPUT_FILE = '/pelna/sciezka/do/pliku.csv'`

**Objaw (webowa):**
```
Error: SVG file not generated
```

**Rozwiązanie:**
1. Sprawdź logi backendu w terminalu
2. Upewnij się że plik `python-scripts/flows.py` istnieje
3. Sprawdź czy Python jest dostępny: `python3 --version` (Mac) lub `python --version` (Win)

---

### Problem 5: Plik CSV nie wczytuje się

**Objaw:**
```
CSV must contain Nadawca and Odbiorca columns
```

**Rozwiązanie:**
1. Sprawdź czy pierwszy wiersz zawiera nazwy kolumn
2. Upewnij się że są kolumny "Nadawca" i "Odbiorca" (lub zmień nazwy w parametrach)
3. Sprawdź kodowanie pliku (powinno być UTF-8)

**Przykład poprawnego pliku:**
```csv
Nadawca,Odbiorca,Kwota,Data,Opis
Firma A,Firma B,1000,2024-01-01,Test
```

---

### Problem 6: TypeScript errors w backendie

**Objaw:**
```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
```

**Rozwiązanie:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Problem 7: Modal się nie otwiera

**Objaw:**
Kliknięcie ikony "i" lub kosza nie pokazuje modalu.

**Rozwiązanie:**
1. Sprawdź konsolę przeglądarki (F12) dla błędów
2. Wyczyść cache przeglądarki (Ctrl+Shift+R)
3. Zrestartuj frontend
4. Użyj innej przeglądarki (Chrome, Firefox)

---

## 💡 Najlepsze Praktyki

### 1. Przygotowanie danych CSV
- ✅ Używaj UTF-8 encoding
- ✅ Pierwszy wiersz = nazwy kolumn
- ✅ Kwoty jako liczby (bez symboli walut)
- ✅ Daty w formacie YYYY-MM-DD
- ❌ Unikaj pustych wierszy
- ❌ Unikaj specjalnych znaków w nazwach firm

### 2. Optymalizacja wykresów
- Dla dużych zbiorów danych (>100 transakcji):
  - Użyj filtrów według firm
  - Użyj filtrów według dat
  - Podziel dane na mniejsze pliki

### 3. Organizacja plików
- Przechowuj pliki CSV w dedykowanym folderze
- Używaj opisowych nazw: `transakcje_2024_Q1.csv`
- Twórz kopie zapasowe przed modyfikacją

### 4. Wydajność
- **Standalone Python:** Najszybsze dla dużych plików
- **Aplikacja Webowa:** Najlepsze dla interaktywnej analizy

---

## 📖 Dla Uczących Się Programowania

### Jak działa skrypt Python?

1. **Wczytanie danych** (funkcja `load_csv_data`):
   ```python
   with open(csv_path, 'r', encoding='utf-8') as f:
       reader = csv.DictReader(f)
       data = list(reader)
   ```

2. **Filtrowanie** (funkcja `filter_data`):
   ```python
   if entities:
       filtered = [row for row in data if row[sender_col] in entities or row[receiver_col] in entities]
   ```

3. **Agregacja** (funkcja `aggregate_flows`):
   ```python
   flows = defaultdict(float)
   for row in data:
       key = (row[sender_col], row[receiver_col])
       flows[key] += amount
   ```

4. **Generowanie SVG** (funkcja `generate_sankey_svg`):
   ```python
   svg = f'<svg width="{width}" height="{height}">'
   # ... rysowanie węzłów i przepływów
   svg += '</svg>'
   ```

### Modyfikacje dla zaawansowanych

#### Zmiana kolorów przepływów:
```python
# W funkcji generate_sankey_svg, linia ~350
flow_color = f'rgba(66, 135, 245, {opacity})'  # Niebieski
# Zmień na:
flow_color = f'rgba(245, 66, 66, {opacity})'   # Czerwony
flow_color = f'rgba(66, 245, 135, {opacity})'  # Zielony
```

#### Dodanie nowych filtrów (np. kwota minimalna):
```python
# Dodaj w sekcji PARAMETRY
MIN_AMOUNT = 1000

# W funkcji filter_data, dodaj:
if MIN_AMOUNT:
    filtered = [row for row in filtered if float(row[amount_col]) >= MIN_AMOUNT]
```

---

## 📞 Wsparcie

**Więcej informacji:**
- **README.md** - Ogólna dokumentacja projektu
- **START_TUTAJ.md** - Szybki start
- **ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md** - Analiza wymagań

**W razie problemów:**
1. Sprawdź sekcję "Rozwiązywanie Problemów" powyżej
2. Przeczytaj README.md
3. Sprawdź logi w terminalach (backend i frontend)

---

## ✅ Checklist przed użyciem

**Instalacja (jednorazowa):**
- [ ] Python 3.9+ zainstalowany
- [ ] Node.js 18+ zainstalowany (jeśli webowa)
- [ ] Zależności zainstalowane (`npm install`, `pip install`)

**Przygotowanie danych:**
- [ ] Plik CSV przygotowany
- [ ] Zawiera wymagane kolumny (Nadawca, Odbiorca, Kwota)
- [ ] Encoding UTF-8
- [ ] Daty w formacie YYYY-MM-DD

**Uruchomienie:**
- [ ] Backend działa (jeśli webowa)
- [ ] Frontend działa (jeśli webowa)
- [ ] Plik CSV w odpowiednim folderze

**Generowanie wykresu:**
- [ ] Parametry ustawione (standalone) lub filtry wybrane (webowa)
- [ ] Kliknięto "Wygeneruj Diagram" (webowa)
- [ ] Wykres SVG wygenerowany i widoczny

---

**Powodzenia w analizie przepływów finansowych! 📊💰**

**Wersja:** 2.0 (Finalna)  
**Data:** 7 października 2025  
**Status:** ✅ Kompletna instrukcja
