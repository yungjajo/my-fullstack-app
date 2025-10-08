# 🚀 START TUTAJ - Szybki Start

## 📊 Aplikacja do Wizualizacji Przepływów Finansowych

**Wersja:** 2.0  
**Status:** ✅ W pełni funkcjonalna  
**Kompatybilność:** Windows, macOS, Linux

---

## ⚡ Szybki Test (2 metody)

### Metoda 1: Standalone Python (najszybsza - 30 sekund)

```bash
# 1. Przejdź do folderu ze skryptami
cd python-scripts

# 2. Uruchom skrypt (używa przygotowanego pliku przykładowego)
# macOS/Linux:
python3 flows_standalone.py

# Windows:
python flows_standalone.py

# 3. Otwórz wygenerowany wykres
# macOS:
open wykres_przeplywow.svg
# Windows:
start wykres_przeplywow.svg
# Linux:
xdg-open wykres_przeplywow.svg
```

**✅ Gotowe! Wykres Sankey został wygenerowany!**

---

### Metoda 2: Aplikacja Webowa (pełny interfejs GUI)

**Wymagania wstępne:**
- Node.js v18+ (sprawdź: `node --version`)
- Python 3.9+ (sprawdź: `python3 --version` lub `python --version`)

**KROK 1: Instalacja zależności** (raz przy pierwszym uruchomieniu)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Python (macOS/Linux)
cd ../python-scripts
pip3 install -r requirements.txt

# Python (Windows)
cd ..\python-scripts
pip install -r requirements.txt
```

**KROK 2: Uruchomienie aplikacji** (dwa terminale)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Poczekaj na komunikat: `🚀 Backend server running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Poczekaj na komunikat: `✓ Ready in XXXms`

**KROK 3: Otwórz w przeglądarce:**

```
http://localhost:3000
```

**✅ Aplikacja działa!** 🎉

---

## 🎯 Funkcje Aplikacji

### Zakładka "Diagram Przepływów"
- 📊 Wykres Sankey na pełną szerokość
- 📅 Filtry zakresu dat (Od/Do)
- 🏢 Filtry według podmiotów
- 📈 Podsumowanie: liczba dokumentów, firm, transakcji
- 🎨 Profesjonalna wizualizacja SVG

### Zakładka "Rejestr Dokumentów Finansowych"
- 📁 Lista wszystkich dokumentów w systemie
- ➕ Wgrywanie nowych plików CSV
- 🗑️ Usuwanie dokumentów (z potwierdzeniem)
- ℹ️ Szczegóły plików (data dodania, liczba wpisów, firm, transakcji)
- 📊 Licznik dokumentów w rejestrze

---

## 📚 Dokumentacja

**Przeczytaj w tej kolejności:**

1. **README.md** ⭐ START
   - Kompletna instrukcja krok po kroku
   - Instalacja dla świeżego repozytorium
   - Rozwiązywanie problemów Windows/Mac/Linux

2. **ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md**
   - Weryfikacja zgodności z wymaganiami (100%)
   - Dowody spełnienia wszystkich punktów

3. **INSTRUKCJA_UŻYTKOWNIKA.md**
   - Jak używać narzędzia
   - Format plików CSV
   - Przykłady użycia

4. **POPRAWKI_I_ZMIANY.md**
   - Historia zmian
   - Szczegóły implementacji

---

## 📂 Przykładowe Dane

W folderze `przyklady_csv/` znajdziesz **10 różnorodnych przykładów** CSV:

```
przyklady_csv/
├── 01_lancuch_dostaw.csv          # Łańcuch dostaw w produkcji
├── 02_ekosystem_startupowy.csv    # Finansowanie startupów VC
├── 03_platforma_ecommerce.csv     # Przepływy e-commerce
├── 04_agencja_kreatywna.csv       # Agencja reklamowa
├── 05_sektor_energetyczny.csv     # Handel energią
├── 06_ekosystem_edukacyjny.csv    # Edukacja i szkolenia
├── 07_eksport_import.csv          # Handel międzynarodowy
├── 08_siec_franczyzowa.csv        # Franczyzy gastronomiczne
├── 09_fundusz_inwestycyjny.csv    # Fundusze VC i startupy
└── 10_platforma_streamingowa.csv  # Streaming muzyczny
```

**Jak użyć przykładów:**
1. Otwórz aplikację webową
2. Przejdź do zakładki "Rejestr Dokumentów Finansowych"
3. Kliknij "Wybierz plik" i wybierz dowolny plik z folderu `przyklady_csv/`
4. Kliknij "Wyślij"
5. Przejdź do zakładki "Diagram Przepływów"
6. Kliknij "Wygeneruj Diagram"

---

## 🔑 Kluczowe Pliki

### Do zaprezentowania:

✅ **python-scripts/flows_standalone.py** (450+ linii)
- Główny skrypt - W PEŁNI SKOMENTOWANY
- Sekcja PARAMETRY UŻYTKOWNIKA na początku
- ZERO zewnętrznych zależności (tylko standardowe biblioteki Python)

✅ **przyklady_csv/** (10 plików)
- Różnorodne scenariusze biznesowe
- Gotowe do wgrania i testowania

✅ **backend/src/index.ts** (220 linii)
- Backend API z automatyczną detekcją systemu (Windows/Mac)
- REST endpoints dla frontendu

✅ **frontend/app/components/FileUpload.tsx** (577 linii)
- Nowoczesny interfejs z zakładkami
- React 19 + TypeScript + Tailwind

✅ **Dokumentacja** (4 pliki .md)
- README.md - Kompletna instrukcja
- ZGODNOŚĆ_Z_WYMAGANIAMI_KONKURSU.md - Analiza zgodności
- INSTRUKCJA_UŻYTKOWNIKA.md - Przewodnik użytkownika
- POPRAWKI_I_ZMIANY.md - Historia rozwoju

---

## ✨ Co wyróżnia to rozwiązanie?

### 1. **Kompatybilność Cross-Platform**
- ✅ Windows, macOS, Linux
- ✅ Automatyczna detekcja systemu operacyjnego
- ✅ Uniwersalne komendy Python (`python` vs `python3`)

### 2. **Profesjonalny Interfejs Użytkownika**
- ✅ Zakładki: Diagram + Rejestr
- ✅ Modalne okna potwierdzenia
- ✅ Informacje o plikach (ikona "i")
- ✅ Responsywny design

### 3. **Zaawansowane Funkcje**
- ✅ Filtrowanie według podmiotów i dat
- ✅ Agregacja przepływów
- ✅ Automatyczne rozmieszczenie węzłów
- ✅ Podsumowania statystyczne

### 4. **Dwie Wersje**
- ✅ Standalone Python (CLI) - szybkie generowanie
- ✅ Aplikacja webowa (GUI) - pełny interfejs

### 5. **Jakość Kodu**
- ✅ Zero duplikatów
- ✅ Zoptymalizowany kod
- ✅ Pełne komentarze
- ✅ TypeScript + ESLint

---

## 🛠️ Specyfikacja Techniczna

### Backend:
- **Node.js** 18+
- **Express** 5.1.0 (ESM)
- **TypeScript** 5.9+
- **Multer** 2.0 (upload plików)

### Frontend:
- **Next.js** 15.5.4 (Turbopack)
- **React** 19.1.0
- **TypeScript** 5+
- **Tailwind CSS** 4

### Python:
- **Python** 3.9+
- **Biblioteki:** TYLKO standardowe (csv, json, datetime, collections, os)

### Format Danych:
- **Wejście:** CSV
- **Wyjście:** SVG (grafika wektorowa)
- **Typ wykresu:** Sankey diagram

---

## 💡 Szybkie Modyfikacje

### Zmień plik wejściowy (flows_standalone.py):
```python
# Linia ~33
CSV_INPUT_FILE = 'twoj_plik.csv'
```

### Filtruj według firm:
```python
# Linia ~48
FILTER_ENTITIES = ['Firma A', 'Firma B']
```

### Filtruj według dat:
```python
# Linia ~50-51
FILTER_DATE_FROM = '2024-01-01'
FILTER_DATE_TO = '2024-06-30'
```

### Zmień rozmiar wykresu:
```python
# Linia ~54-55
SVG_WIDTH = 1200
SVG_HEIGHT = 800
```

---

## 🐛 Rozwiązywanie Problemów

### Backend nie uruchamia się (Port zajęty)

**macOS/Linux:**
```bash
lsof -i :3001
kill -9 <PID>
```

**Windows:**
```cmd
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Python nie działa

**macOS/Linux:**
```bash
python3 --version
pip3 install -r requirements.txt
```

**Windows:**
```cmd
python --version
pip install -r requirements.txt
```

### TypeScript errors

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Wsparcie

**Wszelkie pytania?** Zobacz:
- `README.md` - Sekcja "Rozwiązywanie problemów"
- `INSTRUKCJA_UŻYTKOWNIKA.md` - Szczegółowe instrukcje

---

## 🏆 Status Projektu

✅ **GOTOWE DO UŻYCIA**

- [x] Wszystkie wymagania spełnione (100%)
- [x] Kod zoptymalizowany (usunięto duplikaty)
- [x] Dokumentacja zaktualizowana
- [x] Kompatybilność Windows/Mac/Linux
- [x] Testy wykonane na obu systemach
- [x] 10 przykładów CSV dołączonych
- [x] Interfejs z zakładkami
- [x] Modalne okna potwierdzenia

---

